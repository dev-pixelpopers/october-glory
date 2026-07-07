<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            // Unique among full accounts; an existing guest account with this
            // email is converted by the registration flow instead.
            'email' => [
                'required', 'email', 'max:255',
                Rule::unique('users', 'email')->where(fn ($q) => $q->where('is_guest', false)),
            ],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'An account with this email already exists — try signing in instead.',
        ];
    }
}
