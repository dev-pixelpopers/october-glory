<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RescheduleAppointmentRequest;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentStatusRequest;
use App\Models\Appointment;
use App\Models\User;
use App\Services\BookingService;
use Carbon\CarbonImmutable;
use App\Http\Resources\AppointmentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    public function __construct(protected BookingService $booking) {}

    /** Role-scoped listing: clients see their own, workers their assigned, admins all. */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $appointments = Appointment::query()
            ->with(['client', 'worker', 'lineItems.service', 'review', 'package'])
            ->when($user->role === User::ROLE_CLIENT, fn ($q) => $q->where('client_id', $user->id))
            // Scoped guest-session on a full account: no historical data —
            // only bookings made during this session are visible.
            ->when(! $user->hasFullSession(), fn ($q) => $q->where(
                'appointments.created_at', '>=', $user->currentAccessToken()->created_at,
            ))
            ->when($user->role === User::ROLE_WORKER, fn ($q) => $q->where('worker_id', $user->id))
            ->when($request->query('worker_id') && $user->isAdmin(), fn ($q) => $q->where('worker_id', $request->query('worker_id')))
            ->when($request->query('client_id') && $user->isAdmin(), fn ($q) => $q->where('client_id', $request->query('client_id')))
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('from'), fn ($q, $from) => $q->where('start_time', '>=', $from))
            ->when($request->query('to'), fn ($q, $to) => $q->where('start_time', '<=', $to.' 23:59:59'))
            ->orderByDesc('start_time')
            ->paginate(20);

        return AppointmentResource::collection($appointments);
    }

    public function store(StoreAppointmentRequest $request): AppointmentResource
    {
        // A scoped guest-session may book, but redeeming the account's saved
        // loyalty points requires the standard password sign-in.
        if (! $request->user()->hasFullSession() && (int) $request->validated('loyalty_points_used', 0) > 0) {
            throw ValidationException::withMessages([
                'loyalty_points_used' => 'Sign in with your password to redeem your saved loyalty points.',
            ]);
        }

        $appointment = $this->booking->book(
            client: $request->user(),
            serviceIds: array_map('intval', $request->validated('service_ids', [])),
            workerUserId: $request->validated('worker_id') !== null ? (int) $request->validated('worker_id') : null,
            start: CarbonImmutable::parse($request->validated('start_time'))->setTimezone(config('app.timezone')),
            paymentMethod: $request->validated('payment_method'),
            loyaltyPointsUsed: (int) $request->validated('loyalty_points_used', 0),
            notes: $request->validated('notes'),
            packageId: $request->validated('package_id') !== null ? (int) $request->validated('package_id') : null,
        );

        return new AppointmentResource($appointment->load(['review', 'package']));
    }

    /** Live status controls for workers (and admins). */
    public function updateStatus(UpdateAppointmentStatusRequest $request, Appointment $appointment): AppointmentResource
    {
        $user = $request->user();

        abort_unless(
            $user->isAdmin() || ($user->isWorker() && $appointment->worker_id === $user->id),
            403,
        );

        if (in_array($appointment->status, [Appointment::STATUS_CANCELLED, Appointment::STATUS_COMPLETED], true)) {
            throw ValidationException::withMessages(['status' => "A {$appointment->status} appointment can no longer change status."]);
        }

        $oldStatus = $appointment->status;
        $newStatus = $request->validated('status');
        $appointment->update(['status' => $newStatus]);

        if ($newStatus === Appointment::STATUS_COMPLETED && $appointment->payment_method === 'pay_upon_arrival') {
            $appointment->update(['payment_status' => 'paid']);
        }

        $fresh = $appointment->fresh(['client', 'worker', 'lineItems.service', 'review']);
        event(new \App\Events\AppointmentStatusUpdated($fresh, $oldStatus, $newStatus));

        return new AppointmentResource($fresh);
    }

    /** Policy window: clients may cancel until 24h before start; admins any time. */
    public function cancel(Request $request, Appointment $appointment): AppointmentResource
    {
        $user = $request->user();

        abort_unless($user->isAdmin() || $appointment->client_id === $user->id, 403);

        if ($appointment->status !== Appointment::STATUS_SCHEDULED) {
            throw ValidationException::withMessages(['status' => 'Only scheduled appointments can be cancelled.']);
        }

        if (! $user->isAdmin() && now()->diffInHours($appointment->start_time, false) < 24) {
            throw ValidationException::withMessages(['status' => 'Cancellations must be made at least 24 hours in advance.']);
        }

        $appointment->update(['status' => Appointment::STATUS_CANCELLED]);

        $fresh = $appointment->fresh(['client', 'worker', 'lineItems.service', 'review']);
        event(new \App\Events\AppointmentCancelled($fresh, $user));

        return new AppointmentResource($fresh);
    }

    /** Admin override: move an appointment to a new time (and optionally worker). */
    public function reschedule(RescheduleAppointmentRequest $request, Appointment $appointment): AppointmentResource
    {
        $start = CarbonImmutable::parse($request->validated('start_time'))->setTimezone(config('app.timezone'));
        $end = $start->addMinutes($appointment->total_duration_minutes);
        $workerId = (int) ($request->validated('worker_id') ?? $appointment->worker_id);

        $conflicts = Appointment::query()
            ->where('worker_id', $workerId)
            ->whereKeyNot($appointment->id)
            ->overlapping($start, $end)
            ->count();

        if ($conflicts > 0) {
            throw ValidationException::withMessages(['start_time' => 'The worker already has an appointment in that window.']);
        }

        $oldStart = $appointment->start_time;
        $oldWorkerId = $appointment->worker_id;

        $appointment->update([
            'worker_id' => $workerId,
            'start_time' => $start,
            'end_time' => $end,
        ]);

        $fresh = $appointment->fresh(['client', 'worker', 'lineItems.service', 'review']);
        event(new \App\Events\AppointmentRescheduled($fresh, $oldStart, $oldWorkerId));

        return new AppointmentResource($fresh);
    }
}
