<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Agency;
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

        $query = Product::with('agency');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('agency') && $request->agency !== 'all') {
            $agency = Agency::where('name', $request->agency)->first();
            if ($agency) {
                $query->where('agency_id', $agency->id);
            }
        }

        if ($request->filled('status') && $request->status !== 'all') {
            match ($request->status) {
                'available' => $query->whereColumn('quantity_in_stock', '>', 'minimum_stock'),
                'low' => $query->whereColumn('quantity_in_stock', '<=', 'minimum_stock')
                                ->where('quantity_in_stock', '>', 0),
                'out_of_stock' => $query->where('quantity_in_stock', 0),
                default => null,
            };
        }

        $query->orderBy('name', 'asc');

        $products = $query->paginate(10)->withQueryString();

        $allProducts = Product::query();
        $cbId = Agency::where('name', 'like', '%Casablanca%')->value('id');
        $mkId = Agency::where('name', 'like', '%Marrakech%')->value('id');

        $stats = [
            'total' => (clone $allProducts)->count(),
            'critical' => (clone $allProducts)
                ->whereColumn('quantity_in_stock', '<=', 'minimum_stock')
                ->where('quantity_in_stock', '>', 0)
                ->count(),
            'outOfStock' => (clone $allProducts)
                ->where('quantity_in_stock', 0)
                ->count(),
            'casablanca' => $cbId ? (clone $allProducts)->where('agency_id', $cbId)->count() : 0,
            'marrakech' => $mkId ? (clone $allProducts)->where('agency_id', $mkId)->count() : 0,
        ];

        $categories = Product::distinct()
            ->pluck('category')
            ->filter()
            ->sort()
            ->values()
            ->toArray();

        $agencies = Agency::orderBy('name')->pluck('name')->toArray();

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
            'products' => $products->items(),
            'productsMeta' => [
                'currentPage' => $products->currentPage(),
                'lastPage' => $products->lastPage(),
                'total' => $products->total(),
                'perPage' => $products->perPage(),
            ],
            'stats' => $stats,
            'categories' => $categories,
            'agencies' => $agencies,
            'filters' => $request->only(['search', 'category', 'status', 'agency']),
        ]);
    }

    public function show(int $id, Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $product = Product::where('id', $id)
            ->with('agency')
            ->first();

        if (!$product) {
            return back()->withErrors(['product' => 'Produit introuvable.']);
        }

        $computedStatus = match (true) {
            $product->quantity_in_stock == 0 => 'out_of_stock',
            $product->quantity_in_stock <= $product->minimum_stock => 'low',
            default => 'available',
        };

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
                'unit_price' => (float) $product->unit_price,
                'quantity_in_stock' => $product->quantity_in_stock,
                'reserved_quantity' => $product->reserved_quantity,
                'minimum_stock' => $product->minimum_stock,
                'status' => $computedStatus,
                'agency' => [
                    'name' => $product->agency->name ?? '—',
                ],
                'updated_at' => $product->updated_at->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
                'created_at' => $product->created_at->locale('fr')->isoFormat('DD MMM YYYY'),
            ],
        ]);
    }
}
