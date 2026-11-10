<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'service_ids' => ['required_without:package_id', 'array'],
            'service_ids.*' => ['integer', 'exists:services,id'],
            'package_id' => ['nullable', 'integer', 'exists:packages,id'],
            'worker_id' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
