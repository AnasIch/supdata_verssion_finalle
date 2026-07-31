<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Agency;
use App\Models\CategoryThreshold;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocalAdminStockController extends Controller
{
    public function __construct(
        private AuditLogService $auditLogService,
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $query = Product::query()->with('agency')->withCategoryThreshold();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('products.name', 'like', "%{$search}%")
                  ->orWhere('products.reference', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('products.category', $request->category);
        }

        if ($request->filled('agency') && $request->agency !== 'all') {
            $agency = Agency::where('name', $request->agency)->first();
            if ($agency) {
                $query->where('products.agency_id', $agency->id);
            }
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->filterByStatus($request->status);
        }

        $query->orderBy('products.name', 'asc');

        $products = $query->paginate(10)->withQueryString();

        $base = Product::query()->withCategoryThreshold();
        $cbId = Agency::where('name', 'like', '%Casablanca%')->value('id');
        $mkId = Agency::where('name', 'like', '%Marrakech%')->value('id');

        $stats = [
            'total' => Product::query()->count(),
            'critical' => (clone $base)->filterByStatus('low')->count(),
            'outOfStock' => Product::query()->where('quantity_in_stock', 0)->count(),
            'overstock' => (clone $base)->filterByStatus('overstock')->count(),
            'casablanca' => $cbId ? Product::where('agency_id', $cbId)->count() : 0,
            'marrakech' => $mkId ? Product::where('agency_id', $mkId)->count() : 0,
        ];

        $categories = Product::distinct()
            ->pluck('category')
            ->filter()
            ->sort()
            ->values()
            ->toArray();

        $agencies = Agency::orderBy('name')->pluck('name')->toArray();

        $capacities = Agency::orderBy('name')->get()->map(fn ($agency) => [
            'id' => $agency->id,
            'name' => $agency->name,
            'capacity' => $agency->storage_capacity,
            'used' => (int) $agency->products()->sum('quantity_in_stock'),
        ])->values();

        $this->auditLogService->log(
            user: $user,
            action: 'Consultation',
            module: 'Stock',
            description: 'Consultation du stock global (toutes agences)',
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        return Inertia::render('Dashboard/LocalAdmin/Stock/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Administrateur Local',
                'agency' => $user->agency->name ?? '—',
            ],
            'products' => collect($products->items())->map(
                fn (Product $product) => $product->toStockPayload(withThresholdMeta: true)
            )->values(),
            'productsMeta' => [
                'currentPage' => $products->currentPage(),
                'lastPage' => $products->lastPage(),
                'total' => $products->total(),
                'perPage' => $products->perPage(),
            ],
            'stats' => $stats,
            'categories' => $categories,
            'agencies' => $agencies,
            'capacities' => $capacities,
            'categoryThresholds' => $this->categoryThresholdRows(),
            'filters' => $request->only(['search', 'category', 'status', 'agency']),
        ]);
    }

    public function show(int $id, Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $product = Product::query()
            ->with('agency')
            ->withCategoryThreshold()
            ->where('products.id', $id)
            ->first();

        if (!$product) {
            return back()->withErrors(['product' => 'Produit introuvable.']);
        }

        $computedStatus = $product->stockStatus();

        $this->auditLogService->log(
            user: $user,
            action: 'Consultation',
            module: 'Stock',
            description: "Consultation du produit « {$product->name} »",
            target: $product->name,
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        return Inertia::render('Dashboard/LocalAdmin/Stock/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Administrateur Local',
                'agency' => $user->agency->name ?? '—',
            ],
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'reference' => $product->reference,
                'category' => $product->category,
                'agency_id' => $product->agency_id,
                'unit_price' => (float) $product->unit_price,
                'quantity_in_stock' => $product->quantity_in_stock,
                'reserved_quantity' => $product->reserved_quantity,
                'minimum_stock' => $product->effectiveMinimumStock(),
                'maximum_stock' => $product->effectiveMaximumStock(),
                'explicit_minimum_stock' => $product->minimum_stock,
                'explicit_maximum_stock' => $product->maximum_stock,
                'category_minimum_stock' => $product->category_minimum_stock !== null ? (int) $product->category_minimum_stock : null,
                'category_maximum_stock' => $product->category_maximum_stock !== null ? (int) $product->category_maximum_stock : null,
                'threshold_source' => $product->thresholdSource(),
                'status' => $computedStatus,
                'agency' => [
                    'name' => $product->agency->name ?? '—',
                ],
                'updated_at' => $product->updated_at->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
                'created_at' => $product->created_at->locale('fr')->isoFormat('DD MMM YYYY'),
            ],
        ]);
    }

    public function updateThresholds(int $id, Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $product = Product::find($id);

        if (!$product) {
            return back()->withErrors(['product' => 'Produit introuvable.']);
        }

        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'minimum_stock' => ['required', 'integer', 'min:0'],
            'maximum_stock' => ['nullable', 'integer', 'min:0'],
        ]);

        if ((int) $data['product_id'] !== (int) $product->id) {
            return back()->withErrors([
                'product_id' => 'Identifiant produit invalide.',
            ]);
        }

        $agencyId = $product->agency_id;

        if ($data['maximum_stock'] !== null && $data['maximum_stock'] < $data['minimum_stock']) {
            return back()->withErrors([
                'maximum_stock' => 'Le seuil maximum doit être supérieur ou égal au seuil minimum.',
            ]);
        }

        $product->update([
            'minimum_stock' => $data['minimum_stock'],
            'maximum_stock' => $data['maximum_stock'],
            'overrides_threshold' => true,
        ]);

        $this->auditLogService->log(
            user: $user,
            action: 'Modification',
            module: 'Stock',
            description: "Mise à jour des seuils du produit « {$product->name} » (agence " . ($product->agency?->name ?? $agencyId) . ", min {$data['minimum_stock']}, max " . ($data['maximum_stock'] ?? '—') . ')',
            target: $product->name,
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        return back()->with('success', 'Seuils de stock mis à jour avec succès.');
    }

    public function updateCategoryThresholds(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'minimum_stock' => ['nullable', 'integer', 'min:0'],
            'maximum_stock' => ['nullable', 'integer', 'min:0'],
        ]);

        $product = Product::findOrFail($data['product_id']);
        $agencyId = $product->agency_id;
        $category = $product->category;

        $minimum = $data['minimum_stock'] ?? 0;

        if ($data['maximum_stock'] !== null && $data['maximum_stock'] < $minimum) {
            return back()->withErrors([
                'maximum_stock' => 'Le seuil maximum doit être supérieur ou égal au seuil minimum.',
            ]);
        }

        $agency = Agency::find($agencyId);

        CategoryThreshold::updateOrCreate(
            ['agency_id' => $agencyId, 'category' => $category],
            ['minimum_stock' => $minimum, 'maximum_stock' => $data['maximum_stock']],
        );

        $this->auditLogService->log(
            user: $user,
            action: 'Modification',
            module: 'Stock',
            description: "Mise à jour des seuils de la catégorie « {$category} » (agence " . ($agency->name ?? '—') . ", min {$minimum}, max " . ($data['maximum_stock'] ?? '—') . ')',
            target: $category,
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        return back()->with('success', 'Seuils de la catégorie mis à jour avec succès.');
    }

    private function categoryThresholdRows(): array
    {
        $agencies = Agency::pluck('name', 'id');
        $existing = CategoryThreshold::query()->get()->keyBy(
            fn (CategoryThreshold $threshold) => $threshold->agency_id . '|' . $threshold->category
        );

        $pairs = Product::query()
            ->select('agency_id', 'category')
            ->selectRaw('MIN(id) as product_id')
            ->groupBy('agency_id', 'category')
            ->orderBy('category')
            ->orderBy('agency_id')
            ->get();

        return $pairs->map(function ($row) use ($agencies, $existing) {
            $threshold = $existing->get($row->agency_id . '|' . $row->category);

            return [
                'product_id' => $row->product_id,
                'agency_id' => $row->agency_id,
                'agency' => $agencies[$row->agency_id] ?? '—',
                'category' => $row->category,
                'minimum_stock' => $threshold?->minimum_stock,
                'maximum_stock' => $threshold?->maximum_stock,
            ];
        })->values()->toArray();
    }
}
