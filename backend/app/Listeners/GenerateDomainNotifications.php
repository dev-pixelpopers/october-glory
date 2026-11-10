<?php

namespace App\Listeners;

use App\Events\AppointmentBooked;
use App\Events\AppointmentCancelled;
use App\Events\AppointmentRescheduled;
use App\Events\AppointmentStatusUpdated;
use App\Events\PackageCreated;
use App\Events\ProductCreated;
use App\Events\ReviewSubmitted;
use App\Events\ServiceCreated;
use App\Events\ShoutoutClaimReviewed;
use App\Events\ShoutoutClaimSubmitted;
use App\Events\UserRegistered;
use App\Models\Appointment;
use App\Models\ShoutoutClaim;
use App\Models\User;
use App\Services\NotificationService;

class GenerateDomainNotifications
{
    public function handleAppointmentBooked(AppointmentBooked $event): void
    {
        $appointment = $event->appointment->loadMissing(['client', 'worker', 'lineItems.service', 'package']);
        $client = $appointment->client;
        $worker = $appointment->worker;
        $package = $appointment->package;

        $clientName = $client?->name ?? 'Guest';
        $workerName = $worker?->name ?? 'Specialist';
        $date = $appointment->start_time->format('M j, Y');
        $time = $appointment->start_time->format('g:i A');
        $itemDesc = $package ? "package \"{$package->name}\"" : "an appointment";

        // 1. Notify Client
        if ($client) {
            $clientMsg = $package
                ? "Your package booking for \"{$package->name}\" (#{$appointment->booking_reference}) is confirmed for {$date} at {$time} with {$workerName}."
                : "Your appointment (#{$appointment->booking_reference}) is confirmed for {$date} at {$time} with {$workerName}.";

            NotificationService::notify(
                $client->id,
                'appointment.booked',
                'Booking Confirmed',
                $clientMsg,
                $appointment,
                [
                    'appointment_id' => $appointment->id,
                    'booking_reference' => $appointment->booking_reference,
                    'package_id' => $appointment->package_id,
                    'start_time' => $appointment->start_time->toIso8601String(),
                    'url' => '/dashboard?tab=appointments',
                ]
            );
        }

        // 2. Notify Worker
        if ($worker) {
            $workerMsg = $package
                ? "You have been assigned package \"{$package->name}\" with {$clientName} on {$date} at {$time} (#{$appointment->booking_reference})."
                : "You have been assigned an appointment with {$clientName} on {$date} at {$time} (#{$appointment->booking_reference}).";

            NotificationService::notify(
                $worker->id,
                'appointment.assigned',
                'New Appointment Assigned',
                $workerMsg,
                $appointment,
                [
                    'appointment_id' => $appointment->id,
                    'booking_reference' => $appointment->booking_reference,
                    'package_id' => $appointment->package_id,
                    'start_time' => $appointment->start_time->toIso8601String(),
                    'url' => '/dashboard?tab=schedule',
                ]
            );
        }

        // 3. Notify Admin
        NotificationService::notifyAdmins(
            'admin.appointment.booked',
            'New Booking Received',
            "{$clientName} booked {$itemDesc} for {$date} at {$time} with {$workerName} (\${$appointment->total_amount}).",
            $appointment,
            [
                'appointment_id' => $appointment->id,
                'booking_reference' => $appointment->booking_reference,
                'package_id' => $appointment->package_id,
                'total_amount' => $appointment->total_amount,
                'url' => '/dashboard?tab=calendar',
            ]
        );
    }

