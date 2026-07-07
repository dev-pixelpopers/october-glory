<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'phone', 'avatar_url', 'role', 'is_active', 'is_guest'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use Auditable, HasApiTokens, HasFactory, Notifiable;

    public const ROLE_ADMIN = 'admin';
    public const ROLE_WORKER = 'worker';
    public const ROLE_CLIENT = 'client';

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'is_guest' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * True for password-authenticated sessions (token abilities ['*']) and
     * session/cookie auth (TransientToken). False for ability-scoped
     * "guest-session" tokens issued to full accounts without a password check
     * — those may book, but not touch loyalty, history, or role-gated areas.
     */
    public function hasFullSession(): bool
    {
        return $this->tokenCan('full');
    }

    public function isWorker(): bool
    {
        return $this->role === self::ROLE_WORKER;
    }

    public function workerProfile(): HasOne
    {
        return $this->hasOne(WorkerProfile::class);
    }

    public function appointmentsAsClient(): HasMany
    {
        return $this->hasMany(Appointment::class, 'client_id');
    }

    public function appointmentsAsWorker(): HasMany
    {
        return $this->hasMany(Appointment::class, 'worker_id');
    }

    public function loyaltyTransactions(): HasMany
    {
        return $this->hasMany(LoyaltyTransaction::class);
    }

    public function reviewsReceived(): HasMany
    {
        return $this->hasMany(Review::class, 'worker_id');
    }

    public function loyaltyBalance(): int
    {
        return (int) $this->loyaltyTransactions()->sum('amount');
    }
}
