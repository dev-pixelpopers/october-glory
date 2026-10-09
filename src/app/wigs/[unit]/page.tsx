import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import UnitHero from "@/app/components/units/unit-hero";
import UnitStorySection from "@/app/components/units/unit-story";
import UnitGallery from "@/app/components/units/unit-gallery";
import WigSideTab from "@/app/components/wig-services/wig-side-tab";
import MembershipCta from "@/app/components/service-detail/membership-cta";
import ServiceCta from "@/app/components/service-detail/service-cta";
import { getUnit, units, unitSpecLine, unitsPage } from "@/data/units";

/** The page carries no prices, so the default membership line does not fit. */
const MEMBER_BODY =
  "Members book every October Glory service at the member price, with priority booking, member-only treatments, and loyalty points on everything — including the consultation that starts a custom unit.";

type Params = { unit: string };

export function generateStaticParams() {
  return units.map((unit) => ({ unit: unit.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { unit: slug } = await params;
  const unit = getUnit(slug);
  if (!unit) return {};

  return {
    title: `${unit.name} Unit | October Glory`,
    description: `The ${unit.name} unit — ${unitSpecLine(unit)}. A custom luxury unit designed, built and installed at October Glory in Brooklyn.`,
    alternates: { canonical: `/wigs/${unit.slug}` },
  };
}

/** One client's unit, as a case study. */
export default async function UnitPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { unit: slug } = await params;
  const unit = getUnit(slug);
  if (!unit) notFound();

  const siblings = units.filter((other) => other.slug !== unit.slug);

  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />

      <WigSideTab href="/dashboard/book" label="Book Your Unit" />

      <UnitHero
        image={unit.portrait}
        display={unit.name}
        script="Unit"
        eyebrow={unitSpecLine(unit)}
        back={{ href: "/wigs", label: "All Units" }}
      />

      <UnitStorySection unit={unit} tone="light" />

      <UnitGallery
        tone="dark"
        items={siblings}
        heading={{
          eyebrow: "Keep Looking",
          heading: "Other",
          headingAccent: "Units",
        }}
      />

      <ServiceCta cta={unitsPage.cta} image={unit.portrait} />

      <div className="relative z-50">
        <ServiceCta
          cta={unitsPage.servicesCta}
          image={unit.portrait}
          action={{ href: "/wigs/services", label: "Explore Wig Services" }}
          tone="light"
          elevated
        />

        <MembershipCta tone="dark" body={MEMBER_BODY} />

        <Footer />
      </div>
    </div>
  );
}
