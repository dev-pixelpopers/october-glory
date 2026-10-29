<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMembershipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'is_member' => ['required', 'boolean'],
            // Optional end date for a granted membership; open-ended when omitted.
            'ends_at' => ['nullable', 'date', 'after:today'],
        ];
    }
}
