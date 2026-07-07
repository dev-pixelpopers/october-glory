<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Appointment;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    /** Clients may review only their own completed, un-reviewed appointments. */
    public function store(StoreReviewRequest $request): ReviewResource
    {
        $appointment = Appointment::query()->findOrFail($request->validated('appointment_id'));

        abort_unless($appointment->client_id === $request->user()->id, 403);
        abort_unless($request->user()->hasFullSession(), 403, 'Sign in with your password to leave a review.');

        if ($appointment->status !== Appointment::STATUS_COMPLETED) {
            throw ValidationException::withMessages(['appointment_id' => 'Only completed appointments can be reviewed.']);
        }

        $review = Review::query()->create([
            'appointment_id' => $appointment->id,
            'client_id' => $request->user()->id,
            'worker_id' => $appointment->worker_id,
            'rating' => $request->validated('rating'),
            'comment' => $request->validated('comment'),
        ]);

        return new ReviewResource($review->load('client'));
    }

    /** Signed-in worker's aggregate rating and client feedback list. */
    public function workerMetrics(Request $request): JsonResponse
    {
        $workerId = $request->user()->id;

        $reviews = Review::query()
            ->with('client')
            ->where('worker_id', $workerId)
            ->where('is_published', true)
            ->latest()
            ->get();

        return response()->json([
            'rating_average' => $reviews->count() > 0 ? round($reviews->avg('rating'), 2) : null,
            'reviews_count' => $reviews->count(),
            'reviews' => ReviewResource::collection($reviews),
        ]);
    }
}
