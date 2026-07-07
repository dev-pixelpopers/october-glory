<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdjustLoyaltyRequest;
use App\Http\Requests\UpdateLoyaltySettingsRequest;
use App\Http\Resources\LoyaltyTransactionResource;
use App\Models\LoyaltyTransaction;
use App\Models\Setting;
use App\Models\User;
use App\Services\LoyaltyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LoyaltyController extends Controller
{
    public function __construct(protected LoyaltyService $loyalty) {}

    public function balance(Request $request): JsonResponse
    {
        $user = $request->user();

        // Scoped guest-session: the account's saved balance is locked (and
        // not disclosed) until the owner signs in with their password.
        $locked = ! $user->hasFullSession();

        return response()->json([
            'balance' => $locked ? 0 : $this->loyalty->balance($user),
            'locked' => $locked,
            'conversion_rate' => $this->loyalty->conversionRate(),
            'points_per_booking' => $this->loyalty->pointsPerBooking(),
            'shoutout_bonus_points' => $this->loyalty->shoutoutBonus(),
        ]);
    }

    public function transactions(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $query = $user->hasFullSession()
            ? $user->loyaltyTransactions()->latest()
            : $user->loyaltyTransactions()->whereRaw('1 = 0'); // history hidden on scoped sessions

        return LoyaltyTransactionResource::collection($query->paginate(15));
    }

    /* --------------------------------- Admin --------------------------------- */

    public function settings(): JsonResponse
    {
        return response()->json([
            'conversion_rate' => $this->loyalty->conversionRate(),
            'points_per_booking' => $this->loyalty->pointsPerBooking(),
            'shoutout_bonus_points' => $this->loyalty->shoutoutBonus(),
        ]);
    }

    public function updateSettings(UpdateLoyaltySettingsRequest $request): JsonResponse
    {
        if ($request->has('conversion_rate')) {
            Setting::set(LoyaltyService::KEY_CONVERSION_RATE, (string) $request->validated('conversion_rate'));
        }
        if ($request->has('points_per_booking')) {
            Setting::set(LoyaltyService::KEY_POINTS_PER_BOOKING, (string) $request->validated('points_per_booking'));
        }
        if ($request->has('shoutout_bonus_points')) {
            Setting::set(LoyaltyService::KEY_SHOUTOUT_BONUS, (string) $request->validated('shoutout_bonus_points'));
        }

        return $this->settings();
    }

    public function adjust(AdjustLoyaltyRequest $request): JsonResponse
    {
        $target = User::query()->findOrFail($request->validated('user_id'));

        $this->loyalty->record(
            $target,
            (int) $request->validated('amount'),
            LoyaltyTransaction::TYPE_ADMIN_ADJUSTMENT,
            $request->validated('description'),
        );

        return response()->json(['balance' => $this->loyalty->balance($target)]);
    }
}
