<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MonthlyLoyaltyStatementMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public int $earned,
        public int $redeemed,
        public int $balance,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your October Glory loyalty statement');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.monthly-loyalty-statement');
    }
}
