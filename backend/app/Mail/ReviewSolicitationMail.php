<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewSolicitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Appointment $appointment) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'How was your visit to October Glory?');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.review-solicitation',
            with: [
                // One-click deep link into the client dashboard review form.
                'reviewUrl' => rtrim(config('app.frontend_url', 'http://localhost:3000'), '/')
                    ."/dashboard?review={$this->appointment->id}",
            ],
        );
    }
}
