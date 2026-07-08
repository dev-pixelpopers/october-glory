<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

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
            'proof_url' => $this->publicProofUrl(),
            'platform' => $this->platform,
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }

    /**
     * Fully qualified public asset URL for the proof screenshot.
     * Rows written before the path refactor hold an absolute URL already.
     */
    protected function publicProofUrl(): string
    {
        if (str_starts_with($this->proof_url, 'http')) {
            return $this->proof_url;
        }

        return url(Storage::url($this->proof_url));
    }
}
