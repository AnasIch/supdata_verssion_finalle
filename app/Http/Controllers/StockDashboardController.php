<?php

namespace App\Http\Controllers;

use App\Models\Agency;
use App\Models\Product;
use App\Models\StockOperation;
use App\Models\StockCategory;
use App\Models\Role;
use App\Models\User;
use App\Models\Reservation;
use App\Mail\ReservationDeliveredMail;
use App\Mail\ReservationCancelledMail;
use App\Mail\ReceptionMail;
use App\Mail\StockMovementMail;
use App\Services\NotificationService;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StockDashboardController extends Controller
{
    private const SECTIONS = ['produits', 'categories', 'mouvements', 'receptions', 'livraisons', 'alertes'];

    private const DOCUMENT_TYPES = [
        'Bon de livraison', 'Bon de réception', 'Bon de transfert', 'Bon de retour',
        'Facture fournisseur', 'Bon de commande', 'Autre',
    ];

    public function __construct(private NotificationService $notifications, private AuditLogService $auditLogs) {}

    public function index(Request $request)
    {
        $products = Product::with('agency')->get();
        $operations = StockOperation::with(['agency', 'product'])->latest()->get();
        $reservations = Reservation::all();
        $available = $products->sum(fn ($p) => max(0, $p->quantity_in_stock - $p->reserved_quantity));
        $low = $products->filter(fn ($p) => $p->quantity_in_stock > 0 && $p->isLowStock())->count();
        $out = $products->where('quantity_in_stock', 0)->count();
        $totalUnits = $products->sum(fn ($p) => $p->quantity_in_stock);
        $pendingDeliveries = $reservations->where('status', 'reserved')->count();
        $completedDeliveries = $reservations->where('status', 'delivered')->count();

        $movements = $operations->where('section', 'mouvements')->take(20);
        $agencyFilter = $request->input('agency', 'Toutes');
        $receptionsAll = $operations->where('section', 'receptions');
        $receptions = $agencyFilter === 'Toutes'
            ? $receptionsAll
            : $receptionsAll->filter(fn ($op) => $op->agency?->name === $agencyFilter);
        $receptions = $receptions->take(8);
        $resolvedProductIds = $operations->where('section', 'alertes')->where('status', 'Traitée')->pluck('product_id');

        $alertQuery = Product::with('agency')
            ->where(fn ($q) => $q->where('quantity_in_stock', '<', DB::raw('minimum_stock'))->orWhere('quantity_in_stock', 0))
            ->whereNotIn('id', $resolvedProductIds);
        if ($agencyFilter !== 'Toutes') {
            $alertQuery->whereHas('agency', fn ($q) => $q->where('name', $agencyFilter));
        }
        $alerts = $alertQuery->get();

        $trend = collect(range(5, 0))->map(function ($daysAgo) use ($operations) {
            $date = now()->subDays($daysAgo);
            $dayOperations = $operations->filter(fn ($op) => $op->section === 'mouvements' && $op->created_at->isSameDay($date));
            return [
                'day' => $date->locale('fr')->isoFormat('dd'),
                'entrees' => $dayOperations->filter(fn ($op) => ($op->metadata['type'] ?? '') === 'Entrée')->sum('quantity'),
                'sorties' => $dayOperations->filter(fn ($op) => ($op->metadata['type'] ?? '') === 'Sortie')->sum('quantity'),
            ];
        })->values();

        return Inertia::render('Dashboard/Stock/Index', [
            'user' => $this->userPayload($request),
            'dashboardData' => [
                'stats' => [
                    ['id' => 'products', 'label' => 'Produits', 'value' => $products->count(), 'detail' => 'références actives'],
                    ['id' => 'critical', 'label' => 'Stock critique', 'value' => $low + $out, 'detail' => $low . ' faibles, ' . $out . ' ruptures'],
                    ['id' => 'pending', 'label' => 'Livraisons en attente', 'value' => $pendingDeliveries, 'detail' => 'réservations à livrer'],
                    ['id' => 'delivered', 'label' => 'Livraisons effectuées', 'value' => $completedDeliveries, 'detail' => 'commandes livrées'],
                    ['id' => 'total_units', 'label' => 'Unités en stock', 'value' => number_format($totalUnits, 0, ',', ' '), 'detail' => 'unités disponibles'],
                    ['id' => 'receptions', 'label' => 'Réceptions', 'value' => $receptionsAll->whereNotIn('status', ['Validée'])->count(), 'detail' => 'à contrôler'],
                ],
                'health' => [
                    ['label' => 'Disponible', 'value' => $products->count() - $low - $out, 'color' => '#10b981'],
                    ['label' => 'Stock faible', 'value' => $low, 'color' => '#f59e0b'],
                    ['label' => 'Rupture', 'value' => $out, 'color' => '#ef4444'],
                ],
                'trend' => $trend,
                'alerts' => $alerts->map(fn ($p) => [
                    'id' => $p->id, 'product' => $p->name, 'category' => $p->category,
                    'agency' => $p->agency?->name ?? '—', 'available' => $p->quantity_in_stock,
                    'reserved' => $p->reserved_quantity, 'threshold' => $p->minimum_stock,
                    'status' => $p->quantity_in_stock === 0 ? 'Rupture' : 'Stock faible',
                    'impact' => 'Disponibilité opérationnelle',
                ])->values(),
                'receptions' => $receptions->map(fn ($op) => [
                    'id' => $op->id, 'supplier' => $op->name, 'agency' => $op->agency?->name ?? '—',
                    'items' => $op->detail ?: $op->quantity . ' unité(s)', 'status' => $op->status,
                ])->values(),
                'activity' => $movements->map(fn ($op) => [
                    'id' => $op->id, 'type' => $op->metadata['type'] ?? 'Mouvement',
                    'text' => $op->detail ?: $op->name, 'author' => $op->creator?->name ?? 'Système',
                    'time' => $op->created_at->diffForHumans(), 'tone' => ($op->metadata['type'] ?? '') === 'Entrée' ? 'success' : 'warning',
                ])->values(),
                'agencies' => Agency::orderBy('name')->pluck('name'),
                'products' => $products->map(fn ($p) => ['id' => $p->id, 'name' => $p->name]),
            ],
        ]);
    }

    public function operations(string $section, Request $request)
    {
        abort_unless(in_array($section, self::SECTIONS, true), 404);

        $this->syncCategories();
        $result = $this->itemsFor($section, $request);

        return Inertia::render('Stock/Operations', [
            'section' => $section,
            'user' => $this->userPayload($request),
            'initialItems' => $result['items'],
            'initialPagination' => [
                'currentPage' => $result['currentPage'],
                'totalPages' => $result['totalPages'],
                'total' => $result['total'],
                'perPage' => $result['perPage'],
            ],
            'products' => Product::orderBy('name')->get(['id', 'name', 'category']),
            'categories' => StockCategory::where('active', true)->orderBy('name')->pluck('name'),
            'agencies' => Agency::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(string $section, Request $request)
    {
        abort_unless(in_array($section, self::SECTIONS, true), 404);

        $rules = [
            'nom' => ['required', 'string', 'max:255'],
            'detail' => ['nullable', 'string', 'max:1000'],
            'type' => ['nullable', Rule::in(['Entrée', 'Sortie'])],
        ];

        if ($section !== 'categories') {
            $rules['agence'] = ['required', 'string', 'max:255'];
            $rules['quantite'] = ['required', 'integer', 'min:0', 'max:1000000'];
        }

        if ($section === 'receptions') {
            $rules['document_type'] = ['required', 'string', Rule::in(self::DOCUMENT_TYPES)];
            $rules['document_file'] = ['required_with:document_type', 'file', 'mimes:pdf', 'max:10240'];
        }

        $data = $request->validate($rules);

        if ($section === 'categories') {
            StockCategory::create(['name' => $data['nom'], 'description' => $data['detail'], 'active' => true]);
        } elseif ($section === 'produits') {
            $agency = $this->agency($data['agence']);
            Product::create([
                'name' => $data['nom'], 'reference' => 'PRD-' . now()->format('ymdHis'),
                'category' => $data['detail'] ?: 'Non classée', 'unit_price' => 0,
                'quantity_in_stock' => $data['quantite'], 'minimum_stock' => 0,
                'agency_id' => $agency?->id, 'status' => $data['quantite'] > 0 ? 'active' : 'out_of_stock',
            ]);
        } else {
            if ($section === 'receptions' && $request->hasFile('document_file')) {
                $data = array_merge($data, $this->persistDocument($request, 'receptions'));
            }
            $this->createOperation($section, $data, $request);
        }

        $this->audit($request, 'Création', $section, $data['nom']);
        return back()->with('success', 'Élément enregistré avec succès.');
    }

    public function update(string $section, int $id, Request $request)
    {
        $rules = [
            'nom' => ['required', 'string', 'max:255'],
            'detail' => ['nullable', 'string', 'max:1000'],
        ];

        if ($section !== 'categories') {
            $rules['agence'] = ['required', 'string'];
            $rules['quantite'] = ['required', 'integer', 'min:0'];
        }

        $data = $request->validate($rules);

        if ($section === 'categories') {
            $category = StockCategory::findOrFail($id);
            Product::where('category', $category->name)->update(['category' => $data['nom']]);
            $category->update(['name' => $data['nom'], 'description' => $data['detail']]);
        } elseif ($section === 'produits') {
            $product = Product::findOrFail($id);
            $agency = $this->agency($data['agence']);
            $product->update([
                'name' => $data['nom'], 'category' => $data['detail'] ?: $product->category,
                'agency_id' => $agency?->id, 'quantity_in_stock' => $data['quantite'],
                'status' => $data['quantite'] > 0 ? 'active' : 'out_of_stock',
            ]);
        } else {
            $operation = StockOperation::where('section', $section)->findOrFail($id);
            $operation->update([
                'name' => $data['nom'], 'detail' => $data['detail'],
                'agency_id' => $this->agency($data['agence'])?->id, 'quantity' => $data['quantite'],
            ]);
        }

        $this->audit($request, 'Modification', $section, $data['nom']);
        return back()->with('success', 'Élément modifié.');
    }

    public function destroy(string $section, int $id, Request $request)
    {
        if ($section === 'categories') {
            $category = StockCategory::findOrFail($id);
            if (Product::where('category', $category->name)->exists()) {
                return back()->withErrors(['category' => 'Cette catégorie contient encore des produits.']);
            }
            $category->delete();
        } elseif ($section === 'produits') Product::findOrFail($id)->delete();
        else StockOperation::where('section', $section)->findOrFail($id)->delete();
        $this->audit($request, 'Suppression', $section, (string) $id);
        return back()->with('success', 'Élément supprimé.');
    }

    public function movement(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', Rule::in(['Entrée', 'Sortie'])],
            'quantity' => ['required', 'integer', 'min:1'],
            'product' => ['required', 'string'], 'agency' => ['required', 'string'],
            'document_type' => ['required', 'string', Rule::in(self::DOCUMENT_TYPES)],
            'document_file' => ['required_with:document_type', 'file', 'mimes:pdf', 'max:10240'],
        ]);
        $product = Product::where('name', $data['product'])->firstOrFail();
        if ($data['type'] === 'Sortie' && $product->quantity_in_stock < $data['quantity']) {
            return back()->withErrors(['quantity' => 'Quantité insuffisante en stock.']);
        }
        $actor = $request->user();
        $agency = $this->agency($data['agency']);
        $document = $this->persistDocument($request, 'mouvements');
        $operation = null;
        DB::transaction(function () use ($data, $product, $request, $actor, $document, &$operation) {
            $product->increment('quantity_in_stock', $data['type'] === 'Entrée' ? $data['quantity'] : -$data['quantity']);
            $product->refresh()->update(['status' => $product->quantity_in_stock > 0 ? 'active' : 'out_of_stock']);
            $operation = $this->createOperation('mouvements', [
                'nom' => $product->name, 'detail' => ($data['type'] === 'Entrée' ? '+' : '−') . $data['quantity'] . ' ' . $product->name,
                'agence' => $data['agency'], 'quantite' => $data['quantity'], 'type' => $data['type'],
                'document_type' => $document['document_type'], 'document_path' => $document['document_path'],
                'original_file_name' => $document['original_file_name'],
            ], $request, $product);
        });

        $description = "Un nouveau mouvement de stock a été enregistré.";
        $this->notifyRoles(
            ['Responsable Commercial', 'Gestion Administrative', 'Administrateur Local'],
            $agency?->id,
            'Nouveau mouvement de stock',
            $description,
            '/dashboard-stock/mouvements',
        );

        foreach ($this->mailRecipients(['responsable-commercial', 'gestion-administrative', 'admin-local'], $agency?->id) as $recipient) {
            Mail::to($recipient->email)->send(new StockMovementMail(
                type: $data['type'],
                product: $product,
                quantity: $data['quantity'],
                agency: $data['agency'],
                actor: $actor,
                documentPath: $document['document_path'],
                documentType: $document['document_type'],
                originalFileName: $document['original_file_name'],
            ));
        }

        $this->audit($request, 'Mouvement', 'mouvements', $product->name, [
            'type' => $data['type'],
            'quantité' => $data['quantity'],
            'produit' => $product->name,
            'catégorie' => $product->category ?? '—',
            'agence' => $data['agency'],
            'effectué par' => $actor->name,
        ]);

        return back()->with('success', 'Mouvement enregistré.');
    }

    public function validateReception(int $id, Request $request)
    {
        $reception = StockOperation::with(['agency', 'creator'])->where('section', 'receptions')->findOrFail($id);
        $reception->update(['status' => 'Validée']);

        $actor = $request->user();

        $this->notifyRoles(
            ['Gestion Administrative', 'Administrateur Local', 'Responsable Commercial'],
            $reception->agency_id,
            'Réception validée',
            "La réception {$reception->reference} ({$reception->name}) est disponible à {$reception->agency?->name}.",
            '/dashboard-stock/receptions',
        );

        foreach ($this->mailRecipients(['gestion-administrative', 'admin-local', 'responsable-commercial'], $reception->agency_id) as $recipient) {
            Mail::to($recipient->email)->send(new ReceptionMail($reception, $actor));
        }

        $this->audit($request, 'Validation', 'réceptions', $reception->reference);
        return back()->with('success', 'Réception validée.');
    }

    public function resolveAlert(int $productId, Request $request)
    {
        $product = Product::findOrFail($productId);
        StockOperation::create([
            'reference' => 'ALT-' . now()->format('ymdHis'), 'section' => 'alertes',
            'name' => $product->name, 'detail' => 'Alerte traitée', 'agency_id' => $product->agency_id,
            'product_id' => $product->id, 'created_by' => $request->user()?->id,
            'quantity' => $product->quantity_in_stock, 'status' => 'Traitée',
        ]);
        $this->notifyRoles(
            ['Responsable Commercial', 'Gestion Administrative'],
            $product->agency_id,
            'Alerte de stock traitée',
            "L'alerte concernant « {$product->name} » a été traitée par le Responsable Stock.",
            '/dashboard-stock/alertes',
        );
        $this->audit($request, 'Traitement', 'alertes', $product->name);
        return back()->with('success', 'Alerte traitée.');
    }

    public function deliverLivraison(int $id, Request $request)
    {
        $reservation = Reservation::with(['product', 'user', 'agency'])->findOrFail($id);

        if ($reservation->status !== 'reserved') {
            return back()->withErrors(['reservation' => 'Cette réservation ne peut plus être livrée.']);
        }

        $rs = $request->user();

        DB::transaction(function () use ($reservation, $rs) {
            $reservation->update([
                'status' => 'delivered',
                'delivered_by' => $rs->id,
                'delivered_at' => now(),
            ]);

            $product = $reservation->product;
            $product->decrement('quantity_in_stock', $reservation->quantity);
            $product->decrement('reserved_quantity', $reservation->quantity);
            $product->refresh()->update([
                'status' => $product->quantity_in_stock > 0 ? 'active' : 'out_of_stock',
            ]);

            StockOperation::create([
                'reference' => 'LIV-' . now()->format('ymdHis'),
                'section' => 'livraisons',
                'name' => $reservation->client_name,
                'detail' => $reservation->product?->name . ' · ' . $reservation->quantity . ' unité(s) · Livré',
                'agency_id' => $reservation->agency_id,
                'product_id' => $reservation->product_id,
                'created_by' => $rs->id,
                'quantity' => $reservation->quantity,
                'status' => 'Livrée',
                'metadata' => ['reservation_id' => $reservation->id, 'type' => 'Sortie'],
            ]);
        });

        $this->notifyRoles(
            ['Responsable Commercial', 'Gestion Administrative', 'Administrateur Local'],
            $reservation->agency_id,
            'Livraison confirmée',
            "La réservation {$reservation->reference} ({$reservation->product?->name}) a été livrée au client {$reservation->client_name}.",
            '/dashboard-stock/livraisons',
        );

        $rcUsers = User::whereHas('role', fn ($q) => $q->where('slug', 'responsable-commercial'))
            ->where('agency_id', $reservation->agency_id)
            ->where('status', 'active')
            ->get();
        foreach ($rcUsers as $rcUser) {
            Mail::to($rcUser->email)->send(new ReservationDeliveredMail($reservation, $rs));
        }

        $this->audit($request, 'Livraison', 'livraisons', $reservation->reference, [
            'produit' => $reservation->product?->name,
            'quantité' => $reservation->quantity,
            'client' => $reservation->client_name,
        ]);

        return back()->with('success', 'Livraison confirmée. Stock mis à jour.');
    }

    public function cancelLivraison(int $id, Request $request)
    {
        $reservation = Reservation::with(['product', 'user', 'agency'])->findOrFail($id);

        if ($reservation->status !== 'reserved') {
            return back()->withErrors(['reservation' => 'Cette réservation ne peut plus être annulée.']);
        }

        $data = $request->validate([
            'cancellation_reason' => ['required', 'string', 'min:20', 'max:1000'],
        ]);

        $rs = $request->user();

        DB::transaction(function () use ($reservation, $rs, $data) {
            $reservation->update([
                'status' => 'cancelled',
                'cancelled_by' => $rs->id,
                'cancelled_at' => now(),
                'cancellation_reason' => $data['cancellation_reason'],
            ]);

            StockOperation::create([
                'reference' => 'ANN-' . now()->format('ymdHis'),
                'section' => 'livraisons',
                'name' => $reservation->client_name,
                'detail' => $reservation->product?->name . ' · ' . $reservation->quantity . ' unité(s) · Annulée',
                'agency_id' => $reservation->agency_id,
                'product_id' => $reservation->product_id,
                'created_by' => $rs->id,
                'quantity' => $reservation->quantity,
                'status' => 'Annulée',
                'metadata' => ['reservation_id' => $reservation->id, 'type' => 'Sortie', 'reason' => $data['cancellation_reason']],
            ]);
        });

        $this->notifyRoles(
            ['Responsable Commercial', 'Gestion Administrative', 'Administrateur Local'],
            $reservation->agency_id,
            'Réservation annulée',
            "La réservation {$reservation->reference} ({$reservation->product?->name}) a été annulée par le Responsable Stock.",
            '/dashboard-stock/livraisons',
        );

        $rcUsers = User::whereHas('role', fn ($q) => $q->where('slug', 'responsable-commercial'))
            ->where('agency_id', $reservation->agency_id)
            ->where('status', 'active')
            ->get();
        foreach ($rcUsers as $rcUser) {
            Mail::to($rcUser->email)->send(new ReservationCancelledMail($reservation, $rs, $data['cancellation_reason']));
        }

        $this->audit($request, 'Annulation', 'livraisons', $reservation->reference, [
            'produit' => $reservation->product?->name,
            'quantité' => $reservation->quantity,
            'client' => $reservation->client_name,
            'motif' => $data['cancellation_reason'],
        ]);

        return back()->with('success', 'Réservation annulée.');
    }

    private function createOperation(string $section, array $data, Request $request, ?Product $product = null): StockOperation
    {
        $prefix = strtoupper(substr($section, 0, 3));
        return StockOperation::create([
            'reference' => $prefix . '-' . now()->format('ymdHisv'), 'section' => $section,
            'name' => $data['nom'], 'detail' => $data['detail'] ?? null,
            'agency_id' => $this->agency($data['agence'])?->id, 'product_id' => $product?->id,
            'created_by' => $request->user()?->id, 'quantity' => $data['quantite'],
            'status' => match ($section) {
                'receptions' => 'À contrôler',
                'livraisons' => 'En préparation', default => 'Enregistré',
            },
            'metadata' => ['type' => $data['type'] ?? null],
            'document_type' => $data['document_type'] ?? null,
            'document_path' => $data['document_path'] ?? null,
            'original_file_name' => $data['original_file_name'] ?? null,
        ]);
    }

    private function persistDocument(Request $request, string $folder): array
    {
        $file = $request->file('document_file');

        return [
            'document_type' => $request->input('document_type'),
            'document_path' => $file->storeAs(
                "documents/{$folder}",
                now()->format('ymdHis') . '_' . Str::random(8) . '.pdf',
                'public',
            ),
            'original_file_name' => $file->getClientOriginalName(),
        ];
    }

    private function itemsFor(string $section, Request $request): array
    {
        $search = $request->input('search', '');
        $agency = $request->input('agency', 'Toutes');
        $perPage = (int) $request->input('perPage', 10);
        if (!in_array($perPage, [10, 25, 50, 100], true)) {
            $perPage = 10;
        }

        if ($section === 'produits') {
            $query = Product::with('agency')->latest();
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%")
                      ->orWhere('reference', 'like', "%{$search}%")
                      ->orWhereHas('agency', fn ($aq) => $aq->where('name', 'like', "%{$search}%"));
                });
            }
            if ($agency !== 'Toutes') {
                $query->whereHas('agency', fn ($q) => $q->where('name', $agency));
            }
            $paginator = $query->paginate($perPage)->withQueryString();
            $items = $paginator->getCollection()->map(fn ($p) => [
                'id' => $p->id, 'nom' => $p->name, 'detail' => $p->category,
                'agence' => $p->agency?->name ?? '—', 'quantite' => $p->quantity_in_stock,
                'statut' => $p->quantity_in_stock === 0 ? 'Rupture' : ($p->isLowStock() ? 'Stock faible' : 'Disponible'),
            ])->values();
        } elseif ($section === 'categories') {
            $query = StockCategory::query()->orderBy('name');
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }
            if ($agency !== 'Toutes') {
                $query->whereIn('name', Product::whereHas('agency', fn ($q) => $q->where('name', $agency))->distinct()->pluck('category'));
            }
            $paginator = $query->paginate($perPage)->withQueryString();
            $items = $paginator->getCollection()->map(fn ($category) => [
                'id' => $category->id, 'nom' => $category->name, 'detail' => $category->description ?: Product::where('category', $category->name)->count() . ' produits',
                'agence' => 'Toutes', 'quantite' => Product::where('category', $category->name)->count(), 'statut' => $category->active ? 'Active' : 'Inactive',
            ])->values();
        } elseif ($section === 'alertes') {
            $query = Product::with('agency')->where(function ($q) {
                $q->where('quantity_in_stock', '<', DB::raw('minimum_stock'))
                  ->orWhere('quantity_in_stock', 0);
            });
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('reference', 'like', "%{$search}%");
                });
            }
            if ($agency !== 'Toutes') {
                $query->whereHas('agency', fn ($q) => $q->where('name', $agency));
            }
            $paginator = $query->latest()->paginate($perPage)->withQueryString();
            $items = $paginator->getCollection()->map(fn ($p) => [
                'id' => $p->id, 'nom' => $p->name, 'detail' => $p->quantity_in_stock . ' disponible(s)',
                'agence' => $p->agency?->name ?? '—', 'quantite' => $p->quantity_in_stock,
                'statut' => $p->quantity_in_stock === 0 ? 'Rupture' : 'Stock faible',
            ])->values();
        } elseif ($section === 'livraisons') {
            $query = Reservation::with(['product', 'user', 'agency'])->latest();
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('client_name', 'like', "%{$search}%")
                      ->orWhereHas('product', fn ($pq) => $pq->where('name', 'like', "%{$search}%"))
                      ->orWhere('reference', 'like', "%{$search}%");
                });
            }
            if ($agency !== 'Toutes') {
                $query->whereHas('agency', fn ($q) => $q->where('name', $agency));
            }
            $paginator = $query->paginate($perPage)->withQueryString();
            $items = $paginator->getCollection()->map(fn (Reservation $r) => [
                'id' => $r->id,
                'nom' => $r->user?->name ?? '—',
                'detail' => $r->product?->name . ' · ' . $r->quantity . ' unité(s)',
                'agence' => $r->agency?->name ?? '—',
                'quantite' => $r->quantity,
                'statut' => match ($r->status) {
                    'reserved' => 'En préparation',
                    'delivered' => 'Livrée',
                    'cancelled' => 'Annulée',
                    default => $r->status,
                },
                'reference' => $r->reference,
                'client' => $r->client_name,
                'produit' => $r->product?->name ?? '—',
                'cancellation_reason' => $r->cancellation_reason,
            ])->values();
        } else {
            $query = StockOperation::with(['agency', 'product', 'creator'])->where('section', $section)->latest();
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('detail', 'like', "%{$search}%")
                      ->orWhere('reference', 'like', "%{$search}%")
                      ->orWhereHas('product', fn ($pq) => $pq->where('name', 'like', "%{$search}%")
                          ->orWhere('reference', 'like', "%{$search}%"))
                      ->orWhereHas('creator', fn ($cq) => $cq->where('name', 'like', "%{$search}%"));
                });
            }
            if ($agency !== 'Toutes') {
                $query->whereHas('agency', fn ($q) => $q->where('name', $agency));
            }
            $paginator = $query->paginate($perPage)->withQueryString();
            $items = $paginator->getCollection()->map(fn ($op) => [
                'id' => $op->id, 'nom' => $op->name, 'detail' => $op->detail,
                'agence' => $op->agency?->name ?? '—', 'quantite' => $op->quantity, 'statut' => $op->status,
                'type' => $op->metadata['type'] ?? null,
            ])->values();
        }

        return [
            'items' => $items,
            'currentPage' => $paginator->currentPage(),
            'totalPages' => $paginator->lastPage(),
            'total' => $paginator->total(),
            'perPage' => $perPage,
        ];
    }

    private function agency(string $name): ?Agency
    {
        return Agency::where('name', $name)->orWhere('name', 'like', '%' . $name . '%')->first();
    }

    private function syncCategories(): void
    {
        Product::query()->distinct()->pluck('category')->filter()->each(fn ($name) =>
            StockCategory::firstOrCreate(['name' => $name], ['description' => null, 'active' => true])
        );
    }

    private function notifyRoles(array $roleNames, ?int $agencyId, string $title, string $description, string $url): void
    {
        $roleIds = Role::whereIn('name', $roleNames)->pluck('id');
        User::whereIn('role_id', $roleIds)
            ->where('status', 'active')
            ->where(function ($query) use ($agencyId) {
                $query->where('agency_id', $agencyId)
                    ->orWhereHas('role', fn ($role) => $role->where('name', 'Gestion Administrative'));
            })
            ->each(fn (User $user) => $this->notifications->create(
                user: $user, title: $title, description: $description,
                type: 'success', source: 'stock', actionUrl: $url,
            ));
    }

    private function mailRecipients(array $roleSlugs, ?int $agencyId)
    {
        return User::whereHas('role', fn ($q) => $q->whereIn('slug', $roleSlugs))
            ->where('status', 'active')
            ->where(function ($query) use ($agencyId) {
                $query->where('agency_id', $agencyId)
                    ->orWhereHas('role', fn ($role) => $role->where('name', 'Gestion Administrative'));
            })
            ->get();
    }

    private function audit(Request $request, string $action, string $section, string $target, array $values = []): void
    {
        $this->auditLogs->log(user: $request->user(), action: $action, module: 'Stock', description: "$action dans $section", target: $target, newValues: $values ?: null, ipAddress: $request->ip(), userAgent: $request->userAgent());
    }

    private function userPayload(Request $request): array
    {
        $user = $request->user();
        if (!$user) return ['name' => 'Rachid Amrani', 'email' => 'r.amrani@supdata.ma', 'role' => 'Responsable Stock'];
        $user->loadMissing(['role', 'agency']);
        return ['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'role' => $user->role?->name, 'agency' => $user->agency?->name];
    }
}
