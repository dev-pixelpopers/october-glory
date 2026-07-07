<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use App\Models\WorkerProfile;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Slot generation: slides a window of the combined service duration across
 * each qualified worker's recurring shift (worker_schedules) and rejects
 * any position overlapping an existing blocking appointment.
 */
class AvailabilityService
{
    /** Candidate start times are generated on this grid (minutes). */
    public const STEP_MINUTES = 30;

    /**
     * @param  int[]  $serviceIds
     * @return Collection<int, array{start: string, end: string, worker_id: int, worker_name: string}>
     */
    public function slots(CarbonImmutable $date, array $serviceIds, ?int $workerUserId = null): Collection
    {
        $duration = $this->totalDuration($serviceIds);
        if ($duration <= 0) {
            return collect();
        }

        $workers = $this->qualifiedWorkers($serviceIds, $workerUserId);
        $slots = collect();

        foreach ($workers as $profile) {
            foreach ($this->workerSlots($profile, $date, $duration) as $slot) {
                $slots->push($slot);
            }
        }

        // One entry per start time; least-loaded qualified worker wins the tie
        // so "Any Specialist" auto-routing spreads bookings evenly.
        return $slots
            ->sortBy('start')
            ->groupBy('start')
            ->map(fn (Collection $group) => $group->sortBy('day_load')->first())
            ->values()
            ->map(fn (array $slot) => collect($slot)->except('day_load')->all());
    }

    public function totalDuration(array $serviceIds): int
    {
        return (int) Service::query()->whereIn('id', $serviceIds)->sum('duration_minutes');
    }

    /**
     * Workers qualified to perform ALL requested services (worker_services pivot),
     * active and available. Never hardcoded — fully dynamic per admin data.
     *
     * @return Collection<int, WorkerProfile>
     */
    public function qualifiedWorkers(array $serviceIds, ?int $workerUserId = null): Collection
    {
        $qualifiedProfileIds = DB::table('worker_services')
            ->whereIn('service_id', $serviceIds)
            ->groupBy('worker_profile_id')
            ->havingRaw('COUNT(DISTINCT service_id) = ?', [count(array_unique($serviceIds))])
            ->pluck('worker_profile_id');

        return WorkerProfile::query()
            ->whereIn('id', $qualifiedProfileIds)
            ->where('is_available', true)
            ->whereHas('user', function ($q) use ($workerUserId) {
                $q->where('role', User::ROLE_WORKER)->where('is_active', true);
                if ($workerUserId !== null) {
                    $q->where('id', $workerUserId);
                }
            })
            ->with(['user', 'schedules'])
            ->get();
    }

    /**
     * @return array<int, array{start: string, end: string, worker_id: int, worker_name: string, day_load: int}>
     */
    protected function workerSlots(WorkerProfile $profile, CarbonImmutable $date, int $duration): array
    {
        $schedule = $profile->schedules
            ->where('day_of_week', $date->dayOfWeek)
            ->where('is_day_off', false)
            ->first();

        if (! $schedule) {
            return [];
        }

        $shiftStart = $date->setTimeFromTimeString($schedule->start_time);
        $shiftEnd = $date->setTimeFromTimeString($schedule->end_time);

        $existing = Appointment::query()
            ->where('worker_id', $profile->user_id)
            ->overlapping($shiftStart, $shiftEnd)
            ->get(['start_time', 'end_time']);

        $dayLoad = $existing->count();
        $slots = [];

        for ($start = $shiftStart; $start->addMinutes($duration)->lte($shiftEnd); $start = $start->addMinutes(self::STEP_MINUTES)) {
            $end = $start->addMinutes($duration);

            if ($start->isPast()) {
                continue;
            }

            $collides = $existing->contains(
                fn ($appt) => $appt->start_time->lt($end) && $appt->end_time->gt($start),
            );

            if (! $collides) {
                $slots[] = [
                    'start' => $start->toIso8601String(),
                    'end' => $end->toIso8601String(),
                    'worker_id' => $profile->user_id,
                    'worker_name' => $profile->user->name,
                    'day_load' => $dayLoad,
                ];
            }
        }

        return $slots;
    }

    /**
     * Dynamic salon-wide capacity: concurrent active appointments during
     * [start, end) may never exceed the number of active workers whose
     * shift covers that window. N is derived live from admin data.
     */
    public function salonHasCapacity(CarbonImmutable $start, CarbonImmutable $end): bool
    {
        $onShift = WorkerProfile::query()
            ->where('is_available', true)
            ->whereHas('user', fn ($q) => $q->where('role', User::ROLE_WORKER)->where('is_active', true))
            ->whereHas('schedules', function ($q) use ($start, $end) {
                $q->where('day_of_week', $start->dayOfWeek)
                    ->where('is_day_off', false)
                    ->whereTime('start_time', '<=', $start->format('H:i:s'))
                    ->whereTime('end_time', '>=', $end->format('H:i:s'));
            })
            ->count();

        $concurrent = Appointment::query()->overlapping($start, $end)->count();

        return $concurrent < $onShift;
    }
}
