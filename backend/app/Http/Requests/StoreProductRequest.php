<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['string', 'max:2048'],
            'background_image' => ['nullable'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'length' => ['nullable', 'string', 'max:255'],
            'texture' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'what_she_wanted' => ['nullable', 'string'],
            'what_we_built' => ['nullable', 'string'],
            'how_she_wears_it' => ['nullable', 'string'],
            'video' => ['nullable'],
            'the_install' => ['nullable', 'array'],
            'the_install.*' => ['array'],
            'the_install.*.image' => ['nullable'],
            'the_install.*.tag' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