    public function handleAppointmentStatusUpdated(AppointmentStatusUpdated $event): void
    {
        $appointment = $event->appointment->loadMissing(['client', 'worker']);
        $client = $appointment->client;
        $worker = $appointment->worker;

        $clientName = $client?->name ?? 'Client';
        $workerName = $worker?->name ?? 'Specialist';
        $date = $appointment->start_time->format('M j, Y');
        $time = $appointment->start_time->format('g:i A');

        switch ($event->newStatus) {
            case Appointment::STATUS_CHECKED_IN:
                if ($worker) {
                    NotificationService::notify(
                        $worker->id,
                        'appointment.checked_in',
                        'Client Checked In',
                        "{$clientName} has arrived and checked in for their appointment (#{$appointment->booking_reference}).",
                        $appointment,
                        ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=schedule']
                    );
                }
                if ($client) {
                    NotificationService::notify(
                        $client->id,
                        'appointment.checked_in',
                        'Checked In Successfully',
                        "You are checked in! {$workerName} will be ready for you shortly.",
                        $appointment,
                        ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=appointments']
                    );
                }
                break;

            case Appointment::STATUS_IN_PROGRESS:
                if ($client) {
                    NotificationService::notify(
                        $client->id,
                        'appointment.in_progress',
                        'Appointment In Progress',
                        "Your styling session with {$workerName} is now underway.",
                        $appointment,
                        ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=appointments']
                    );
                }
                break;

            case Appointment::STATUS_COMPLETED:
                if ($client) {
                    NotificationService::notify(
                        $client->id,
                        'appointment.completed',
                        'Appointment Completed',
                        "Thank you for visiting October Glory! We hope you love your new look. Don't forget to leave a review!",
                        $appointment,
                        ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=appointments']
                    );
                }
                NotificationService::notifyAdmins(
                    'admin.appointment.completed',
                    'Appointment Completed',
                    "Appointment #{$appointment->booking_reference} for {$clientName} was completed by {$workerName}.",
                    $appointment,
                    ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=calendar']
                );
                break;

            case Appointment::STATUS_NO_SHOW:
                if ($client) {
                    NotificationService::notify(
                        $client->id,
                        'appointment.no_show',
                        'Appointment Missed',
                        "Your appointment on {$date} at {$time} was marked as no-show. Please contact us to reschedule.",
                        $appointment,
                        ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=appointments']
                    );
                }
                NotificationService::notifyAdmins(
                    'admin.appointment.no_show',
                    'Appointment No-Show',
                    "{$clientName} missed their scheduled appointment (#{$appointment->booking_reference}) on {$date}.",
                    $appointment,
                    ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=calendar']
                );
                break;
        }
    }

    public function handleAppointmentCancelled(AppointmentCancelled $event): void
    {
        $appointment = $event->appointment->loadMissing(['client', 'worker']);
        $client = $appointment->client;
        $worker = $appointment->worker;

        $clientName = $client?->name ?? 'Client';
        $workerName = $worker?->name ?? 'Specialist';
        $date = $appointment->start_time->format('M j, Y');

        if ($client) {
            NotificationService::notify(
                $client->id,
                'appointment.cancelled',
                'Appointment Cancelled',
                "Your appointment (#{$appointment->booking_reference}) on {$date} has been cancelled.",
                $appointment,
                ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=appointments']
            );
        }

        if ($worker) {
            NotificationService::notify(
                $worker->id,
                'appointment.cancelled',
                'Appointment Cancelled',
                "The appointment with {$clientName} on {$date} (#{$appointment->booking_reference}) was cancelled.",
                $appointment,
                ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=schedule']
            );
        }

        NotificationService::notifyAdmins(
            'admin.appointment.cancelled',
            'Appointment Cancelled',
            "Appointment #{$appointment->booking_reference} for {$clientName} with {$workerName} was cancelled.",
            $appointment,
            ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=calendar']
        );
    }

