<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Service extends Model
{
    use Auditable;

    protected $fillable = ['category_id', 'name', 'description', 'duration_minutes', 'is_active'];

    protected function casts(): array
    {
        return [
            'duration_minutes' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'category_id');
    }

    public function priceHistory(): HasMany
    {
        return $this->hasMany(ServicePriceHistory::class)->orderByDesc('effective_from');
    }

    /** The single active pricing row (effective_until IS NULL). */
    public function currentPrice(): HasOne
    {
        return $this->hasOne(ServicePriceHistory::class)->whereNull('effective_until');
    }

    public function workers(): BelongsToMany
    {
        return $this->belongsToMany(WorkerProfile::class, 'worker_services');
    }
}
