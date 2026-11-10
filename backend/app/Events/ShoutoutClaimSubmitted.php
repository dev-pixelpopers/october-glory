<?php

namespace App\Events;

use App\Models\ShoutoutClaim;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ShoutoutClaimSubmitted
{
    use Dispatchable, SerializesModels;

    public function __construct(public ShoutoutClaim $claim) {}
}
