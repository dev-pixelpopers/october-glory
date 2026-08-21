import React from "react";
import Header from "../header";
import Footer from "../footer";
import ServiceHero from "./service-hero";
import ServiceSectionBlock from "./service-section";
import ServiceTiers from "./service-tiers";
import ServiceNoteSection from "./service-note";
import ServiceComparisonTable from "./service-comparison";
import ServiceFaqSection from "./service-faq";
import ServiceEbookSection from "./service-ebook";
import ServiceMenuGrid from "./service-menu";
import ServiceSiblings, { type RelatedItem } from "./service-siblings";
import ServiceCta from "./service-cta";
import { assignTones, type Block } from "./tone";
import type { ServiceDetail } from "@/data/services/types";

type Props = {
  service: ServiceDetail;
  /** Breadcrumb parent. Omit on a top-level service, which has none. */
  parent?: { slug: string; label: string };
  /** "Keep exploring" strip: sibling services, or child categories. */
  related?: { heading: string; eyebrow?: string; items: RelatedItem[] };
};

/**
 * One template for every service page — the five main services and the
 * children beneath them.
 *
 * Sections are driven entirely by which keys the service data defines, so a
 * two-section service and a nine-section service share this file.
 *
 * Because the mix varies per service, the light/dark rhythm can't live in the
 * components: a service with seven text blocks and no tiers would render seven
 * dark sections in a row. So the blocks are collected first, `assignTones`
 * alternates them, and each block is painted with the tone it was given.
 */
export default function ServiceDetailTemplate({
  service,
  parent,
  related,
}: Props) {
  // Collected in render order. `fixed` pins a block whose design only works on
  // one tone — the tier cards and comparison grid are built for light.
  const blocks: Block[] = [];

  if (service.overview) blocks.push({ key: "overview" });
  if (service.tiers) blocks.push({ key: "tiers", fixed: "light" });
  if (service.note) blocks.push({ key: "note" });
  service.sections?.forEach((section, i) =>
    blocks.push({ key: `section-${i}` })
  );
  if (service.comparison) blocks.push({ key: "comparison", fixed: "light" });
  if (service.menu) blocks.push({ key: "menu" });
  if (service.faq) blocks.push({ key: "faq" });
  // The gradient panel and white cover card are built for dark only.
  if (service.ebook) blocks.push({ key: "ebook", fixed: "dark" });
  if (related) blocks.push({ key: "related" });

  // The hero is photo-backed and reads dark, so the run starts from "dark".
  const toneOf = assignTones(blocks, "dark");

  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />

      <ServiceHero service={service} parent={parent} />

      {service.overview && (
        <ServiceSectionBlock
          section={service.overview}
          tone={toneOf("overview")}
          hairline
        />
      )}

      {service.tiers && <ServiceTiers tiers={service.tiers} />}

      {service.note && (
        <ServiceNoteSection note={service.note} tone={toneOf("note")} />
      )}

      {/* Alternating sides continue the count from `overview`, so the first
          extra section lands opposite it rather than repeating its layout. */}
      {service.sections?.map((section, i) => (
        <ServiceSectionBlock
          key={section.heading}
          section={section}
          flip={i % 2 === 0}
          tone={toneOf(`section-${i}`)}
        />
      ))}

      {service.comparison && (
        <ServiceComparisonTable comparison={service.comparison} />
      )}

      {service.menu && (
        <ServiceMenuGrid menu={service.menu} tone={toneOf("menu")} />
      )}

      {service.faq && (
        <ServiceFaqSection faq={service.faq} tone={toneOf("faq")} />
      )}

      {service.ebook && <ServiceEbookSection ebook={service.ebook} />}

      {related && (
        <ServiceSiblings
          items={related.items}
          heading={related.heading}
          eyebrow={related.eyebrow}
          tone={toneOf("related")}
        />
      )}

      <ServiceCta cta={service.cta} image={service.hero.image} />

      <Footer />
    </div>
  );
}
