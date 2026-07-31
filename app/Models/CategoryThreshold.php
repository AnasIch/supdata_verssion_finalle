<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CategoryThreshold extends Model
{
    use HasFactory;

    protected $fillable = [
        'agency_id',
        'category',
        'minimum_stock',
        'maximum_stock',
    ];

    protected function casts(): array
    {
        return [
            'minimum_stock' => 'integer',
            'maximum_stock' => 'integer',
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }
}
