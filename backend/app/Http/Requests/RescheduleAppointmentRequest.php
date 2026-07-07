<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RescheduleAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'start_time' => ['required', 'date', 'after:now'],
            'worker_id' => ['sometimes', 'integer', 'exists:users,id'],
        ];
    }
}
