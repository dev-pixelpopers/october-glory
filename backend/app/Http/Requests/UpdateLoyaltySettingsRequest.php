<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLoyaltySettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'conversion_rate' => ['sometimes', 'numeric', 'min:0', 'max:1000'],
            'points_per_booking' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'shoutout_bonus_points' => ['sometimes', 'integer', 'min:0', 'max:100000'],
        ];
    }
}
