<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateMembershipRequest;
use App\Http\Resources\ClientResource;
use App\Models\User;
use App\Services\MembershipService;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClientController extends Controller
{
    public function __construct(protected MembershipService $membership) {}

    /** Admin: clients with membership status. ?q= searches name/email; ?members=1 filters. */
    public function index(Request $request): AnonymousResourceCollection
    {
        $clients = User::query()
            ->where('role', User::ROLE_CLIENT)
            ->with('activeMembership')
            ->withCount('appointmentsAsClient')
            ->when($request->query('q'), function ($q, $term) {
                $q->where(fn ($w) => $w->where('name', 'like', "%{$term}%")->orWhere('email', 'like', "%{$term}%"));
            })
            ->when($request->boolean('members'), fn ($q) => $q->whereHas('activeMembership'))
            ->orderBy('name')
            ->paginate(25);

        return ClientResource::collection($clients);
    }

    /** Admin: make a client a member (optionally until a date), or end their membership. */
    public function updateMembership(UpdateMembershipRequest $request, User $client): ClientResource
    {
        abort_unless($client->role === User::ROLE_CLIENT, 404);

        if ($request->boolean('is_member')) {
            $endsAt = $request->validated('ends_at');
            $this->membership->grant($client, $endsAt ? CarbonImmutable::parse($endsAt)->endOfDay() : null);
        } else {
            $this->membership->revoke($client);
        }

        return new ClientResource(
            $client->fresh()->load('activeMembership')->loadCount('appointmentsAsClient'),
        );
    }
}
