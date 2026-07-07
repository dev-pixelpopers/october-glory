<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShoutoutClaimResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ]),
            'proof_url' => $this->proof_url,
            'platform' => $this->platform,
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
