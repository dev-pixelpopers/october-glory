<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadImageRequest extends FormRequest
{
    public const FOLDERS = ['services', 'products', 'packages', 'categories', 'workers'];

    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            // 5 MB ceiling. php.ini's upload_max_filesize/post_max_size must
            // exceed this, or PHP drops the file before validation.
            'image' => ['required', 'file', 'mimes:png,jpg,jpeg,webp,gif', 'max:5120'],
            'folder' => ['sometimes', 'string', 'in:'.implode(',', self::FOLDERS)],
        ];
    }

    public function messages(): array
    {
        return [
            'image.uploaded' => 'The image could not be received — it may be larger than the server accepts. Please try one under 5 MB.',
        ];
    }
}
