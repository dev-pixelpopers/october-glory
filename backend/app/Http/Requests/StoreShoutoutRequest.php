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
            // NOTE: php.ini's upload_max_filesize/post_max_size must exceed
            // this, or PHP drops the file before validation ("uploaded" fails).
            'proof_image' => ['required', 'file', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'proof_image.uploaded' => 'The image could not be received — it may be larger than the server accepts. Please try one under 5 MB.',
        ];
    }
}
