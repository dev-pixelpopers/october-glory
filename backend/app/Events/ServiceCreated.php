<?php

namespace App\Events;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ServiceCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Service $service,
        public ?User $user = null
    ) {}
}
