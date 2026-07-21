<?php

namespace App\Http\Controllers;

use App\Services\DemandeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DemandeController extends Controller
{
    public function __construct(
        private DemandeService $demandeService,
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $demandes = $this->demandeService->index($request);
        $stats = $this->demandeService->getStats($request);

        return Inertia::render('Commercial/Demandes/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Responsable Commercial',
                'agency' => $user->agency->name ?? '—',
            ],
            'demandes' => $demandes->items(),
            'demandesMeta' => [
                'currentPage' => $demandes->currentPage(),
                'lastPage' => $demandes->lastPage(),
                'total' => $demandes->total(),
                'perPage' => $demandes->perPage(),
            ],
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $products = \App\Models\Product::where('status', 'active')
            ->where('agency_id', $user->agency_id)
            ->orderBy('name')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'reference' => $p->reference,
                'category' => $p->category,
                'unit_price' => (float) $p->unit_price,
            ]);

        return Inertia::render('Commercial/Demandes/Create', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Responsable Commercial',
                'agency' => $user->agency->name ?? '—',
            ],
            'products' => $products,
        ]);
    }

    public function store(\App\Http\Requests\DemandeFormRequest $request)
    {
        $demande = $this->demandeService->create(
            $request->validated(),
            $request,
        );

        return redirect()->route('rc.demandes')
            ->with('success', 'Votre demande d\'achat a été envoyée avec succès.');
    }

    public function archive(int $id, Request $request)
    {
        $archived = $this->demandeService->archive($id, $request);

        if (!$archived) {
            return back()->withErrors(['demande' => 'Demande introuvable.']);
        }

        return back()->with('success', 'La demande a été archivée avec succès.');
    }

    public function show(int $id, Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $demande = $this->demandeService->show($id, $request);

        if (!$demande) {
            return back()->withErrors(['demande' => 'Demande introuvable.']);
        }

        $demande->load('user', 'agency');

        return Inertia::render('Commercial/Demandes/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Responsable Commercial',
                'agency' => $user->agency->name ?? '—',
            ],
            'demande' => [
                'id' => $demande->id,
                'title' => $demande->title,
                'description' => $demande->description,
                'status' => $demande->status,
                'priority' => $demande->priority,
                'quantity' => $demande->quantity,
                'product_name' => $demande->product_name,
                'products' => $demande->products ?? [],
                'created_at' => $demande->created_at->locale('fr')->isoFormat('DD MMM YYYY'),
                'created_at_full' => $demande->created_at->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
                'user' => [
                    'name' => $demande->user->name,
                ],
                'agency' => [
                    'name' => $demande->agency->name ?? '—',
                ],
            ],
        ]);
    }
}
