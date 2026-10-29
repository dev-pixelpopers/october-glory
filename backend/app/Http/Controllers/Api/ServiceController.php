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
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function __construct(protected PricingService $pricing) {}

    /**
     * Public catalog: active services with their live price, in the order the
     * site lists them. ?category=<slug> returns one page's services — the slug
     * is the site's /services/<slug> URL — and ?category_id= still works.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $services = Service::query()
            ->with(['category', 'currentPrice'])
            ->when($request->query('category_id'), fn ($q, $id) => $q->where('category_id', $id))
            ->when($request->query('category'), fn ($q, $slug) => $q->whereHas('category', fn ($c) => $c->where('slug', $slug)))
            ->when(! $request->user()?->isAdmin(), fn ($q) => $q->where('is_active', true))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return ServiceResource::collection($services);
    }

    public function store(StoreServiceRequest $request): ServiceResource
    {
        $service = DB::transaction(function () use ($request) {
            $service = Service::query()->create([
                ...$request->safe()->except('price'),
                'slug' => $this->uniqueSlug($request->validated('name')),
            ]);
            $price = $service->price_by_consultation ? '0.00' : (string) $request->validated('price');
            $this->pricing->setPrice($service, $price, $request->user());

            return $service;
        });

        return new ServiceResource($service->load(['category', 'currentPrice']));
    }

    public function update(UpdateServiceRequest $request, Service $service): ServiceResource
    {
        DB::transaction(function () use ($request, $service) {
            $service->update($request->safe()->except('price'));

            // Consultation pricing pins the ledger at 0.00; otherwise apply a sent price.
            if ($service->price_by_consultation) {
                $this->pricing->setPrice($service, '0.00', $request->user());
            } elseif ($request->filled('price')) {
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

    /** Slugs are set once and kept on rename, since site pages link by them. */
    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'service';
        $slug = $base;
        $i = 2;
        while (Service::query()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
