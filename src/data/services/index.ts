import { serviceParents } from "./parents";
import { serviceChildren } from "./children";
import type { ServiceChild, ServiceParent } from "./types";

export * from "./types";
export { serviceParents } from "./parents";
export { serviceChildren } from "./children";

/** Every main service, in display order. */
export const getParents = (): ServiceParent[] => serviceParents;

export const getParent = (slug: string): ServiceParent | undefined =>
  serviceParents.find((parent) => parent.slug === slug);

/** The children belonging to one main service, in the order declared. */
export const getChildren = (parentSlug: string): ServiceChild[] =>
  serviceChildren.filter((child) => child.parent === parentSlug);

export const getChild = (
  parentSlug: string,
  slug: string
): ServiceChild | undefined =>
  serviceChildren.find(
    (child) => child.parent === parentSlug && child.slug === slug
  );

/** `generateStaticParams` for /services/[service]. */
export const parentParams = () =>
  serviceParents.map((parent) => ({ service: parent.slug }));

/** `generateStaticParams` for /services/[service]/[slug]. */
export const childParams = () =>
  serviceChildren.map((child) => ({ service: child.parent, slug: child.slug }));

/** Canonical path for a service, parent or child. */
export const servicePath = (service: ServiceParent | ServiceChild): string =>
  "parent" in service
    ? `/services/${service.parent}/${service.slug}`
    : `/services/${service.slug}`;

/** Cards for a "keep exploring" strip: the children of a main service. */
export const childCards = (parentSlug: string) =>
  getChildren(parentSlug).map((child) => ({
    title: child.cardTitle,
    image: child.cardImage,
    href: servicePath(child),
  }));

/** Cards for a child page: its siblings, plus nothing else. */
export const siblingCards = (parentSlug: string, slug: string) =>
  getChildren(parentSlug)
    .filter((child) => child.slug !== slug)
    .map((child) => ({
      title: child.cardTitle,
      image: child.cardImage,
      href: servicePath(child),
    }));
