<?php

namespace App\Services;

use App\Mail\LoginOtpMail;
use App\Mail\SendPasswordResetOtpMail;
use App\Mail\SendRegistrationOtpMail;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

/**
 * Emailed 6-digit codes, stored hashed in cache with a short TTL.
 *
 * Purposes:
 *  - "login":    passwordless sign-in for legacy guests at the login screen.
 *  - "register": mandatory email-ownership verification for new full accounts.
 *  - "reset":    forgot-password flow; proves email ownership before a new
 *                password is accepted.
 */
class OtpService
{
    public const PURPOSE_LOGIN = 'login';
    public const PURPOSE_REGISTER = 'register';
    public const PURPOSE_RESET = 'reset';

    public const TTL_MINUTES = [
        self::PURPOSE_LOGIN => 10,
        self::PURPOSE_REGISTER => 15,
        self::PURPOSE_RESET => 15,
    ];

    public const RESEND_COOLDOWN_SECONDS = 60;
    public const MAX_ATTEMPTS = 5;

    /** @return bool false when throttled (a recent code is still valid). */
    public function send(User $user, string $purpose = self::PURPOSE_LOGIN): bool
    {
        $key = $this->key($user->email, $purpose);

        if (Cache::has("{$key}:cooldown")) {
            return false;
        }

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $ttl = self::TTL_MINUTES[$purpose] ?? 10;

        Cache::put($key, Hash::make($code), now()->addMinutes($ttl));
        Cache::put("{$key}:cooldown", true, self::RESEND_COOLDOWN_SECONDS);
        Cache::forget("{$key}:attempts");

        $mailable = match ($purpose) {
            self::PURPOSE_REGISTER => new SendRegistrationOtpMail($user, $code, $ttl),
            self::PURPOSE_RESET => new SendPasswordResetOtpMail($user, $code, $ttl),
            default => new LoginOtpMail($user, $code, $ttl),
        };

        Mail::to($user)->queue($mailable);

        return true;
    }

    public function verify(string $email, string $code, string $purpose = self::PURPOSE_LOGIN): bool
    {
        $key = $this->key($email, $purpose);

        $attempts = (int) Cache::get("{$key}:attempts", 0);
        if ($attempts >= self::MAX_ATTEMPTS) {
            return false;
        }
        Cache::put("{$key}:attempts", $attempts + 1, now()->addMinutes(self::TTL_MINUTES[$purpose] ?? 10));

        $hash = Cache::get($key);
        if (! $hash || ! Hash::check($code, $hash)) {
            return false;
        }

        Cache::forget($key);
        Cache::forget("{$key}:attempts");

        return true;
    }

    protected function key(string $email, string $purpose): string
    {
        return "otp:{$purpose}:".strtolower($email);
    }
}
