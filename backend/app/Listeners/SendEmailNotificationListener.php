<?php

namespace App\Listeners;

use App\Events\NotificationCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * Queued multi-channel dispatcher stub for email notifications.
 * Ready for mail provider integration (SES, Mailgun, Postmark).
 */
class SendEmailNotificationListener implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(NotificationCreated $event): void
    {
        $notification = $event->notification->loadMissing('user');
        $user = $notification->user;

        // Skip if no direct recipient or user has no email
        if (! $user || ! $user->email) {
            return;
        }

        // Stub/Hook for email delivery
        Log::info('[Multi-Channel Email Stub] Preparing email dispatch', [
            'recipient' => $user->email,
            'type' => $notification->type,
            'title' => $notification->title,
        ]);

        // Future mail mailable dispatch e.g.:
        // Mail::to($user->email)->queue(new DynamicNotificationMail($notification));
    }
}