    public function handleAppointmentRescheduled(AppointmentRescheduled $event): void
    {
        $appointment = $event->appointment->loadMissing(['client', 'worker']);
        $client = $appointment->client;
        $worker = $appointment->worker;

        $clientName = $client?->name ?? 'Client';
        $workerName = $worker?->name ?? 'Specialist';
        $newDate = $appointment->start_time->format('M j, Y');
        $newTime = $appointment->start_time->format('g:i A');

        if ($client) {
            NotificationService::notify(
                $client->id,
                'appointment.rescheduled',
                'Appointment Rescheduled',
                "Your appointment (#{$appointment->booking_reference}) has been moved to {$newDate} at {$newTime}.",
                $appointment,
                ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=appointments']
            );
        }

        if ($worker) {
            NotificationService::notify(
                $worker->id,
                'appointment.rescheduled',
                'Appointment Rescheduled',
                "Appointment #{$appointment->booking_reference} with {$clientName} was rescheduled to {$newDate} at {$newTime}.",
                $appointment,
                ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=schedule']
            );
        }

        NotificationService::notifyAdmins(
            'admin.appointment.rescheduled',
            'Appointment Rescheduled',
            "Appointment #{$appointment->booking_reference} ({$clientName}) rescheduled to {$newDate} at {$newTime}.",
            $appointment,
            ['appointment_id' => $appointment->id, 'url' => '/dashboard?tab=calendar']
        );
    }

    public function handleShoutoutClaimSubmitted(ShoutoutClaimSubmitted $event): void
    {
        $claim = $event->claim->loadMissing('user');
        $client = $claim->user;
        $platform = ucfirst($claim->platform);

        if ($client) {
            NotificationService::notify(
                $client->id,
                'shoutout.submitted',
                'Shoutout Claim Received',
                "We received your {$platform} shoutout proof! Our team will review it shortly for your loyalty points reward.",
                $claim,
                ['claim_id' => $claim->id, 'url' => '/dashboard?tab=rewards']
            );
        }

        NotificationService::notifyAdmins(
            'admin.shoutout.submitted',
            'New Shoutout Claim Awaiting Review',
            "{$client?->name} submitted a {$platform} shoutout claim for approval.",
            $claim,
            ['claim_id' => $claim->id, 'url' => '/dashboard?tab=shoutouts']
        );
    }

    public function handleShoutoutClaimReviewed(ShoutoutClaimReviewed $event): void
    {
        $claim = $event->claim->loadMissing('user');
        $client = $claim->user;
        if (! $client) return;

        $platform = ucfirst($claim->platform);

        if ($event->status === ShoutoutClaim::STATUS_APPROVED) {
            NotificationService::notify(
                $client->id,
                'shoutout.approved',
                'Shoutout Approved!',
                "Congratulations! Your {$platform} shoutout claim was approved and bonus points have been added to your loyalty balance.",
                $claim,
                ['claim_id' => $claim->id, 'url' => '/dashboard?tab=rewards']
            );
        } else {
            NotificationService::notify(
                $client->id,
                'shoutout.rejected',
                'Shoutout Claim Update',
                "Your {$platform} shoutout claim could not be approved at this time.".($claim->admin_notes ? " Note: {$claim->admin_notes}" : ''),
                $claim,
                ['claim_id' => $claim->id, 'url' => '/dashboard?tab=rewards']
            );
        }
    }

    public function handleReviewSubmitted(ReviewSubmitted $event): void
    {
        $review = $event->review->loadMissing(['client', 'worker', 'appointment']);
        $client = $review->client;
        $worker = $review->worker;
        $clientName = $client?->name ?? 'A client';

        if ($worker) {
            NotificationService::notify(
                $worker->id,
                'review.received',
                'New Client Review',
                "{$clientName} left you a {$review->rating}-star review".($review->comment ? ": \"{$review->comment}\"" : '.'),
                $review,
                ['review_id' => $review->id, 'rating' => $review->rating, 'url' => '/dashboard?tab=performance']
            );
        }

        NotificationService::notifyAdmins(
            'admin.review.received',
            'New Review Posted',
            "{$clientName} left a {$review->rating}-star review for {$worker?->name}.",
            $review,
            ['review_id' => $review->id, 'rating' => $review->rating, 'url' => '/dashboard?tab=analytics']
        );
    }

