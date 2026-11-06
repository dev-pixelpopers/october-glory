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
            'background_image' => $this->background_image,
            'price' => (string) $this->price,
            'tags' => $this->tags ?? [],
            'length' => $this->length,
            'texture' => $this->texture,
            'color' => $this->color,
            'what_she_wanted' => $this->what_she_wanted,
            'what_we_built' => $this->what_we_built,
            'how_she_wears_it' => $this->how_she_wears_it,
            'video' => $this->video,
            'the_install' => $this->the_install ?? [],
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
        ];
    }
}
