<?php

namespace App\Services;

use App\Models\Membership;
use App\Models\Setting;
use App\Models\User;
use App\Models\UserMembership;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

/**
 * Membership status and the member discount. Members pay the listed price
 * less the discount rate (30% by default) on every booking.
 */
class MembershipService
{
    public const KEY_DISCOUNT_RATE = 'membership.discount_rate';

    public const DEFAULT_DISCOUNT_RATE = '0.30';

    /** Fraction off for members, e.g. 0.30. */
    public function discountRate(): float
    {
        return (float) Setting::get(self::KEY_DISCOUNT_RATE, self::DEFAULT_DISCOUNT_RATE);
    }

    /** The member discount on a subtotal — 0 for non-members. */
    public function discountFor(User $user, float $subtotal): float
    {
        return $user->isMember() ? round($subtotal * $this->discountRate(), 2) : 0.0;
    }

    /**
     * Make a client a member from now, optionally until $endsAt. Any current
     * membership is closed first, so a client has at most one active row.
     */
    public function grant(User $user, ?CarbonInterface $endsAt = null): UserMembership
    {
        return DB::transaction(function () use ($user, $endsAt) {
            $this->closeActive($user, 'cancelled');

            $plan = Membership::query()->where('is_active', true)->orderBy('id')->first()
                ?? Membership::query()->create([
                    'name' => 'Glory Membership',
                    'price' => 0,
                    'billing_cycle' => 'monthly',
                    'is_active' => true,
                ]);

            return $user->memberships()->create([
                'membership_id' => $plan->id,
                'starts_at' => now(),
                'ends_at' => $endsAt,
                'status' => 'active',
            ]);
        });
    }

    public function revoke(User $user): void
    {
        $this->closeActive($user, 'cancelled');
    }

    private function closeActive(User $user, string $status): void
    {
        $user->memberships()
            ->where('status', 'active')
            ->get()
            ->each(fn (UserMembership $m) => $m->update([
                'status' => $status,
                // Never extend: an already-past end date is kept.
                'ends_at' => $m->ends_at && $m->ends_at->isPast() ? $m->ends_at : now(),
            ]));
    }
}
