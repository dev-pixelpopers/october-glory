<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AvailabilityRequest;
use App\Services\AvailabilityService;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;

class AvailabilityController extends Controller
{
    public function __construct(protected AvailabilityService $availability) {}

    public function index(AvailabilityRequest $request): JsonResponse
    {
        $serviceIds = array_map('intval', $request->validated('service_ids', []));
        if (empty($serviceIds) && $request->filled('package_id')) {
            $package = \App\Models\Package::with('services')->findOrFail((int) $request->validated('package_id'));
            $serviceIds = $package->services->pluck('id')->all();
        }

        $slots = $this->availability->slots(
            CarbonImmutable::parse($request->validated('date'), config('app.timezone'))->startOfDay(),
            $serviceIds,
            $request->validated('worker_id') !== null ? (int) $request->validated('worker_id') : null,
        );

        return response()->json(['data' => $slots]);
    }
}
