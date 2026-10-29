<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'collection' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:2048'],
            'includes' => ['nullable', 'array'],
            'includes.*' => ['string'],
            'not_included' => ['nullable', 'string'],
            'best_for' => ['nullable', 'string'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            // May be empty for flat-priced packages that aren't built from
            // services (e.g. bridal Full Day) — those must give a price.
            'service_ids' => ['present', 'array'],
            'service_ids.*' => ['integer', 'exists:services,id'],
            // Omit to default to the summed price of the selected services.
            'price' => [
                Rule::requiredIf(fn () => empty($this->input('service_ids'))),
                'nullable', 'numeric', 'min:0', 'max:99999999.99',
            ],
        ];
    }
}
