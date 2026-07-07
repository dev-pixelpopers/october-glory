<?php

namespace App\Services;

use App\Models\LoyaltyTransaction;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Strict double-entry style ledger: the balance is always
 * SUM(amount) over loyalty_transactions — never a stored counter.
 */
class LoyaltyService
{
    public const KEY_CONVERSION_RATE = 'loyalty.conversion_rate';
    public const KEY_POINTS_PER_BOOKING = 'loyalty.points_per_booking';
    public const KEY_SHOUTOUT_BONUS = 'loyalty.shoutout_bonus';

    public const DEFAULT_CONVERSION_RATE = '0.10'; // $ per point
    public const DEFAULT_POINTS_PER_BOOKING = 50;
    public const DEFAULT_SHOUTOUT_BONUS = 100;

    public function balance(User $user): int
    {
        return $user->loyaltyBalance();
    }

    public function conversionRate(): string
    {
        return Setting::get(self::KEY_CONVERSION_RATE, self::DEFAULT_CONVERSION_RATE);
    }

    public function pointsPerBooking(): int
    {
        return (int) Setting::get(self::KEY_POINTS_PER_BOOKING, (string) self::DEFAULT_POINTS_PER_BOOKING);
    }

    public function shoutoutBonus(): int
    {
        return (int) Setting::get(self::KEY_SHOUTOUT_BONUS, (string) self::DEFAULT_SHOUTOUT_BONUS);
    }

    public function record(
        User $user,
        int $amount,
        string $type,
        string $description,
        ?Model $reference = null,
    ): LoyaltyTransaction {
        return LoyaltyTransaction::query()->create([
            'user_id' => $user->id,
            'amount' => $amount,
            'type' => $type,
            'description' => $description,
            'reference_type' => $reference?->getMorphClass(),
            'reference_id' => $reference?->getKey(),
        ]);
    }
}
