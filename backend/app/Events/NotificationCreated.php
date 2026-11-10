<?php

namespace App\Events;

use App\Models\AppNotification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public AppNotification $notification) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [];

        if ($this->notification->user_id) {
            $channels[] = new PrivateChannel('notifications.'.$this->notification->user_id);
        } else {
            $channels[] = new Channel('admin-notifications');
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'NotificationCreated';
    }

    /**
     * Data sent with the broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->notification->id,
            'user_id' => $this->notification->user_id,
            'type' => $this->notification->type,
            'title' => $this->notification->title,
            'message' => $this->notification->message,
            'notifiable_type' => $this->notification->notifiable_type,
            'notifiable_id' => $this->notification->notifiable_id,
            'data' => $this->notification->data,
            'read_at' => $this->notification->read_at?->toIso8601String(),
            'created_at' => $this->notification->created_at?->toIso8601String(),
        ];
    }
}
