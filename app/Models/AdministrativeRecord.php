<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdministrativeRecord extends Model
{
    protected $fillable = ['type', 'reference', 'title', 'description', 'status', 'agency_id', 'created_by', 'effective_at', 'expires_at', 'metadata'];
    protected function casts(): array { return ['effective_at' => 'date', 'expires_at' => 'date', 'metadata' => 'array']; }
    public function agency(): BelongsTo { return $this->belongsTo(Agency::class); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
}
