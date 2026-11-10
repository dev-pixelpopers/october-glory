<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\AppNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NotificationController extends Controller
{
    /**
     * Role-scoped listing of notifications.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $notifications = AppNotification::query()
            ->forUser($user)
            ->when($request->boolean('unread'), fn ($q) => $q->unread())
            ->when($request->query('status') === 'unread', fn ($q) => $q->unread())
            ->when($request->query('status') === 'read', fn ($q) => $q->read())
            ->when($request->query('type'), fn ($q, $type) => $q->where('type', $type))
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return NotificationResource::collection($notifications);
    }

    /**
     * Get the unread notifications count for the authenticated user.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = AppNotification::query()
            ->forUser($request->user())
            ->unread()
            ->count();

        return response()->json([
            'unread_count' => $count,
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, AppNotification $notification): NotificationResource
    {
        $this->authorizeAccess($request->user(), $notification);

        $notification->markAsRead();

        return new NotificationResource($notification->fresh());
    }

    /**
     * Mark all scoped notifications as read for the authenticated user.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $user = $request->user();

        $updated = AppNotification::query()
            ->forUser($user)
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json([
            'message' => 'All notifications marked as read',
            'marked_count' => $updated,
        ]);
    }

    /**
     * Delete a notification.
     */
    public function destroy(Request $request, AppNotification $notification): JsonResponse
    {
        $this->authorizeAccess($request->user(), $notification);

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted successfully',
        ]);
    }

    /**
     * Check that the user is allowed to access/mutate this notification.
     */
    protected function authorizeAccess($user, AppNotification $notification): void
    {
        if ($user->isAdmin()) {
            // Admin can access system-wide notifications (user_id is null) or notifications targeted directly to them.
            if ($notification->user_id !== null && $notification->user_id !== $user->id) {
                abort(403, 'Unauthorized access to this notification.');
            }
            return;
        }

        // Clients and workers can only access their own notifications.
        if ($notification->user_id !== $user->id) {
            abort(403, 'Unauthorized access to this notification.');
        }
    }
}
