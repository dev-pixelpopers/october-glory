<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWorkerRequest;
use App\Http\Requests\UpdateWorkerRequest;
use App\Http\Resources\WorkerResource;
use App\Models\User;
use App\Models\WorkerProfile;
use App\Services\AvailabilityService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class WorkerController extends Controller
{
    public function __construct(protected AvailabilityService $availability) {}

    /**
     * Public listing. With ?service_ids[]=… only workers qualified for
     * ALL requested services are returned (booking wizard step 2).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $serviceIds = array_map('intval', (array) $request->query('service_ids', []));

        $profiles = $serviceIds !== []
            ? $this->availability->qualifiedWorkers($serviceIds)
            : WorkerProfile::query()
                ->where('is_available', true)
                ->whereHas('user', fn ($q) => $q->where('role', User::ROLE_WORKER)->where('is_active', true))
                ->with(['user', 'schedules'])
                ->get();

        return WorkerResource::collection($this->withRatings($profiles));
    }

    /** Admin listing: every worker including inactive ones. */
    public function adminIndex(): AnonymousResourceCollection
    {
        $profiles = WorkerProfile::query()
            ->with(['user', 'schedules', 'services'])
            ->get();

        return WorkerResource::collection($this->withRatings($profiles));
    }

    public function store(StoreWorkerRequest $request): WorkerResource
    {
        $profile = DB::transaction(function () use ($request) {
            $user = User::query()->create([
                ...$request->safe()->only(['name', 'email', 'password', 'phone', 'avatar_url', 'is_active']),
                'role' => User::ROLE_WORKER,
            ]);

            $profile = $user->workerProfile()->create($request->safe()->only(['bio', 'specialties']));
            $profile->services()->sync($request->validated('service_ids', []));
            $this->syncSchedules($profile, $request->validated('schedules', []));

            return $profile;
        });

        return new WorkerResource($profile->load(['user', 'schedules', 'services']));
    }

    public function update(UpdateWorkerRequest $request, User $worker): WorkerResource
    {
        abort_unless($worker->isWorker(), 404);

        $profile = DB::transaction(function () use ($request, $worker) {
            $worker->update($request->safe()->only(['name', 'email', 'password', 'phone', 'avatar_url', 'is_active']));

            $profile = $worker->workerProfile()->firstOrCreate([]);
            $profile->update($request->safe()->only(['bio', 'specialties', 'is_available']));

            if ($request->has('service_ids')) {
                $profile->services()->sync($request->validated('service_ids'));
            }
            if ($request->has('schedules')) {
                $this->syncSchedules($profile, $request->validated('schedules'));
            }

            return $profile;
        });

        return new WorkerResource($profile->load(['user', 'schedules', 'services']));
    }

    protected function syncSchedules(WorkerProfile $profile, array $schedules): void
    {
        if ($schedules === []) {
            return;
        }

        $profile->schedules()->delete();
        foreach ($schedules as $row) {
            $profile->schedules()->create([
                'day_of_week' => $row['day_of_week'],
                'start_time' => $row['start_time'].':00',
                'end_time' => $row['end_time'].':00',
                'is_day_off' => $row['is_day_off'] ?? false,
            ]);
        }
    }

    protected function withRatings($profiles)
    {
        $ratings = DB::table('reviews')
            ->selectRaw('worker_id, AVG(rating) as rating_average, COUNT(*) as reviews_count')
            ->where('is_published', true)
            ->whereIn('worker_id', $profiles->pluck('user_id'))
            ->groupBy('worker_id')
            ->get()
            ->keyBy('worker_id');

        return $profiles->each(function ($profile) use ($ratings) {
            $row = $ratings->get($profile->user_id);
            $profile->rating_average = $row?->rating_average;
            $profile->reviews_count = $row?->reviews_count ?? 0;
        });
    }
}
