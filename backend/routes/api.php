<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\LoyaltyController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ServiceCategoryController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ShoutoutController;
use App\Http\Controllers\Api\WorkerController;
use Illuminate\Support\Facades\Route;

/* ------------------------------- Public ---------------------------------- */

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/guest-session', [AuthController::class, 'guestSession']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/auth/resend-otp', [AuthController::class, 'resendOtp'])->middleware('throttle:5,1');
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:10,1');

Route::get('/categories', [ServiceCategoryController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/packages', [PackageController::class, 'index']);
Route::get('/workers', [WorkerController::class, 'index']);
Route::get('/availability', [AvailabilityController::class, 'index']);

/* --------------------------- Authenticated ------------------------------- */

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/set-password', [AuthController::class, 'setPassword']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::patch('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);

    Route::get('/loyalty/balance', [LoyaltyController::class, 'balance']);
    Route::get('/loyalty/transactions', [LoyaltyController::class, 'transactions']);

    Route::get('/shoutouts', [ShoutoutController::class, 'index']);
    Route::post('/shoutout-claims', [ShoutoutController::class, 'store']);

    Route::post('/reviews', [ReviewController::class, 'store']);

    /* ---------------------------- Worker ---------------------------------- */

    Route::middleware('role:worker,admin')->group(function () {
        Route::patch('/appointments/{appointment}/status', [AppointmentController::class, 'updateStatus']);
        Route::get('/worker/metrics', [ReviewController::class, 'workerMetrics']);
    });

    /* ----------------------------- Admin ---------------------------------- */

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{service}', [ServiceController::class, 'update']);
        Route::get('/services/{service}/price-history', [ServiceController::class, 'priceHistory']);

        Route::post('/categories', [ServiceCategoryController::class, 'store']);
        Route::put('/categories/{category}', [ServiceCategoryController::class, 'update']);
        Route::delete('/categories/{category}', [ServiceCategoryController::class, 'destroy']);

        Route::post('/packages', [PackageController::class, 'store']);
        Route::put('/packages/{package}', [PackageController::class, 'update']);
        Route::delete('/packages/{package}', [PackageController::class, 'destroy']);
        Route::get('/packages/{package}/price-history', [PackageController::class, 'priceHistory']);

        Route::get('/workers', [WorkerController::class, 'adminIndex']);
        Route::post('/workers', [WorkerController::class, 'store']);
        Route::put('/workers/{worker}', [WorkerController::class, 'update']);

        Route::patch('/appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule']);

        Route::get('/loyalty-settings', [LoyaltyController::class, 'settings']);
        Route::put('/loyalty-settings', [LoyaltyController::class, 'updateSettings']);
        Route::post('/loyalty/adjust', [LoyaltyController::class, 'adjust']);

        Route::get('/shoutouts', [ShoutoutController::class, 'queue']);
        Route::post('/shoutouts/{shoutout}/approve', [ShoutoutController::class, 'approve']);
        Route::post('/shoutouts/{shoutout}/reject', [ShoutoutController::class, 'reject']);

        Route::get('/audit-logs', [AuditLogController::class, 'index']);

        Route::prefix('analytics')->group(function () {
            Route::get('/revenue', [AnalyticsController::class, 'revenue']);
            Route::get('/appointment-volume', [AnalyticsController::class, 'appointmentVolume']);
            Route::get('/worker-utilization', [AnalyticsController::class, 'workerUtilization']);
            Route::get('/loyalty-economy', [AnalyticsController::class, 'loyaltyEconomy']);
        });
    });
});
