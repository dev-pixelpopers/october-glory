<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Package extends Model
{
    use Auditable;

    protected $fillable = [
        'category_id', 'collection', 'name', 'slug', 'tagline',
        'description', 'includes', 'not_included', 'best_for',
        'is_featured', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'includes' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'category_id');
    }

    /** The services bundled into this package, in display order. */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'package_service')
            ->withPivot('position')
            ->orderByPivot('position');
    }

    public function priceHistory(): HasMany
    {
        return $this->hasMany(PackagePriceHistory::class)->orderByDesc('effective_from');
    }

    /** The single active pricing row (effective_until IS NULL) — the package's set price. */
    public function currentPrice(): HasOne
    {
        return $this->hasOne(PackagePriceHistory::class)->whereNull('effective_until');
    }

    /**
     * Combined duration of the bundled services — derived, never stored, so it
     * always reflects the current membership.
     */
    public function getDurationMinutesAttribute(): int
    {
        return (int) $this->services->sum('duration_minutes');
    }

    /**
     * Summed current price of the bundled services — the "suggested" total the
     * admin sees before overriding it with the package price. Requires
     * `services.currentPrice` to be loaded.
     */
    public function getServicesTotalAttribute(): string
    {
        return $this->services->reduce(
            fn ($carry, Service $service) => bcadd($carry, (string) ($service->currentPrice?->price ?? '0'), 2),
            '0',
        );
    }
}
