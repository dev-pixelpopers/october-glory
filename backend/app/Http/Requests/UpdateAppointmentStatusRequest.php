<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Route-level middleware restricts this to workers/admins;
        // ownership is enforced in the controller.
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:checked_in,in_progress,completed,no_show'],
        ];
    }
}
