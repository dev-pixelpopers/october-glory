<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Appointment extends Model
{
    use Auditable;

    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_CHECKED_IN = 'checked_in';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_NO_SHOW = 'no_show';

    /** Statuses that occupy a worker's time on the calendar. */
    public const BLOCKING_STATUSES = [
        self::STATUS_SCHEDULED,
        self::STATUS_CHECKED_IN,
        self::STATUS_IN_PROGRESS,
        self::STATUS_COMPLETED,
    ];

    protected $fillable = [
        'booking_reference', 'client_id', 'worker_id', 'start_time', 'end_time',
        'total_duration_minutes', 'subtotal_amount', 'loyalty_points_used',
        'discount_amount', 'total_amount', 'payment_method', 'payment_status',
        'status', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'total_duration_minutes' => 'integer',
            'loyalty_points_used' => 'integer',
            'subtotal_amount' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'worker_id');
    }

    public function lineItems(): HasMany
    {
        return $this->hasMany(AppointmentService::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    /** Overlap predicate: [start, end) intervals intersect. */
    public function scopeOverlapping(Builder $query, \DateTimeInterface $start, \DateTimeInterface $end): Builder
    {
        return $query
            ->where('start_time', '<', $end)
            ->where('end_time', '>', $start)
            ->whereIn('status', self::BLOCKING_STATUSES);
    }
}
