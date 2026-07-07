<?php

namespace App\Services;

use App\Exceptions\SlotUnavailableException;
use App\Jobs\SendBookingConfirmationEmail;
use App\Jobs\SendReviewSolicitationEmail;
use App\Models\Appointment;
use App\Models\LoyaltyTransaction;
use App\Models\Service;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BookingService
{
    public function __construct(
        protected AvailabilityService $availability,
        protected LoyaltyService $loyalty,
    ) {}

    /**
     * Book a multi-service appointment.
     *
     * All verification runs inside a DB transaction with pessimistic locks
     * (SELECT ... FOR UPDATE) on the worker's overlapping appointment rows,
     * so two concurrent checkouts can never take the same slot.
     *
     * @param  int[]  $serviceIds
     * @param  int|null  $workerUserId  null = "Any Specialist" auto-routing
     */
    public function book(
        User $client,
        array $serviceIds,
        ?int $workerUserId,
        CarbonImmutable $start,
        string $paymentMethod,
        int $loyaltyPointsUsed = 0,
        ?string $notes = null,
    ): Appointment {
        $services = Service::query()
            ->with('currentPrice')
            ->whereIn('id', $serviceIds)
            ->where('is_active', true)
            ->get();

        if ($services->count() !== count(array_unique($serviceIds))) {
            throw ValidationException::withMessages(['service_ids' => 'One or more selected services are unavailable.']);
        }

        foreach ($services as $service) {
            if (! $service->currentPrice) {
                throw ValidationException::withMessages(['service_ids' => "\"{$service->name}\" has no active price."]);
            }
        }

        $duration = (int) $services->sum('duration_minutes');
        $end = $start->addMinutes($duration);

        if ($start->isPast()) {
            throw ValidationException::withMessages(['start_time' => 'That time is already in the past.']);
        }

        $candidates = $this->candidateWorkers($serviceIds, $workerUserId, $start, $end);
        if ($candidates->isEmpty()) {
            throw new SlotUnavailableException('No qualified specialist works that time window.');
        }

        return DB::transaction(function () use (
            $client, $services, $candidates, $start, $end, $duration,
            $paymentMethod, $loyaltyPointsUsed, $notes,
        ) {
            $worker = $this->lockFreeWorker($candidates, $start, $end);

            if (! $worker) {
                throw new SlotUnavailableException('That slot was just taken — please pick another time.');
            }

            // Dynamic salon-wide concurrency ceiling (N active scheduled workers).
            if (! $this->availability->salonHasCapacity($start, $end)) {
                throw new SlotUnavailableException('The salon is fully booked for that window.');
            }

            $subtotal = $services->sum(fn (Service $s) => (float) $s->currentPrice->price);

            [$discount, $pointsUsed] = $this->resolveRedemption($client, $loyaltyPointsUsed, $subtotal);
            $total = round(max(0, $subtotal - $discount), 2);

            $appointment = Appointment::query()->create([
                'booking_reference' => $this->generateReference(),
                'client_id' => $client->id,
                'worker_id' => $worker->id,
                'start_time' => $start,
                'end_time' => $end,
                'total_duration_minutes' => $duration,
                'subtotal_amount' => $subtotal,
                'loyalty_points_used' => $pointsUsed,
                'discount_amount' => $discount,
                'total_amount' => $total,
                'payment_method' => $paymentMethod,
                'payment_status' => 'pending',
                'status' => Appointment::STATUS_SCHEDULED,
                'notes' => $notes,
            ]);

            // Immutable line-item snapshots from the active price history rows.
            foreach ($services as $service) {
                $appointment->lineItems()->create([
                    'service_id' => $service->id,
                    'price_at_booking' => $service->currentPrice->price,
                    'duration_at_booking' => $service->duration_minutes,
                ]);
            }

            if ($pointsUsed > 0) {
                $this->loyalty->record(
                    $client,
                    -$pointsUsed,
                    LoyaltyTransaction::TYPE_REDEMPTION,
                    "Redeemed {$pointsUsed} points on booking {$appointment->booking_reference}",
                    $appointment,
                );
            }

            $reward = $this->loyalty->pointsPerBooking();
            if ($reward > 0) {
                $this->loyalty->record(
                    $client,
                    $reward,
                    LoyaltyTransaction::TYPE_BOOKING_REWARD,
                    "Earned {$reward} points for booking {$appointment->booking_reference}",
                    $appointment,
                );
            }

            // Lifecycle emails: instant confirmation + review ask 15 min after the session.
            SendBookingConfirmationEmail::dispatch($appointment);
            SendReviewSolicitationEmail::dispatch($appointment)
                ->delay($appointment->end_time->addMinutes(15));

            return $appointment->load(['client', 'worker', 'lineItems.service']);
        });
    }

    /**
     * Qualified workers whose shift covers the window, preferring the
     * least-loaded first for "Any Specialist" routing.
     */
    protected function candidateWorkers(array $serviceIds, ?int $workerUserId, CarbonImmutable $start, CarbonImmutable $end)
    {
        return $this->availability
            ->qualifiedWorkers($serviceIds, $workerUserId)
            ->filter(function ($profile) use ($start, $end) {
                $schedule = $profile->schedules
                    ->where('day_of_week', $start->dayOfWeek)
                    ->where('is_day_off', false)
                    ->first();

                return $schedule
                    && $start->format('H:i:s') >= $schedule->start_time
                    && $end->format('H:i:s') <= $schedule->end_time
                    && $start->isSameDay($end);
            })
            ->sortBy(fn ($profile) => Appointment::query()
                ->where('worker_id', $profile->user_id)
                ->whereDate('start_time', $start)
                ->whereIn('status', Appointment::BLOCKING_STATUSES)
                ->count());
    }

    /**
     * SELECT ... FOR UPDATE on each candidate's overlapping rows; the first
     * worker with zero locked conflicts wins the slot.
     */
    protected function lockFreeWorker($candidates, CarbonImmutable $start, CarbonImmutable $end): ?User
    {
        foreach ($candidates as $profile) {
            $conflicts = Appointment::query()
                ->where('worker_id', $profile->user_id)
                ->overlapping($start, $end)
                ->lockForUpdate()
                ->count();

            if ($conflicts === 0) {
                return $profile->user;
            }
        }

        return null;
    }

    /** @return array{0: float, 1: int} [discount amount, points actually used] */
    protected function resolveRedemption(User $client, int $requestedPoints, float $subtotal): array
    {
        if ($requestedPoints <= 0) {
            return [0.0, 0];
        }

        if ($requestedPoints > $this->loyalty->balance($client)) {
            throw ValidationException::withMessages(['loyalty_points_used' => 'Not enough loyalty points.']);
        }

        $rate = (float) $this->loyalty->conversionRate();
        $maxPoints = $rate > 0 ? (int) floor($subtotal / $rate) : 0;
        $points = min($requestedPoints, $maxPoints);

        return [round($points * $rate, 2), $points];
    }

    protected function generateReference(): string
    {
        do {
            $reference = 'SLN-'.strtoupper(Str::random(6));
        } while (Appointment::query()->where('booking_reference', $reference)->exists());

        return $reference;
    }
}
