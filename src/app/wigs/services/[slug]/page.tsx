import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailTemplate from "@/app/components/service-detail";
import { getChild, getChildPages, siblingCards } from "@/data/services";
import { WIGS_SLUG, wigsPage } from "@/data/wigs";

type Params = { slug: string };

export function generateStaticParams() {
  return getChildPages(WIGS_SLUG).map((child) => ({ slug: child.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const child = getChild(WIGS_SLUG, slug);
  if (!child) return {};

  return {
    title: child.meta.title,
    description: child.meta.description,
    alternates: { canonical: `/wigs/services/${slug}` },
  };
}

/**
 * A sub-service of Wigs — wig prep and wig wash.
 *
 * These sat at /old-wig/<slug> while the wig section was being rebuilt. They
 * could not simply move to /wigs/<slug>, because the sibling `[unit]` route
 * owns that segment and would answer first with a 404. /wigs/services is the
 * honest home for them: they are the services you book around a unit, which
 * is exactly what that page lists.
 *
 * `parentRoot("wigs")` in src/data/services/index.ts is what points every
 * derived link — the menu previews, the child grid, sibling cards — here, so
 * this route and that one constant have to agree.
 */
export default async function WigServiceChildPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const child = getChild(WIGS_SLUG, slug);
  if (!child) notFound();

  const siblings = siblingCards(WIGS_SLUG, slug);

  return (
    <ServiceDetailTemplate
      service={child}
      // Home is prepended by the breadcrumb itself, so these are the second
      // and third crumbs: Home › Wigs › Wig Services › this page.
      root={{ href: "/wigs", label: "Wigs" }}
      parent={{ href: "/wigs/services", label: "Wig Services" }}
      related={
        siblings.length
          ? {
              eyebrow: "Keep Exploring",
              heading: `More In ${wigsPage.cardTitle}`,
              items: siblings,
            }
          : undefined
      }
    />
  );
}
