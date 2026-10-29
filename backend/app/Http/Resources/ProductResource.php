<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'category' => $this->category,
            'description' => $this->description,
            'image' => $this->image,
            'gallery' => $this->gallery ?? [],
            'price' => (string) $this->price,
            'tags' => $this->tags ?? [],
            'length' => $this->length,
            'texture' => $this->texture,
            'color' => $this->color,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
        ];
    }
}
