<?php

namespace App\Jobs;

use App\Mail\BookingConfirmationMail;
use App\Models\Appointment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendBookingConfirmationEmail implements ShouldQueue
{
    use Queueable;

    public function __construct(public Appointment $appointment) {}

    public function handle(): void
    {
        $this->appointment->loadMissing(['client', 'worker', 'lineItems.service']);

        Mail::to($this->appointment->client)
            ->send(new BookingConfirmationMail($this->appointment));
    }
}
