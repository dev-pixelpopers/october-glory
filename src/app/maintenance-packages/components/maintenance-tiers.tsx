"use client";

import React from "react";
import ServiceTiers from "../../components/service-detail/service-tiers";
import { usePackages } from "@/lib/api/hooks/catalog";
import type { Package } from "@/lib/api/types";
import type { ServiceDetail } from "@/data/services/types";
import { durationLabel } from "@/lib/format";
import { wigMaintenanceTiers } from "@/data/packages/wig-maintenance";

/** "200.00" -> "$200". Falls back to the raw string for non-numeric prices. */
function priceLabel(price: string): string {
  const n = parseFloat(price);
  return Number.isFinite(n) ? `$${n.toLocaleString("en-US")}` : price;
}

export function packageToTier(pkg: Package): NonNullable<ServiceDetail["tiers"]>["items"][number] {
  return {
    name: pkg.name,
    tagline: pkg.tagline ?? undefined,
    price: priceLabel(pkg.price),
    duration: durationLabel(pkg.duration_minutes),
    includes: pkg.includes ?? [],
    notIncluded: pkg.not_included ?? undefined,
    bestFor: pkg.best_for ?? undefined,
    featured: pkg.is_featured,
  };
}

/**
 * The wig-maintenance package tiers, now sourced from the backend. While the
 * request is in flight (or if it fails) the static tiers stand in, so the page
 * always renders meaningful content.
 */
export default function MaintenanceTiers() {
  const { data: packages } = usePackages("maintenance");

  const tiers: NonNullable<ServiceDetail["tiers"]> =
    packages && packages.length > 0
      ? {
          eyebrow: wigMaintenanceTiers.eyebrow,
          heading: wigMaintenanceTiers.heading,
          items: packages.map(packageToTier),
        }
      : wigMaintenanceTiers;

  return <ServiceTiers tiers={tiers} />;
}
