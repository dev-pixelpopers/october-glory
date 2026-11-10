<?php

namespace App\Events;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentCancelled
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Appointment $appointment,
        public User $actor
    ) {}
}