    public function handleUserRegistered(UserRegistered $event): void
    {
        $user = $event->user;

        // Welcome Client
        NotificationService::notify(
            $user->id,
            'user.welcome',
            'Welcome to October Glory',
            "Welcome, {$user->name}! Your account is active. Explore our custom wigs and premium salon services to reserve your first experience.",
            $user,
            ['user_id' => $user->id, 'url' => '/dashboard?tab=profile']
        );

        // Notify Admins
        NotificationService::notifyAdmins(
            'admin.user.registered',
            'New Client Joined',
            "{$user->name} ({$user->email}) just registered an account at October Glory.",
            $user,
            ['user_id' => $user->id, 'url' => '/dashboard?tab=clients']
        );
    }

    public function handleServiceCreated(ServiceCreated $event): void
    {
        $service = $event->service->loadMissing(['category', 'currentPrice']);
        $admin = $event->user;
        $adminName = $admin?->name ?? 'Admin';
        $categoryName = $service->category?->name ?? 'Uncategorized';
        $price = $service->price_by_consultation ? 'By Consultation' : '$'.number_format((float) ($service->currentPrice?->price ?? 0), 2);

        // 1. Notify Admins (system-wide)
        NotificationService::notifyAdmins(
            'admin.service.created',
            'New Service Created',
            "{$adminName} created service \"{$service->name}\" in {$categoryName} ({$price}).",
            $service,
            [
                'service_id' => $service->id,
                'slug' => $service->slug,
                'url' => '/dashboard?tab=services',
            ]
        );

        // 2. Notify Workers
        $workerIds = User::query()
            ->where('role', User::ROLE_WORKER)
            ->where('is_active', true)
            ->pluck('id')
            ->all();

        if (! empty($workerIds)) {
            NotificationService::notifyMany(
                $workerIds,
                'service.created',
                'New Service Added',
                "New service \"{$service->name}\" ({$price}) has been added to the salon menu.",
                $service,
                [
                    'service_id' => $service->id,
                    'slug' => $service->slug,
                    'url' => '/dashboard?tab=schedule',
                ]
            );
        }
    }

    public function handlePackageCreated(PackageCreated $event): void
    {
        $package = $event->package->loadMissing(['category', 'currentPrice', 'services']);
        $admin = $event->user;
        $adminName = $admin?->name ?? 'Admin';
        $servicesCount = $package->services->count();
        $price = '$'.number_format((float) ($package->currentPrice?->price ?? 0), 2);

        // 1. Notify Admins (system-wide)
        NotificationService::notifyAdmins(
            'admin.package.created',
            'New Package Created',
            "{$adminName} created package \"{$package->name}\" with {$servicesCount} services ({$price}).",
            $package,
            [
                'package_id' => $package->id,
                'slug' => $package->slug,
                'url' => '/dashboard?tab=packages',
            ]
        );

        // 2. Notify Workers
        $workerIds = User::query()
            ->where('role', User::ROLE_WORKER)
            ->where('is_active', true)
            ->pluck('id')
            ->all();

        if (! empty($workerIds)) {
            NotificationService::notifyMany(
                $workerIds,
                'package.created',
                'New Package Introduced',
                "New package \"{$package->name}\" with {$servicesCount} services ({$price}) is now available.",
                $package,
                [
                    'package_id' => $package->id,
                    'slug' => $package->slug,
                    'url' => '/dashboard?tab=schedule',
                ]
            );
        }
    }

    public function handleProductCreated(ProductCreated $event): void
    {
        $product = $event->product;
        $admin = $event->user;
        $adminName = $admin?->name ?? 'Admin';
        $price = '$'.number_format((float) ($product->price ?? 0), 2);

        // 1. Notify Admins (system-wide)
        NotificationService::notifyAdmins(
            'admin.product.created',
            'New Product Added',
            "{$adminName} added product \"{$product->name}\" to the catalog ({$price}).",
            $product,
            [
                'product_id' => $product->id,
                'slug' => $product->slug,
                'url' => '/dashboard?tab=products',
            ]
        );
    }
}
