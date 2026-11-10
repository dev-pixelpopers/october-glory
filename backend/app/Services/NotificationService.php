<?php

namespace App\Services;

use App\Events\NotificationCreated;
use App\Models\AppNotification;
use Illuminate\Database\Eloquent\Model;

class NotificationService
{
    /**
     * Dispatch an in-app notification to a specific user (or null for admin/system-wide).
     *
     * @param  int|null  $recipientUserId
     * @param  string  $type  Categorization key (e.g. appointment.created, shoutout.approved)
     * @param  string  $title  Short summary
     * @param  string  $message  Full human-readable details
     * @param  Model|null  $model  Associated notifiable model instance
     * @param  array  $data  Contextual payload (IDs, routes, metadata)
     */
    public static function notify(
        ?int $recipientUserId,
        string $type,
        string $title,
        string $message,
        ?Model $model = null,
        array $data = []
    ): AppNotification {
        $notification = AppNotification::create([
            'user_id' => $recipientUserId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'notifiable_type' => $model ? get_class($model) : null,
            'notifiable_id' => $model ? $model->getKey() : null,
            'data' => $data,
        ]);

        try {
            event(new NotificationCreated($notification));
        } catch (\Throwable $e) {
            // Broadcasting failure (e.g. unconfigured broadcast driver) shouldn't block the database notification
            logger()->warning('Failed to broadcast notification: '.$e->getMessage(), [
                'notification_id' => $notification->id,
            ]);
        }

        return $notification;
    }

    /**
     * Dispatch a system-wide notification to all admins.
     */
    public static function notifyAdmins(
        string $type,
        string $title,
        string $message,
        ?Model $model = null,
        array $data = []
    ): AppNotification {
        return self::notify(null, $type, $title, $message, $model, $data);
    }

    /**
     * Dispatch notifications to multiple users.
     *
     * @param  int[]  $userIds
     * @return AppNotification[]
     */
    public static function notifyMany(
        array $userIds,
        string $type,
        string $title,
        string $message,
        ?Model $model = null,
        array $data = []
    ): array {
        $notifications = [];

        foreach ($userIds as $id) {
            $notifications[] = self::notify($id, $type, $title, $message, $model, $data);
        }

        return $notifications;
    }
}
