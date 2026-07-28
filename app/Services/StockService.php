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
        $query = Product::query()->with('agency');

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
            $query->whereHas('agency', function ($q) use ($request) {
                $q->where('name', $request->agency);
            });
        }

        if ($request->filled('disponibilite') && $request->disponibilite !== 'all') {
            match ($request->disponibilite) {
                'available' => $query->whereColumn('quantity_in_stock', '>', 'minimum_stock'),
                'low' => $query->whereColumn('quantity_in_stock', '<=', 'minimum_stock')
                                ->where('quantity_in_stock', '>', 0),
                'out_of_stock' => $query->where('quantity_in_stock', 0),
                default => null,
            };
        }

        $query->orderBy('name', 'asc');

        return $query->paginate(10);
    }

    public function getStats(): array
    {
        $all = Product::query();

        $total = (clone $all)->count();
        $available = (clone $all)->whereColumn('quantity_in_stock', '>', 'minimum_stock')->count();
        $low = (clone $all)->whereColumn('quantity_in_stock', '<=', 'minimum_stock')
                           ->where('quantity_in_stock', '>', 0)
                           ->count();
        $outOfStock = (clone $all)->where('quantity_in_stock', 0)->count();

        return [
            'total' => $total,
            'available' => $available,
            'low' => $low,
            'outOfStock' => $outOfStock,
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
        return Product::with('agency')
            ->orderBy('name')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'reference' => $p->reference,
                'category' => $p->category,
                'unit_price' => (float) $p->unit_price,
                'quantity_in_stock' => $p->quantity_in_stock,
                'reserved_quantity' => $p->reserved_quantity,
                'minimum_stock' => $p->minimum_stock,
                'available' => $p->quantity_in_stock - $p->reserved_quantity,
                'status' => $p->quantity_in_stock <= 0 ? 'out_of_stock' : ($p->isLowStock() ? 'low' : 'available'),
                'agency' => $p->agency?->name ?? '—',
            ])
            ->toArray();
    }
}
