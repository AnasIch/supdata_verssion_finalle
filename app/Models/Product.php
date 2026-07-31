<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
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
        'maximum_stock',
        'overrides_threshold',
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
            'maximum_stock' => 'integer',
            'overrides_threshold' => 'boolean',
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function stockOperations(): HasMany
    {
        return $this->hasMany(StockOperation::class);
    }

    public static function effectiveMinSql(): string
    {
        return "CASE WHEN products.overrides_threshold = 1 THEN COALESCE(products.minimum_stock, 0) ELSE COALESCE(category_thresholds.minimum_stock, 0) END";
    }

    public static function effectiveMaxSql(): string
    {
        return "CASE WHEN products.overrides_threshold = 1 THEN products.maximum_stock ELSE category_thresholds.maximum_stock END";
    }

    public function effectiveMinimumStock(): int
    {
        if ($this->overrides_threshold) {
            return (int) ($this->minimum_stock ?? 0);
        }

        return $this->category_minimum_stock !== null ? (int) $this->category_minimum_stock : 0;
    }

    public function effectiveMaximumStock(): ?int
    {
        if ($this->overrides_threshold) {
            return $this->maximum_stock;
        }

        return $this->category_maximum_stock !== null ? (int) $this->category_maximum_stock : null;
    }

    public function thresholdSource(): string
    {
        if ($this->overrides_threshold) {
            return 'product';
        }

        if ($this->category_minimum_stock !== null || $this->category_maximum_stock !== null) {
            return 'category';
        }

        return 'default';
    }

    public function scopeWithCategoryThreshold(Builder $query): Builder
    {
        $joins = $query->getQuery()->joins ?? [];

        $alreadyJoined = collect($joins)->contains(
            fn ($join) => $join->table === 'category_thresholds'
        );

        if ($alreadyJoined) {
            return $query;
        }

        return $query
            ->leftJoin('category_thresholds', function ($join) {
                $join->on('category_thresholds.agency_id', '=', 'products.agency_id')
                    ->on('category_thresholds.category', '=', 'products.category');
            })
            ->select(
                'products.*',
                'category_thresholds.minimum_stock as category_minimum_stock',
                'category_thresholds.maximum_stock as category_maximum_stock',
            );
    }

    public function scopeFilterByStatus(Builder $query, string $status): Builder
    {
        $query->withCategoryThreshold();

        match ($status) {
            'available' => $query
                ->where('products.quantity_in_stock', '>', 0)
                ->whereRaw('products.quantity_in_stock > ' . self::effectiveMinSql())
                ->whereRaw('(' . self::effectiveMaxSql() . ' IS NULL OR products.quantity_in_stock < ' . self::effectiveMaxSql() . ')'),
            'low' => $query
                ->where('products.quantity_in_stock', '>', 0)
                ->whereRaw('products.quantity_in_stock <= ' . self::effectiveMinSql()),
            'out_of_stock' => $query->where('products.quantity_in_stock', 0),
            'overstock' => $query
                ->where('products.quantity_in_stock', '>', 0)
                ->whereRaw(self::effectiveMaxSql() . ' IS NOT NULL')
                ->whereRaw('products.quantity_in_stock >= ' . self::effectiveMaxSql()),
            default => null,
        };

        return $query;
    }

    public function isLowStock(): bool
    {
        return $this->quantity_in_stock <= $this->effectiveMinimumStock();
    }

    public function isOverstock(): bool
    {
        $maximum = $this->effectiveMaximumStock();

        return $maximum !== null
            && $this->quantity_in_stock > 0
            && $this->quantity_in_stock >= $maximum;
    }

    public function stockStatus(): string
    {
        if ($this->quantity_in_stock <= 0) {
            return 'out_of_stock';
        }

        if ($this->isLowStock()) {
            return 'low';
        }

        if ($this->isOverstock()) {
            return 'overstock';
        }

        return 'available';
    }

    public function toStockPayload(bool $withThresholdMeta = false): array
    {
        $payload = [
            'id' => $this->id,
            'name' => $this->name,
            'reference' => $this->reference,
            'category' => $this->category,
            'unit_price' => (float) $this->unit_price,
            'quantity_in_stock' => $this->quantity_in_stock,
            'reserved_quantity' => $this->reserved_quantity,
            'available' => max(0, $this->quantity_in_stock - $this->reserved_quantity),
            'minimum_stock' => $this->effectiveMinimumStock(),
            'maximum_stock' => $this->effectiveMaximumStock(),
            'status' => $this->stockStatus(),
            'agency' => $this->agency ? [
                'id' => $this->agency->id,
                'name' => $this->agency->name,
            ] : null,
            'updated_at' => $this->updated_at?->toISOString(),
        ];

        if ($withThresholdMeta) {
            $payload = array_merge($payload, [
                'explicit_minimum_stock' => $this->minimum_stock,
                'explicit_maximum_stock' => $this->maximum_stock,
                'category_minimum_stock' => $this->category_minimum_stock !== null ? (int) $this->category_minimum_stock : null,
                'category_maximum_stock' => $this->category_maximum_stock !== null ? (int) $this->category_maximum_stock : null,
                'threshold_source' => $this->thresholdSource(),
            ]);
        }

        return $payload;
    }
}
