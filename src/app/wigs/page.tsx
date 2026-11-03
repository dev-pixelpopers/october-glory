import Header from "../components/header";
import Footer from "../components/footer";
import UnitHero from "../components/units/unit-hero";
import UnitPoster from "../components/units/unit-poster";
import ProcessFlow from "../components/process/process-flow";
import UnitCatalog from "../components/units/unit-catalog";
import ServiceMenuGrid from "../components/service-detail/service-menu";
import WigSideTab from "../components/wig-services/wig-side-tab";
import MembershipCta from "../components/service-detail/membership-cta";
import ServiceCta from "../components/service-detail/service-cta";
import { childrenMenu } from "@/data/services";
import { unitsPage } from "@/data/units";
import { wigsPage } from "@/data/wigs";

/** The page carries no prices, so the default membership line does not fit. */
const MEMBER_BODY =
  "Members book every October Glory service at the member price, with priority booking, member-only treatments, and loyalty points on everything — including the consultation that starts a custom unit.";

export const metadata = {
  title: unitsPage.meta.title,
  description: unitsPage.meta.description,
  alternates: { canonical: "/wigs" },
};

/**
 * October Glory Units.
 *
 * The wig section of the site, built from the handoff deck: the poster the
 * client asked for, the installation flow with its start-to-finish video, and
 * the ten units as a catalogue ordered by length, where each portrait is also
 * that unit's video and opens the client's own page.
 *
 * The catalog replaced a plain photo grid here: it carries everything the
 * grid did plus the spec and the video, and two listings of the same ten
 * units on one page was duplication. The grid still runs on a unit's own
 * page, as the strip of the other nine.
 *
 * Tones are pinned rather than walked — the section list here is fixed, so
 * there is nothing for `assignTones` to resolve.
 */
export default function UnitsPage() {
  // The three sub-services parented to Wigs. They were listed on the page
  // this one replaced and had nowhere to surface after it went; the grid is
  // the same one every main service page uses. Wig Design & Consult opens
  // its own page, the other two have no page and so link to booking, which
  // the grid labels "Book Now" rather than "View Service".
  const menu = childrenMenu(wigsPage);

  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />

      <WigSideTab href="/wigs/services" label="Explore Our Wig Services" />

      <UnitHero
        image={unitsPage.hero.image}
        display={unitsPage.hero.display}
        script={unitsPage.hero.script}
        scale="display"
        trail={[{ label: "Wigs" }]}
      />

      <UnitPoster tone="light" />

      <ProcessFlow flow={unitsPage.install} tone="dark" />

      <UnitCatalog tone="light" />

      {menu && <ServiceMenuGrid menu={menu} tone="dark" />}

      {/* Book first, while the catalogue is still in view. The hand-off to
          the services side sits between the two CTAs that were already here,
          in the light tone so three closing panels don't read as one slab,
          and membership closes the page.

          Everything from the hand-off down is raised above the fixed side
          tab, so reaching it retires the tab for the rest of the page. */}
      <ServiceCta cta={unitsPage.cta} image={unitsPage.hero.image} />

      <div className="relative z-50">
        <ServiceCta
          cta={unitsPage.servicesCta}
          image="/images/Weaves-And-Extensions-04.webp"
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
