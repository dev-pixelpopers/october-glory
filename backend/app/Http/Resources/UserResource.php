<?php

namespace App\Http\Resources;

use App\Services\MembershipService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar_url' => $this->avatar_url,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'is_guest' => (bool) $this->is_guest,
            'has_password' => $this->password !== null,
            'is_member' => $this->isMember(),
            'membership_ends_at' => $this->activeMembership?->ends_at?->toIso8601String(),
            // So checkout can preview the member discount the API will apply.
            'member_discount_rate' => app(MembershipService::class)->discountRate(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
