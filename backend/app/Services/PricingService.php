<?php

namespace App\Services;

use App\Models\Package;
use App\Models\PackagePriceHistory;
use App\Models\Service;
use App\Models\ServicePriceHistory;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Prices are never overwritten: every change closes the active
 * service_price_history row and opens a new one, preserving a full
 * chronological ledger of rate adjustments.
 */
class PricingService
{
    public function setPrice(Service $service, string $price, ?User $author = null): ServicePriceHistory
    {
        return DB::transaction(function () use ($service, $price, $author) {
            $now = now();

            $current = $service->currentPrice()->lockForUpdate()->first();

            // No-op if the price hasn't actually changed.
            if ($current && bccomp((string) $current->price, $price, 2) === 0) {
                return $current;
            }

            $current?->update(['effective_until' => $now]);

            return ServicePriceHistory::query()->create([
                'service_id' => $service->id,
                'price' => $price,
                'effective_from' => $now,
                'effective_until' => null,
                'created_by' => $author?->id,
            ]);
        });
    }

    public function currentPrice(Service $service): ?string
    {
        return $service->currentPrice()->value('price');
    }

    /**
     * Set a package's price. Like service pricing, package prices are never
     * overwritten: each change closes the active package_price_history row and
     * opens a new one, keeping a full ledger of the salon's package pricing.
     */
    public function setPackagePrice(Package $package, string $price, ?User $author = null): PackagePriceHistory
    {
        return DB::transaction(function () use ($package, $price, $author) {
            $now = now();

            $current = $package->currentPrice()->lockForUpdate()->first();

            // No-op if the price hasn't actually changed.
            if ($current && bccomp((string) $current->price, $price, 2) === 0) {
                return $current;
            }

            $current?->update(['effective_until' => $now]);

            return PackagePriceHistory::query()->create([
                'package_id' => $package->id,
                'price' => $price,
                'effective_from' => $now,
                'effective_until' => null,
                'created_by' => $author?->id,
            ]);
        });
    }
}
