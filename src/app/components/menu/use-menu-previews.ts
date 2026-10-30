"use client";

import { useMemo } from "react";
import { useCategories, useProducts, useServices } from "@/lib/api/hooks/catalog";
import type { Product, Service, ServiceCategory } from "@/lib/api/types";
import { PREVIEWS, type MenuPreview, type PreviewCard } from "./menu-data";

/** "200.00" -> "$200". Falls back to the raw string for non-numeric prices. */
function priceLabel(price: string): string {
  const n = parseFloat(price);
  return Number.isFinite(n) ? `$${n.toLocaleString("en-US")}` : price;
}

/** A default panel with the database's name, blurb and image laid over it. */
function overlay(
  preview: MenuPreview | undefined,
  live: { name: string; description: string | null; image: string | null }
): MenuPreview | undefined {
  if (preview?.variant !== "default") return undefined;
  return {
    ...preview,
    title: live.name,
    body: live.description ?? preview.body,
    image: live.image ?? preview.image,
  };
}

/**
 * Category cards for the Services or Packages panel. Only categories with a
 * page on the site are listed — a category the dashboard adds has nowhere to
 * link until its page is built, and Silk Press Options exists only to keep
 * the silk press services bookable off the menu.
 */
function categoryCards(categories: ServiceCategory[], kind: ServiceCategory["kind"]): PreviewCard[] {
  return categories
    .filter((category) => category.kind === kind)
    .flatMap((category) => {
      const page = PREVIEWS[category.slug];
      if (page?.variant !== "default") return [];
      return [
        {
          title: category.name,
          body: category.description ?? page.body,
          image: category.image ?? page.image,
          href: page.href,
        },
      ];
    });
}

function livePreviews(
  categories: ServiceCategory[] | undefined,
  services: Service[] | undefined,
  products: Product[] | undefined
): Record<string, MenuPreview> {
  const previews: Record<string, MenuPreview> = { ...PREVIEWS };

  if (categories && categories.length > 0) {
    for (const category of categories) {
      const live = overlay(previews[category.slug], category);
      if (live) previews[category.slug] = live;
    }

    for (const [key, kind] of [
      ["services", "services"],
      ["packages", "packages"],
    ] as const) {
      const panel = previews[key];
      const cards = categoryCards(categories, kind);
      if (panel?.variant === "cards" && cards.length > 0) previews[key] = { ...panel, cards };
    }
  }

  // Sub-service panels: only the ones the site has a page for, keyed by slug.
  for (const service of services ?? []) {
    if (!service.slug || !service.is_active) continue;
    const live = overlay(previews[service.slug], service);
    if (live) previews[service.slug] = live;
  }

  const shop = previews.shop;
  const active = (products ?? []).filter((product) => product.is_active);
  if (shop?.variant === "shop" && active.length > 0) {
    const featured = active.filter((product) => product.is_featured);
    previews.shop = {
      ...shop,
      products: (featured.length > 0 ? featured : active).slice(0, 2).map((product) => ({
        title: product.name,
        price: priceLabel(product.price),
        image: product.image ?? product.gallery[0] ?? "",
      })),
    };
  }

  return previews;
}

/**
 * The menu's preview panels, with the catalog parts — category names, blurbs
 * and images, the Services and Packages cards, sub-service panels and the
 * shop's featured products — read from the backend. The site copy in
 * `menu-data` stands in while those load (or if they fail), and for panels
 * the backend holds nothing for: home, about, lookbook, blog and contact.
 */
export function useMenuPreviews(): Record<string, MenuPreview> {
  const { data: categories } = useCategories();
  const { data: services } = useServices();
  const { data: products } = useProducts();

  return useMemo(
    () => livePreviews(categories, services, products),
    [categories, services, products]
  );
}
