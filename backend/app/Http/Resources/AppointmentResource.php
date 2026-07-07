<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_reference' => $this->booking_reference,
            'client' => $this->whenLoaded('client', fn () => [
                'id' => $this->client->id,
                'name' => $this->client->name,
                'email' => $this->client->email,
                'phone' => $this->client->phone,
            ]),
            'worker' => $this->whenLoaded('worker', fn () => [
                'id' => $this->worker->id,
                'name' => $this->worker->name,
                'avatar_url' => $this->worker->avatar_url,
            ]),
            'start_time' => $this->start_time->toIso8601String(),
            'end_time' => $this->end_time->toIso8601String(),
            'total_duration_minutes' => $this->total_duration_minutes,
            'subtotal_amount' => (string) $this->subtotal_amount,
            'loyalty_points_used' => $this->loyalty_points_used,
            'discount_amount' => (string) $this->discount_amount,
            'total_amount' => (string) $this->total_amount,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'status' => $this->status,
            'notes' => $this->notes,
            'services' => $this->whenLoaded('lineItems', fn () => $this->lineItems->map(fn ($item) => [
                'id' => $item->id,
                'service_id' => $item->service_id,
                'service_name' => $item->service?->name ?? 'Removed service',
                'price_at_booking' => (string) $item->price_at_booking,
                'duration_at_booking' => $item->duration_at_booking,
            ])),
            'review' => new ReviewResource($this->whenLoaded('review')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
