<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'service_ids' => ['required', 'array', 'min:1'],
            'service_ids.*' => ['integer', 'exists:services,id'],
            'worker_id' => ['nullable', 'integer', 'exists:users,id'],
            'start_time' => ['required', 'date'],
            'payment_method' => ['required', 'in:card,pay_upon_arrival'],
            'loyalty_points_used' => ['sometimes', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
