<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:2048'],
            'category_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:1440'],
            'price_by_consultation' => ['sometimes', 'boolean'],
            // Not needed when priced by consultation (stored as 0.00).
            'price' => ['required_unless:price_by_consultation,true', 'nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
