<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\LoyaltyTransaction;
use App\Models\User;
use App\Models\WorkerProfile;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Admin dashboard analytics. Aggregation happens in PHP after a windowed
 * fetch so the queries stay portable across SQLite / MySQL / Postgres.
 */
class AnalyticsController extends Controller
{
    /** Gross revenue over time: ?granularity=daily|weekly|monthly|yearly */
    public function revenue(Request $request): JsonResponse
    {
        $granularity = $request->query('granularity', 'daily');

        [$from, $format] = match ($granularity) {
            'weekly' => [now()->subWeeks(12)->startOfWeek(), 'o-\WW'],
            'monthly' => [now()->subMonths(12)->startOfMonth(), 'Y-m'],
            'yearly' => [now()->subYears(5)->startOfYear(), 'Y'],
            default => [now()->subDays(30)->startOfDay(), 'Y-m-d'],
        };

        $rows = Appointment::query()
            ->whereNotIn('status', [Appointment::STATUS_CANCELLED, Appointment::STATUS_NO_SHOW])
            ->where('start_time', '>=', $from)
            ->get(['start_time', 'total_amount'])
            ->groupBy(fn (Appointment $a) => $a->start_time->format($format))
            ->map(fn ($group, $period) => [
                'period' => $period,
                'revenue' => round($group->sum(fn ($a) => (float) $a->total_amount), 2),
            ])
            ->sortKeys()
            ->values();

        return response()->json(['data' => $rows]);
    }

    /** Completed vs cancelled vs no-show volume, monthly for the last 6 months. */
    public function appointmentVolume(): JsonResponse
    {
        $from = now()->subMonths(6)->startOfMonth();

        $rows = Appointment::query()
            ->where('start_time', '>=', $from)
            ->get(['start_time', 'status'])
            ->groupBy(fn (Appointment $a) => $a->start_time->format('Y-m'))
            ->map(fn ($group, $period) => [
                'period' => $period,
                'completed' => $group->where('status', Appointment::STATUS_COMPLETED)->count(),
                'cancelled' => $group->where('status', Appointment::STATUS_CANCELLED)->count(),
                'no_show' => $group->where('status', Appointment::STATUS_NO_SHOW)->count(),
            ])
            ->sortKeys()
            ->values();

        return response()->json(['data' => $rows]);
    }

    /** Booked vs available hours per specialist over the trailing 30 days. */
    public function workerUtilization(): JsonResponse
    {
        $from = CarbonImmutable::now()->subDays(30)->startOfDay();
        $to = CarbonImmutable::now();

        $profiles = WorkerProfile::query()
            ->whereHas('user', fn ($q) => $q->where('role', User::ROLE_WORKER)->where('is_active', true))
            ->with(['user', 'schedules'])
            ->get();

        $data = $profiles->map(function (WorkerProfile $profile) use ($from, $to) {
            $bookedMinutes = (int) Appointment::query()
                ->where('worker_id', $profile->user_id)
                ->whereIn('status', Appointment::BLOCKING_STATUSES)
                ->whereBetween('start_time', [$from, $to])
                ->sum('total_duration_minutes');

            // Sum shift lengths across every calendar day in the window.
            $availableMinutes = 0;
            for ($day = $from; $day->lte($to); $day = $day->addDay()) {
                $shift = $profile->schedules
                    ->where('day_of_week', $day->dayOfWeek)
                    ->where('is_day_off', false)
                    ->first();
                if ($shift) {
                    $availableMinutes += CarbonImmutable::parse($shift->start_time)
                        ->diffInMinutes(CarbonImmutable::parse($shift->end_time));
                }
            }

            return [
                'worker_id' => $profile->user_id,
                'worker_name' => $profile->user->name,
                'booked_hours' => round($bookedMinutes / 60, 1),
                'available_hours' => round($availableMinutes / 60, 1),
                'utilization_pct' => $availableMinutes > 0
                    ? round($bookedMinutes / $availableMinutes * 100, 1)
                    : 0,
            ];
        })->sortByDesc('utilization_pct')->values();

        return response()->json(['data' => $data]);
    }

    /** Points issued vs redeemed, monthly for the last 6 months. */
    public function loyaltyEconomy(): JsonResponse
    {
        $from = now()->subMonths(6)->startOfMonth();

        $rows = LoyaltyTransaction::query()
            ->where('created_at', '>=', $from)
            ->get(['amount', 'created_at'])
            ->groupBy(fn (LoyaltyTransaction $t) => $t->created_at->format('Y-m'))
            ->map(fn ($group, $period) => [
                'period' => $period,
                'issued' => (int) $group->where('amount', '>', 0)->sum('amount'),
                'redeemed' => (int) abs($group->where('amount', '<', 0)->sum('amount')),
            ])
            ->sortKeys()
            ->values();

        return response()->json(['data' => $rows]);
    }
}
