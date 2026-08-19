import { serviceParents } from "./parents";
import { serviceChildren } from "./children";
import { hasPage } from "./types";
import type {
  ServiceChild,
  ServiceChildWithPage,
  ServiceMenu,
  ServiceParent,
} from "./types";

export * from "./types";
export * from "./pricing";
export { serviceParents } from "./parents";
export { serviceChildren } from "./children";

/** Every main service, in display order. */
export const getParents = (): ServiceParent[] => serviceParents;

export const getParent = (slug: string): ServiceParent | undefined =>
  serviceParents.find((parent) => parent.slug === slug);

/**
 * Every sub-service under one main service, in the order declared — pages and
 * plain boxes alike. A sub-service can name several parents, so this matches on
 * membership rather than equality.
 */
export const getChildren = (parentSlug: string): ServiceChild[] =>
  serviceChildren.filter((child) => child.parents.includes(parentSlug));

/** The sub-services under one main service that have a page of their own. */
export const getChildPages = (parentSlug: string): ServiceChildWithPage[] =>
  getChildren(parentSlug).filter(hasPage);

export const getChild = (
  parentSlug: string,
  slug: string
): ServiceChildWithPage | undefined => {
  const child = serviceChildren.find(
    (candidate) =>
      candidate.parents.includes(parentSlug) && candidate.slug === slug
  );
  return child && hasPage(child) ? child : undefined;
};

/** `generateStaticParams` for /services/[service]. */
export const parentParams = () =>
  serviceParents.map((parent) => ({ service: parent.slug }));

/**
 * `generateStaticParams` for /services/[service]/[slug].
 *
 * Only sub-services with content get a route, and each gets exactly one: the
 * first entry in `parents` owns the URL, so a service in two categories does
 * not produce two pages competing for the same content.
 */
export const childParams = () =>
  serviceChildren
    .filter(hasPage)
    .map((child) => ({ service: child.parents[0], slug: child.slug }));

/** Canonical path for a service. A sub-service without a page books instead. */
export const servicePath = (service: ServiceParent | ServiceChild): string => {
  if (!("parents" in service)) return `/services/${service.slug}`;
  return hasPage(service)
    ? `/services/${service.parents[0]}/${service.slug}`
    : "/dashboard/book";
};

/**
 * The grid of a main service's sub-services.
 *
 * Built from `serviceChildren` rather than hand-listed on the parent, so a
 * sub-service cannot exist in the data and be missing from its parent's page.
 * Entries with a page link to it; the rest link to booking, which the grid
 * renders as "Book Now" instead of "View Service".
 */
export const childrenMenu = (parent: ServiceParent): ServiceMenu | undefined => {
  const children = getChildren(parent.slug);
  if (children.length === 0) return undefined;

  return {
    eyebrow: parent.childrenSection?.eyebrow ?? "The Menu",
    heading: parent.childrenSection?.heading ?? `Explore ${parent.cardTitle}`,
    intro: parent.childrenSection?.intro,
    items: children.map((child) => ({
      name: child.cardTitle,
      price: child.price,
      nonMemberPrice: child.nonMemberPrice,
      image: child.cardImage,
      href: hasPage(child)
        ? `/services/${child.parents[0]}/${child.slug}`
        : undefined,
    })),
  };
};

/** Cards for a child page: its siblings under the given parent. */
export const siblingCards = (parentSlug: string, slug: string) =>
  getChildren(parentSlug)
    .filter((child) => child.slug !== slug)
    .map((child) => ({
      title: child.cardTitle,
      image: child.cardImage,
      href: servicePath(child),
      price: child.price,
      nonMemberPrice: child.nonMemberPrice,
    }));
