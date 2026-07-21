<?php

namespace App\Http\Controllers;

use App\Services\StockService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommercialStockController extends Controller
{
    public function __construct(
        private StockService $stockService,
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $products = $this->stockService->index($request);
        $stats = $this->stockService->getStats();
        $categories = $this->stockService->getCategories();
        $agencies = $this->stockService->getAgencies();

        return Inertia::render('Commercial/Stock/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Responsable Commercial',
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
            'filters' => $request->only(['search', 'category', 'agency', 'disponibilite']),
        ]);
    }
}
