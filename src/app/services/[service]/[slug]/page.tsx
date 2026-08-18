import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailTemplate from "@/app/components/service-detail";
import { childParams, getChild, getParent, siblingCards } from "@/data/services";

type Params = { service: string; slug: string };

export function generateStaticParams() {
  return childParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { service, slug } = await params;
  const child = getChild(service, slug);
  if (!child) return {};

  return {
    title: child.meta.title,
    description: child.meta.description,
    alternates: { canonical: `/services/${service}/${slug}` },
  };
}

/** A service nested under one of the five main services. */
export default async function ServiceChildPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { service, slug } = await params;
  const child = getChild(service, slug);
  const parent = getParent(service);
  if (!child || !parent) notFound();

  const siblings = siblingCards(service, slug);

  return (
    <ServiceDetailTemplate
      service={child}
      parent={{ slug: parent.slug, label: parent.cardTitle }}
      related={
        siblings.length
          ? {
              eyebrow: "Keep Exploring",
              heading: `More In ${parent.cardTitle}`,
              items: siblings,
            }
          : undefined
      }
    />
  );
}
