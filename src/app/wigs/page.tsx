import type { Metadata } from "next";
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
import { units, unitsPage, type UnitStory } from "@/data/units";
import { wigsPage } from "@/data/wigs";
import type { Product } from "@/lib/api/types";

export type { Product };

/** The page carries no prices, so the default membership line does not fit. */
const MEMBER_BODY =
  "Members book every October Glory service at the member price, with priority booking, member-only treatments, and loyalty points on everything — including the consultation that starts a custom unit.";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api").replace(
  "//localhost:",
  "//127.0.0.1:",
);

export const metadata: Metadata = {
  title: unitsPage.meta.title,
  description: unitsPage.meta.description,
  alternates: { canonical: "/wigs" },
};

function mapStaticUnitToProduct(u: UnitStory): Product {
  return {
    id: 0,
    name: u.name,
    slug: u.slug,
    description: [u.spec?.length, u.spec?.texture, u.spec?.color].filter(Boolean).join(" · ") || null,
    price: "0.00",
    image: u.portrait,
    gallery: [],
    background_image: u.portrait,
    video: u.video,
    category: "Wigs",
    tags: [],
    is_featured: false,
    is_active: true,
    sort_order: 0,
    length: u.spec?.length ?? null,
    texture: u.spec?.texture ?? null,
    color: u.spec?.color ?? null,
    what_she_wanted: u.brief ?? null,
    what_we_built: u.build ?? null,
    how_she_wears_it: u.reaction ?? null,
    the_install: [],
  };
}

/**
 * Fetch active wig products dynamically from the Laravel Products API.
 */
async function fetchWigProducts(): Promise<{ products: Product[]; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return {
        products: units.map(mapStaticUnitToProduct),
        error: null,
      };
    }

    const json = await res.json();

    // Safely extract products array from direct array, single wrapping (json.data), or paginated wrapping (json.data.data)
    const rawData = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.data?.data)
      ? json.data.data
      : [];

    if (rawData.length === 0) {
      return { products: units.map(mapStaticUnitToProduct), error: null };
    }

    return { products: rawData, error: null };
  } catch {
    return {
      products: units.map(mapStaticUnitToProduct),
      error: null,
    };
  }
}

/**
 * October Glory Units listing page.
 *
 * Dynamically fetches custom units from the backend API, rendering the
 * interactive video catalog, poster, process flow, sub-services, and CTAs.
 */
export default async function UnitsPage() {
  const { products, error } = await fetchWigProducts();
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

      <UnitCatalog products={products} error={error} tone="light" />

      {menu && <ServiceMenuGrid menu={menu} tone="dark" />}

      {/* Book first, while the catalogue is still in view. */}
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
