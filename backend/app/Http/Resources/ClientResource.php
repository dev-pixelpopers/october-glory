<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** A client as the admin Clients tab sees them, with membership status. */
class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'is_guest' => (bool) $this->is_guest,
            'is_member' => $this->isMember(),
            'membership_since' => $this->activeMembership?->starts_at?->toIso8601String(),
            'membership_ends_at' => $this->activeMembership?->ends_at?->toIso8601String(),
            'appointments_count' => (int) ($this->appointments_as_client_count ?? 0),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
