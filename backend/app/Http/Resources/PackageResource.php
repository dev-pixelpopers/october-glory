<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'category' => new ServiceCategoryResource($this->whenLoaded('category')),
            'collection' => $this->collection,
            'name' => $this->name,
            'slug' => $this->slug,
            'tagline' => $this->tagline,
            'description' => $this->description,
            'includes' => $this->includes ?? [],
            'not_included' => $this->not_included,
            'best_for' => $this->best_for,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            // Derived from the bundled services (requires the relation loaded).
            'duration_minutes' => $this->whenLoaded('services', fn () => $this->duration_minutes),
            'services_total' => $this->whenLoaded('services', fn () => (string) $this->services_total),
            // The salon's set package price (append-only ledger, active row).
            'price' => (string) ($this->currentPrice?->price ?? '0.00'),
            'services' => ServiceResource::collection($this->whenLoaded('services')),
        ];
    }
}
