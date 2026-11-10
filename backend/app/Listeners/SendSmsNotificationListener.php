<?php

namespace App\Listeners;

use App\Events\NotificationCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * Queued multi-channel dispatcher stub for SMS notifications.
 * Ready for SMS provider integration (Twilio, Vonage, SNS).
 */
class SendSmsNotificationListener implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(NotificationCreated $event): void
    {
        $notification = $event->notification->loadMissing('user');
        $user = $notification->user;

        // Skip if no user or no phone number
        if (! $user || ! $user->phone) {
            return;
        }

        // Stub/Hook for SMS delivery
        Log::info('[Multi-Channel SMS Stub] Preparing SMS dispatch', [
            'phone' => $user->phone,
            'type' => $notification->type,
            'title' => $notification->title,
        ]);

        // Future SMS provider API call e.g.:
        // $this->smsClient->send($user->phone, "{$notification->title}: {$notification->message}");
    }
}
