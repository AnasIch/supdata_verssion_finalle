<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Agency;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class StockService
{
    public function index(Request $request): LengthAwarePaginator
    {
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
            $query->whereHas('agency', function ($q) use ($request) {
                $q->where('name', $request->agency);
            });
        }

        if ($request->filled('disponibilite') && $request->disponibilite !== 'all') {
            $query->filterByStatus($request->disponibilite);
        }

        $query->orderBy('products.name', 'asc');

        $paginator = $query->paginate(10);

        $rows = $paginator->getCollection()->map(
            fn (Product $product) => $product->toStockPayload()
        );

        $paginator->setCollection(collect($rows));

        return $paginator;
    }

    public function getStats(): array
    {
        $base = Product::query()->withCategoryThreshold();

        return [
            'total' => Product::query()->count(),
            'available' => (clone $base)->filterByStatus('available')->count(),
            'low' => (clone $base)->filterByStatus('low')->count(),
            'outOfStock' => (clone $base)->filterByStatus('out_of_stock')->count(),
            'overstock' => (clone $base)->filterByStatus('overstock')->count(),
        ];
    }

    public function getCategories(): array
    {
        return Product::distinct()->pluck('category')->filter()->sort()->values()->toArray();
    }

    public function getAgencies(): array
    {
        return Agency::orderBy('name')->pluck('name')->toArray();
    }

    public function getAllProducts(): array
    {
        return Product::query()
            ->with('agency')
            ->withCategoryThreshold()
            ->orderBy('products.name')
            ->get()
            ->map(fn (Product $product) => $product->toStockPayload())
            ->toArray();
    }
}
