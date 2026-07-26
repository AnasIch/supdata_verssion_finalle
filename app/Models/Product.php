<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'reference',
        'category',
        'unit_price',
        'quantity_in_stock',
        'reserved_quantity',
        'minimum_stock',
        'agency_id',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'quantity_in_stock' => 'integer',
            'reserved_quantity' => 'integer',
            'minimum_stock' => 'integer',
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function isLowStock(): bool
    {
        return $this->quantity_in_stock <= $this->minimum_stock;
    }

    public function stockOperations(): HasMany
    {
        return $this->hasMany(StockOperation::class);
    }
}
