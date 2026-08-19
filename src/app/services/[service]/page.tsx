import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailTemplate from "@/app/components/service-detail";
import { childrenMenu, getParent, parentParams } from "@/data/services";

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

  // The one section listing this service's children, built from the data rather
  // than hand-listed on the parent. There is no second strip below it: every
  // sub-service — page or plain box — appears here and only here.
  return <ServiceDetailTemplate service={{ ...parent, menu: childrenMenu(parent) }} />;
}
