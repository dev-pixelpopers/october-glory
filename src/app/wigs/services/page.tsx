import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import UnitHero from "@/app/components/units/unit-hero";
import ClientJourney from "@/app/components/wig-services/client-journey";
import WigPackages from "@/app/components/wig-services/wig-packages";
import MembershipCta from "@/app/components/service-detail/membership-cta";
import ServiceCta from "@/app/components/service-detail/service-cta";
import WigSideTab from "@/app/components/wig-services/wig-side-tab";
import { wigServicesPage } from "@/data/wig-services";

export const metadata = {
  title: wigServicesPage.meta.title,
  description: wigServicesPage.meta.description,
  alternates: { canonical: "/wigs/services" },
};

/**
 * Wig Services — slide 07 of the handoff deck.
 *
 * The client journey, the three maintenance packages, and the services
 * bookable on their own. It sits beside /wigs rather than inside it: the
 * Units page is the unit catalogue, this is everything you book around one.
 *
 * A literal `services` segment wins over the sibling `[unit]` route, so this
 * page and /wigs/tiffany coexist without a collision.
 */
export default function WigServicesPage() {
  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />

      <WigSideTab href="/wigs" label="Explore Our Units" />

      <UnitHero
        image={wigServicesPage.hero.image}
        display={wigServicesPage.hero.display}
        script={wigServicesPage.hero.script}
      />

      <ClientJourney tone="light" />

      <WigPackages variant="packages" tone="dark" />

      <WigPackages variant="add-ons" tone="light" />

      <ServiceCta cta={wigServicesPage.cta} image={wigServicesPage.hero.image} />

      {/* The hand-off to the units side sits between the two CTAs that were
          already here — book first, then look at the work, then join.
          Everything from here down is raised above the fixed side tab, so
          reaching this point retires the tab for the rest of the page. */}
      <div className="relative z-50">
        <ServiceCta
          cta={wigServicesPage.unitsCta}
          image="/images/Tiffany.png"
          action={{ href: "/wigs", label: "See The Units" }}
          tone="light"
          elevated
        />

        <MembershipCta tone="dark" />

        <Footer />
      </div>
    </div>
  );
}
