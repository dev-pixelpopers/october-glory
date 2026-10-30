import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import UnitHero from "@/app/components/units/unit-hero";
import ProcessFlow from "@/app/components/process/process-flow";
import Transformation from "@/app/components/silk-press/transformation";
import PressPackages from "@/app/components/silk-press/press-packages";
import ServiceSectionBlock from "@/app/components/service-detail/service-section";
import ServiceMenuGrid from "@/app/components/service-detail/service-menu";
import ServiceEbookSection from "@/app/components/service-detail/service-ebook";
import ServiceCta from "@/app/components/service-detail/service-cta";
import MembershipCta from "@/app/components/service-detail/membership-cta";
import { getChildren, hasPage, servicePath } from "@/data/services";
import { silkPressPage } from "@/data/silk-press-new";

export const metadata = {
  title: silkPressPage.meta.title,
  description: silkPressPage.meta.description,
  alternates: { canonical: "/services/silk-press" },
};

/**
 * The Silk Press showcase — the second premier-service page, beside
 * October Glory Units.
 *
 * Structurally the Units page: hero, then the scroll-led process section
 * carrying the video and its four stages, then the rest of the client's
 * order — the before and after, the finished look, what makes ours ours, and
 * the three ways to book it. The packages are the part the units side has no
 * equivalent of, so they close the page before the CTAs.
 *
 * The service page this replaced is parked at /old-silk-press. This page
 * reads none of it except the natural-style children, which are listed rather
 * than absorbed — they are not silk press variants and the page says so.
 *
 * Tones are pinned rather than walked: the section list here is fixed, so
 * there is nothing for `assignTones` to resolve.
 */
export default function SilkPressPage() {
  // The styles parented to Silk Press in the service data. Their own pages
  // still live at /services/silk-press/<slug>.
  const styles = getChildren("silk-press");

  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />

      <UnitHero
        image={silkPressPage.hero.image}
        display={silkPressPage.hero.display}
        script={silkPressPage.hero.script}
        eyebrow={silkPressPage.hero.intro}
        scale="display"
      />

        {/* What a silk press is, and what makes ours ours. The four principles
          ride in as bullets so they sit with the explanation rather than
          becoming a separate numbered row competing with the four stages. */}
      <ServiceSectionBlock
        tone="light"
        flip
        hairline
        section={{
          eyebrow: silkPressPage.why.eyebrow,
          heading: silkPressPage.why.heading,
          headingAccent: silkPressPage.why.headingAccent,
          body: silkPressPage.why.body,
          bullets: silkPressPage.pillars.map(
            (pillar) => `${pillar.title} — ${pillar.body}`
          ),
          image: silkPressPage.why.image,
        }}
      />

      {/* The same scroll-led process section the Units page uses: the clip
          is the clock, each stage lights up as the playhead reaches it, and
          scrolling moves through it in either direction. */}
      <ProcessFlow flow={silkPressPage.install} tone="dark" />

      <Transformation tone="light" />

      {/* The finished look: copy left, the short clip right. */}
      <ServiceSectionBlock
        tone="dark"
        section={{
          eyebrow: silkPressPage.finish.eyebrow,
          heading: silkPressPage.finish.heading,
          headingAccent: silkPressPage.finish.headingAccent,
          body: silkPressPage.finish.body,
          video: silkPressPage.finish.video,
          image: silkPressPage.finish.image,
        }}
      />

    <PressPackages tone="light" />

    

      {styles.length > 0 && (
        <ServiceMenuGrid
          tone="dark"
          menu={{
            eyebrow: silkPressPage.styles.eyebrow,
            heading: `${silkPressPage.styles.heading} ${silkPressPage.styles.headingAccent}`,
            intro: silkPressPage.styles.intro,
            // The same Silk Press category the old service page loaded.
            category: "silk-press",
            items: styles.map((style) => ({
              slug: style.slug,
              name: style.cardTitle,
              price: style.price,
              memberPrice: style.memberPrice,
              image: style.cardImage,
              href: hasPage(style) ? servicePath(style) : undefined,
            })),
          }}
        />
      )}  

      <ServiceEbookSection ebook={silkPressPage.ebook} tone="light" />

      <ServiceCta cta={silkPressPage.cta} image={silkPressPage.hero.image} />

      <MembershipCta tone="dark" />

      <Footer />
    </div>
  );
}
