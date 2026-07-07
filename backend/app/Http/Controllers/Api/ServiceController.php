<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Resources\PriceHistoryResource;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Services\PricingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    public function __construct(protected PricingService $pricing) {}

    /** Public catalog: active services with their live price. */
    public function index(Request $request): AnonymousResourceCollection
    {
        $services = Service::query()
            ->with(['category', 'currentPrice'])
            ->when($request->query('category_id'), fn ($q, $id) => $q->where('category_id', $id))
            ->when(! $request->user()?->isAdmin(), fn ($q) => $q->where('is_active', true))
            ->orderBy('name')
            ->get();

        return ServiceResource::collection($services);
    }

    public function store(StoreServiceRequest $request): ServiceResource
    {
        $service = DB::transaction(function () use ($request) {
            $service = Service::query()->create($request->safe()->except('price'));
            $this->pricing->setPrice($service, (string) $request->validated('price'), $request->user());

            return $service;
        });

        return new ServiceResource($service->load(['category', 'currentPrice']));
    }

    public function update(UpdateServiceRequest $request, Service $service): ServiceResource
    {
        DB::transaction(function () use ($request, $service) {
            $service->update($request->safe()->except('price'));

            if ($request->has('price')) {
                $this->pricing->setPrice($service, (string) $request->validated('price'), $request->user());
            }
        });

        return new ServiceResource($service->fresh(['category', 'currentPrice']));
    }

    /** Chronological pricing ledger for the "View Price History" modal. */
    public function priceHistory(Service $service): AnonymousResourceCollection
    {
        return PriceHistoryResource::collection(
            $service->priceHistory()->with('author')->get(),
        );
    }
}
