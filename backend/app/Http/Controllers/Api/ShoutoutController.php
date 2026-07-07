<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreShoutoutRequest;
use App\Http\Resources\ShoutoutClaimResource;
use App\Models\LoyaltyTransaction;
use App\Models\ShoutoutClaim;
use App\Services\LoyaltyService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ShoutoutController extends Controller
{
    public function __construct(protected LoyaltyService $loyalty) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        if (! $request->user()->hasFullSession()) {
            return ShoutoutClaimResource::collection(collect());
        }

        return ShoutoutClaimResource::collection(
            $request->user()->hasMany(ShoutoutClaim::class)->latest()->get(),
        );
    }

    public function store(StoreShoutoutRequest $request): ShoutoutClaimResource
    {
        abort_unless($request->user()->hasFullSession(), 403, 'Sign in with your password to submit a shoutout.');

        $open = ShoutoutClaim::query()
            ->where('user_id', $request->user()->id)
            ->where('status', ShoutoutClaim::STATUS_PENDING)
            ->exists();

        if ($open) {
            throw ValidationException::withMessages(['proof_image' => 'You already have a shoutout claim awaiting review.']);
        }

        // Persist the screenshot on the public disk; serve via /storage symlink.
        $path = $request->file('proof_image')->store('shoutouts', 'public');

        $claim = ShoutoutClaim::query()->create([
            'user_id' => $request->user()->id,
            'platform' => $request->validated('platform'),
            'proof_url' => url(Storage::url($path)),
        ]);

        return new ShoutoutClaimResource($claim);
    }

    /* --------------------------------- Admin --------------------------------- */

    public function queue(Request $request): AnonymousResourceCollection
    {
        return ShoutoutClaimResource::collection(
            ShoutoutClaim::query()
                ->with('user')
                ->where('status', $request->query('status', ShoutoutClaim::STATUS_PENDING))
                ->oldest()
                ->get(),
        );
    }

    /** Approving credits the admin-configured bonus straight into the ledger. */
    public function approve(Request $request, ShoutoutClaim $shoutout): ShoutoutClaimResource
    {
        $this->assertPending($shoutout);

        DB::transaction(function () use ($request, $shoutout) {
            $shoutout->update([
                'status' => ShoutoutClaim::STATUS_APPROVED,
                'admin_notes' => $request->input('admin_notes'),
                'reviewed_by' => $request->user()->id,
            ]);

            $bonus = $this->loyalty->shoutoutBonus();
            $this->loyalty->record(
                $shoutout->user,
                $bonus,
                LoyaltyTransaction::TYPE_SHOUTOUT_BONUS,
                "Social shoutout approved (+{$bonus} points)",
                $shoutout,
            );
        });

        return new ShoutoutClaimResource($shoutout->fresh('user'));
    }

    public function reject(Request $request, ShoutoutClaim $shoutout): ShoutoutClaimResource
    {
        $this->assertPending($shoutout);

        $shoutout->update([
            'status' => ShoutoutClaim::STATUS_REJECTED,
            'admin_notes' => $request->input('admin_notes'),
            'reviewed_by' => $request->user()->id,
        ]);

        return new ShoutoutClaimResource($shoutout->fresh('user'));
    }

    protected function assertPending(ShoutoutClaim $claim): void
    {
        if ($claim->status !== ShoutoutClaim::STATUS_PENDING) {
            throw ValidationException::withMessages(['status' => 'This claim has already been reviewed.']);
        }
    }
}
