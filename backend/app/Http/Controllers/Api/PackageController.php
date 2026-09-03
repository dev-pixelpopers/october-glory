<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Http\Resources\PackagePriceHistoryResource;
use App\Http\Resources\PackageResource;
use App\Models\Package;
use App\Models\Service;
use App\Services\PricingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PackageController extends Controller
{
    public function __construct(protected PricingService $pricing) {}

    /** Public catalog: active packages with their services and set price. */
    public function index(Request $request): AnonymousResourceCollection
    {
        $packages = Package::query()
            ->with(['category', 'currentPrice', 'services' => fn ($q) => $q->with('currentPrice')])
            ->when($request->query('collection'), fn ($q, $c) => $q->where('collection', $c))
            ->when(! $request->user()?->isAdmin(), fn ($q) => $q->where('is_active', true))
            ->orderBy('name')
            ->get();

        return PackageResource::collection($packages);
    }

    public function store(StorePackageRequest $request): PackageResource
    {
        $package = DB::transaction(function () use ($request) {
            $package = Package::query()->create([
                ...$request->safe()->except(['price', 'service_ids']),
                'slug' => $this->uniqueSlug($request->validated('name')),
            ]);

            $this->syncServices($package, $request->validated('service_ids'));

            // Default to the summed price of the chosen services when unspecified.
            $price = $request->validated('price') ?? $this->servicesTotal($request->validated('service_ids'));
            $this->pricing->setPackagePrice($package, (string) $price, $request->user());

            return $package;
        });

        return new PackageResource($this->loaded($package));
    }

    public function update(UpdatePackageRequest $request, Package $package): PackageResource
    {
        DB::transaction(function () use ($request, $package) {
            $package->update($request->safe()->except(['price', 'service_ids']));

            if ($request->has('service_ids')) {
                $this->syncServices($package, $request->validated('service_ids'));
            }

            if ($request->has('price') && $request->validated('price') !== null) {
                $this->pricing->setPackagePrice($package, (string) $request->validated('price'), $request->user());
            }
        });

        return new PackageResource($this->loaded($package->fresh()));
    }

    /** Deactivate rather than hard-delete, preserving the ledger and audit trail. */
    public function destroy(Package $package): PackageResource
    {
        $package->update(['is_active' => false]);

        return new PackageResource($this->loaded($package->fresh()));
    }

    /** Chronological pricing ledger for the "View Price History" modal. */
    public function priceHistory(Package $package): AnonymousResourceCollection
    {
        return PackagePriceHistoryResource::collection(
            $package->priceHistory()->with('author')->get(),
        );
    }

    /* ------------------------------ helpers ------------------------------ */

    private function syncServices(Package $package, array $serviceIds): void
    {
        $pivot = [];
        foreach (array_values($serviceIds) as $position => $id) {
            $pivot[$id] = ['position' => $position];
        }

        $package->services()->sync($pivot);
    }

    private function servicesTotal(array $serviceIds): string
    {
        $services = Service::query()->with('currentPrice')->findMany($serviceIds);

        return (string) $services->reduce(
            fn ($carry, Service $s) => bcadd($carry, (string) ($s->currentPrice?->price ?? '0'), 2),
            '0',
        );
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 2;
        while (Package::query()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    private function loaded(Package $package): Package
    {
        return $package->load(['category', 'currentPrice', 'services' => fn ($q) => $q->with('currentPrice')]);
    }
}
