<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockOperation extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'section', 'name', 'detail', 'agency_id',
        'product_id', 'created_by', 'quantity', 'status', 'metadata',
    ];

    protected function casts(): array
    {
        return ['quantity' => 'integer', 'metadata' => 'array'];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
