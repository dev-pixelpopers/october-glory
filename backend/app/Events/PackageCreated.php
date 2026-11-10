<?php

namespace App\Events;

use App\Models\Package;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PackageCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Package $package,
        public ?User $user = null
    ) {}
}
