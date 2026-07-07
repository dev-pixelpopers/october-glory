<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Attachment;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Appointment $appointment) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Your booking is confirmed — {$this->appointment->booking_reference}",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.booking-confirmation');
    }

    /** Attach a standards-compliant .ics calendar invite. */
    public function attachments(): array
    {
        return [
            Attachment::fromData(fn () => $this->buildIcs(), 'appointment.ics')
                ->withMime('text/calendar'),
        ];
    }

    protected function buildIcs(): string
    {
        $a = $this->appointment;
        $format = fn ($dt) => $dt->copy()->utc()->format('Ymd\THis\Z');
        $summary = 'October Glory — '.$a->lineItems->map(fn ($i) => $i->service?->name)->filter()->implode(', ');

        return implode("\r\n", [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//October Glory//Salon Booking//EN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            'UID:'.$a->booking_reference.'@octoberglory.com',
            'DTSTAMP:'.$format(now()),
            'DTSTART:'.$format($a->start_time),
            'DTEND:'.$format($a->end_time),
            'SUMMARY:'.$summary,
            'DESCRIPTION:Booking reference '.$a->booking_reference.' with '.$a->worker->name,
            'STATUS:CONFIRMED',
            'END:VEVENT',
            'END:VCALENDAR',
        ]);
    }
}
