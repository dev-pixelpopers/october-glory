import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailTemplate from "@/app/components/service-detail";
import { childCards, getParent, parentParams } from "@/data/services";

type Params = { service: string };

export function generateStaticParams() {
  return parentParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { service } = await params;
  const parent = getParent(service);
  if (!parent) return {};

  return {
    title: parent.meta.title,
    description: parent.meta.description,
    alternates: { canonical: `/services/${parent.slug}` },
  };
}

/** One of the five main services. */
export default async function ServiceParentPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { service } = await params;
  const parent = getParent(service);
  if (!parent) notFound();

  const children = childCards(parent.slug);

  return (
    <ServiceDetailTemplate
      service={parent}
      related={
        children.length
          ? {
              eyebrow: "Also In This Service",
              heading: `Explore ${parent.cardTitle}`,
              items: children,
            }
          : undefined
      }
    />
  );
}
