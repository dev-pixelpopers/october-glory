<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'category' => new ServiceCategoryResource($this->whenLoaded('category')),
            'name' => $this->name,
            'description' => $this->description,
            'duration_minutes' => $this->duration_minutes,
            'is_active' => $this->is_active,
            'current_price' => (string) ($this->currentPrice?->price ?? '0.00'),
        ];
    }
}
