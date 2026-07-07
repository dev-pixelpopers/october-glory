<?php

namespace App\Jobs;

use App\Mail\ReviewSolicitationMail;
use App\Models\Appointment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

/** Dispatched at booking time with ->delay(end_time + 15 minutes). */
class SendReviewSolicitationEmail implements ShouldQueue
{
    use Queueable;

    public function __construct(public Appointment $appointment) {}

    public function handle(): void
    {
        $appointment = $this->appointment->fresh(['client', 'worker', 'review']);

        // Only solicit when the session actually happened and no review exists yet.
        if (! $appointment
            || $appointment->review
            || in_array($appointment->status, [Appointment::STATUS_CANCELLED, Appointment::STATUS_NO_SHOW], true)) {
            return;
        }

        Mail::to($appointment->client)->send(new ReviewSolicitationMail($appointment));
    }
}
