<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use Auditable;

    protected $fillable = [
        'name', 'slug', 'category', 'description', 'image', 'gallery',
        'background_image', 'price', 'tags', 'length', 'texture', 'color',
        'what_she_wanted', 'what_we_built', 'how_she_wears_it', 'video', 'the_install',
        'is_featured', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'gallery' => 'array',
            'tags' => 'array',
            'the_install' => 'array',
            'price' => 'decimal:2',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
