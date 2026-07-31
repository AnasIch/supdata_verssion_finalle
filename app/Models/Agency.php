<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agency extends Model
{
    use HasFactory;

    protected $table = 'agences';

    protected $fillable = [
        'name',
        'city',
        'address',
        'phone',
        'email',
        'storage_capacity',
        'director',
        'director_email',
    ];

    protected function casts(): array
    {
        return [
            'storage_capacity' => 'integer',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function categoryThresholds(): HasMany
    {
        return $this->hasMany(CategoryThreshold::class);
    }
}