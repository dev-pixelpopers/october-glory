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
    alternates: { canonical: `/wigs/${slug}` },
  };
}

/**
 * A sub-service listed on the Wigs page. Same template as a service's child
 * pages — only the breadcrumb differs, because Wigs sits beside /services
 * rather than inside it.
 */
export default async function WigsChildPage({
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
      root={{ href: "/", label: "Home" }}
      parent={{ href: "/wigs", label: wigsPage.cardTitle }}
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
