<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Wraps a WorkerProfile; exposes the worker's user id as the public id. */
class WorkerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->user_id,
            'name' => $this->user->name,
            'avatar_url' => $this->user->avatar_url,
            'is_active' => $this->user->is_active,
            'profile' => [
                'id' => $this->id,
                'bio' => $this->bio,
                'specialties' => $this->specialties,
                'is_available' => $this->is_available,
            ],
            'schedules' => $this->whenLoaded('schedules', fn () => $this->schedules->map(fn ($s) => [
                'id' => $s->id,
                'worker_profile_id' => $s->worker_profile_id,
                'day_of_week' => $s->day_of_week,
                'start_time' => substr($s->start_time, 0, 5),
                'end_time' => substr($s->end_time, 0, 5),
                'is_day_off' => $s->is_day_off,
            ])),
            'service_ids' => $this->whenLoaded('services', fn () => $this->services->pluck('id')),
            'rating_average' => $this->when(isset($this->rating_average), fn () => $this->rating_average !== null ? round((float) $this->rating_average, 2) : null),
            'reviews_count' => $this->when(isset($this->reviews_count), fn () => (int) $this->reviews_count),
        ];
    }
}
