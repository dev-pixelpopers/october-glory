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
            // Matches the site page (/services/<category slug>/<slug>) when one exists.
            'slug' => $this->slug,
            'sort_order' => $this->sort_order,
            'description' => $this->description,
            'image' => $this->image,
            'duration_minutes' => $this->duration_minutes,
            'is_active' => $this->is_active,
            // When true, current_price is 0.00 and the stylist quotes at consultation.
            'price_by_consultation' => (bool) $this->price_by_consultation,
            'current_price' => (string) ($this->currentPrice?->price ?? '0.00'),
        ];
    }
}
