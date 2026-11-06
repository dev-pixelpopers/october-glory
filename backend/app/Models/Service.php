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

    protected $fillable = [
        'category_id', 'name', 'slug', 'description', 'image', 'duration_minutes',
        'price_by_consultation', 'is_active', 'archived_at', 'sort_order',
    ];

    protected static function booted(): void
    {
        static::creating(function (Service $service) {
            try {
                if (\Illuminate\Support\Facades\Schema::hasColumn('services', 'sort_order') && is_null($service->sort_order)) {
                    $service->sort_order = (static::max('sort_order') ?? 0) + 1;
                }
            } catch (\Throwable) {
                // Column does not exist yet (during early migrations)
            }
        });
    }

    protected function casts(): array
    {
        return [
            'duration_minutes' => 'integer',
            'price_by_consultation' => 'boolean',
            'is_active' => 'boolean',
            'archived_at' => 'datetime',
            'sort_order' => 'integer',
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

    /** Booked line items — a service with any can't be deleted. */
    public function appointmentLines(): HasMany
    {
        return $this->hasMany(AppointmentService::class);
    }

    /** Packages this service is bundled into. */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'package_service')
            ->withPivot('position');
    }
}