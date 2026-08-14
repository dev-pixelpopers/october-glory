import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServiceDetailTemplate from "@/app/components/service-detail";
import {
  getService,
  getServiceSlugs,
  getSiblingServices,
  naturalStyles,
} from "@/data/services";

const CATEGORY = naturalStyles.slug;

export function generateStaticParams() {
  return getServiceSlugs(CATEGORY);
}

export async function generateMetadata({
  params,
}: PageProps<"/natural-styles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(CATEGORY, slug);

  if (!service) return {};

  return {
    title: service.meta.title,
    description: service.meta.description,
    alternates: { canonical: `/${CATEGORY}/${service.slug}` },
  };
}

export default async function NaturalStyleServicePage({
  params,
}: PageProps<"/natural-styles/[slug]">) {
  const { slug } = await params;
  const service = getService(CATEGORY, slug);

  if (!service) notFound();

  return (
    <ServiceDetailTemplate
      service={service}
      parent={{ slug: CATEGORY, label: naturalStyles.label }}
      related={{
        heading: `More ${naturalStyles.label}`,
        items: getSiblingServices(CATEGORY, slug).map((sibling) => ({
          title: sibling.cardTitle,
          image: sibling.hero.image,
          href: `/${CATEGORY}/${sibling.slug}`,
          price: sibling.price,
        })),
      }}
    />
  );
}
