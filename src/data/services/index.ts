import { naturalStyles } from "./natural-styles";
import type { ServiceCategory, ServiceDetail } from "./types";

export * from "./types";

/**
 * Every category that has inner service pages. Adding a new category (e.g.
 * treatments) is two steps: write its data file, then add it here — the
 * route file and the detail template need no changes.
 */
export const serviceCategories: ServiceCategory[] = [naturalStyles];

export function getCategory(categorySlug: string): ServiceCategory | undefined {
  return serviceCategories.find((c) => c.slug === categorySlug);
}

export function getService(
  categorySlug: string,
  serviceSlug: string
): ServiceDetail | undefined {
  return getCategory(categorySlug)?.services.find((s) => s.slug === serviceSlug);
}

/** Slugs for `generateStaticParams` on a category's `[slug]` route. */
export function getServiceSlugs(categorySlug: string): { slug: string }[] {
  return (
    getCategory(categorySlug)?.services.map((s) => ({ slug: s.slug })) ?? []
  );
}

/**
 * The other services in the same category, used for the "explore more"
 * strip at the bottom of a detail page.
 */
export function getSiblingServices(
  categorySlug: string,
  serviceSlug: string
): ServiceDetail[] {
  return (
    getCategory(categorySlug)?.services.filter((s) => s.slug !== serviceSlug) ??
    []
  );
}

export { naturalStyles };
