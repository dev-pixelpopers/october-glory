<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShoutoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'platform' => ['required', 'string', 'max:50'],
            // Screenshot proof: multipart upload, 5 MB ceiling.
            'proof_image' => ['required', 'file', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
        ];
    }
}
