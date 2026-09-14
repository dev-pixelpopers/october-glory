import Header from "../components/header";
import Footer from "../components/footer";
import WelcomeSection from "../components/about-section";
import InstagramSection from "../components/instagram-section";
import ServiceHero from "../components/service-detail/service-hero";
import ServiceProcessSection from "../components/service-detail/service-process";
import ServiceBeforeAfterSection from "../components/service-detail/service-before-after";
import ServiceMenuGrid from "../components/service-detail/service-menu";
import ServiceShopPreview from "../components/service-detail/service-shop-preview";
import ServiceComparisonTable from "../components/service-detail/service-comparison";
import ServiceEbookSection from "../components/service-detail/service-ebook";
import ServiceFaqSection from "../components/service-detail/service-faq";
import ServiceCta from "../components/service-detail/service-cta";
import MembershipCta from "../components/service-detail/membership-cta";
import { childrenMenu } from "@/data/services";
import { serviceBeforeAfter, serviceProcess } from "@/data/services/defaults";
import { wigsPage } from "@/data/wigs";

export const metadata = {
  title: wigsPage.meta.title,
  description: wigsPage.meta.description,
  alternates: { canonical: "/wigs" },
};

/**
 * The Wigs page. It reads like a service page and reuses the same section
 * components, but it is a destination in its own right rather than one of the
 * main services, so it is composed here instead of going through
 * `ServiceDetailTemplate`.
 *
 * Three sections live only on this page — the sticky welcome video, the unit
 * shop strip, and the Instagram reel — which is why the template no longer
 * carries branches for them.
 *
 * The light/dark tones are pinned rather than alternated. The template's
 * `assignTones` walks a variable block list; this page's sections are fixed,
 * and these are the tones that walk produces for them.
 */
export default function WigsPage() {
  // The sub-services listed on this page, built from `children.ts` the same way
  // a service builds its own grid — so a wig service cannot be in the data and
  // missing from the page.
  const menu = childrenMenu(wigsPage);

  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />

      {/* No breadcrumb and no intro paragraph: the hero is the wordmark over
          the photograph, the way the home page hero reads. */}
      <ServiceHero service={wigsPage} showCrumbs={false} showIntro={false} />

      <WelcomeSection video={wigsPage.welcomeVideo} section={wigsPage.overview} />

      <ServiceProcessSection process={serviceProcess(wigsPage)} tone="light" />

      {menu && <ServiceMenuGrid menu={menu} tone="dark" />}

      <ServiceShopPreview items={wigsPage.shopProducts} />

      {wigsPage.instagram && <InstagramSection content={wigsPage.instagram} />}

      {wigsPage.comparison && (
        <ServiceComparisonTable comparison={wigsPage.comparison} />
      )}

      {wigsPage.ebook && <ServiceEbookSection ebook={wigsPage.ebook} />}

      {wigsPage.faq && <ServiceFaqSection faq={wigsPage.faq} tone="light" />}

      <ServiceBeforeAfterSection
        beforeAfter={serviceBeforeAfter(wigsPage)}
        tone="dark"
      />

      <MembershipCta tone="light" />

      <ServiceCta cta={wigsPage.cta} image={wigsPage.hero.image} />

      <Footer />
    </div>
  );
}
