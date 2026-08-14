import React from "react";
import Header from "../header";
import Footer from "../footer";
import ServiceHero from "./service-hero";
import ServiceOverview from "./service-overview";
import ServiceTiers from "./service-tiers";
import ServiceNoteSection from "./service-note";
import ServiceComparisonTable from "./service-comparison";
import ServiceSiblings, { type RelatedItem } from "./service-siblings";
import ServiceCta from "./service-cta";
import type { ServiceDetail } from "@/data/services/types";

type Props = {
  service: ServiceDetail;
  /** Breadcrumb parent. Omit on a top-level service, which has none. */
  parent?: { slug: string; label: string };
  /** "Keep exploring" strip: sibling services, or child categories. */
  related?: { heading: string; eyebrow?: string; items: RelatedItem[] };
};

/**
 * One template for every service page — top-level services like Silk Press
 * and Wigs & Extensions, and the inner services under a category.
 *
 * Sections are driven entirely by which keys the service data defines, so a
 * two-section service and a six-section service share this file — there are
 * no per-service layout variants to keep in sync.
 */
export default function ServiceDetailTemplate({
  service,
  parent,
  related,
}: Props) {
  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />

      <ServiceHero service={service} parent={parent} />

      {service.overview && <ServiceOverview overview={service.overview} />}

      {service.tiers && <ServiceTiers tiers={service.tiers} />}

      {service.note && <ServiceNoteSection note={service.note} />}

      {service.comparison && (
        <ServiceComparisonTable comparison={service.comparison} />
      )}

      {related && (
        <ServiceSiblings
          items={related.items}
          heading={related.heading}
          eyebrow={related.eyebrow}
        />
      )}

      <ServiceCta cta={service.cta} image={service.hero.image} />

      <Footer />
    </div>
  );
}
