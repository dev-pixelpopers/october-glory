<?php

namespace App\Events;

use App\Models\Appointment;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentRescheduled
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Appointment $appointment,
        public $oldStartTime,
        public ?int $oldWorkerId = null
    ) {}
}
