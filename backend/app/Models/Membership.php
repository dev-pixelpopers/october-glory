<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Membership extends Model
{
    use Auditable;

    protected $fillable = ['name', 'price', 'billing_cycle', 'benefits', 'is_active'];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'benefits' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function userMemberships(): HasMany
    {
        return $this->hasMany(UserMembership::class);
    }
}
