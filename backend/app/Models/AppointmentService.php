<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Line item with an immutable price/duration snapshot taken at booking time. */
class AppointmentService extends Model
{
    public $timestamps = false;

    protected $table = 'appointment_service';

    protected $fillable = ['appointment_id', 'service_id', 'price_at_booking', 'duration_at_booking'];

    protected function casts(): array
    {
        return [
            'price_at_booking' => 'decimal:2',
            'duration_at_booking' => 'integer',
        ];
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
