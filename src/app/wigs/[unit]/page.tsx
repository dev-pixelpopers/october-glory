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
import { getUnit, units, unitsPage, type UnitStory } from "@/data/units";
import type { Product } from "@/lib/api/types";

/** The page carries no prices, so the default membership line does not fit. */
const MEMBER_BODY =
  "Members book every October Glory service at the member price, with priority booking, member-only treatments, and loyalty points on everything — including the consultation that starts a custom unit.";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

type Params = { unit: string };

function formatProductSpec(product: Product): string {
  return [product.length, product.texture, product.color].filter(Boolean).join(" · ");
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    if (res.status === 404) return null;
    if (!res.ok) return null;

    const json = await res.json();
    return (json?.data as Product) ?? null;
  } catch {
    return null;
  }
}

async function fetchSiblings(currentSlug: string): Promise<Array<Product | UnitStory>> {
  try {
    const res = await fetch(`${API_BASE}/products?category=Wigs`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return (json.data as Product[]).filter((p) => p.slug !== currentSlug);
      }
    }
  } catch {
    // fallback to static units
  }
  return units.filter((other) => other.slug !== currentSlug);
}

async function getProduct(slug: string): Promise<Product | null> {
  const apiProduct = await fetchProductBySlug(slug);
  if (apiProduct) return apiProduct;

  // Fallback to static unit data if the API server is unreachable during build
  const staticUnit = getUnit(slug);
  if (!staticUnit) return null;

  return {
    id: 0,
    name: staticUnit.name,
    slug: staticUnit.slug,
    category: "Wigs",
    description: staticUnit.brief,
    image: staticUnit.portrait,
    gallery: [staticUnit.portrait],
    background_image: staticUnit.portrait,
    price: "0.00",
    tags: [staticUnit.spec.texture.toLowerCase()],
    length: staticUnit.spec.length,
    texture: staticUnit.spec.texture,
    color: staticUnit.spec.color,
    what_she_wanted: staticUnit.brief,
    what_we_built: staticUnit.build,
    how_she_wears_it: staticUnit.reaction,
    video: staticUnit.video ?? null,
    the_install: staticUnit.journey
      ? [
          { image: staticUnit.journey.before, tag: "Before" },
          { image: staticUnit.journey.mid, tag: "Braided down" },
          { image: staticUnit.journey.after, tag: "After" },
        ]
      : [],
    is_featured: false,
    is_active: true,
    sort_order: 0,
  };
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/products?category=Wigs`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((p: Product) => ({ unit: p.slug }));
      }
    }
  } catch {
    // fallback
  }
  return units.map((unit) => ({ unit: unit.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { unit: slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const spec = formatProductSpec(product);

  return {
    title: `${product.name} Unit | October Glory`,
    description: `The ${product.name} unit${spec ? ` — ${spec}` : ""}. A custom luxury unit designed, built and installed at October Glory in Brooklyn.`,
    alternates: { canonical: `/wigs/${product.slug}` },
  };
}

/** One client's unit, dynamically fetched from the Laravel API. */
export default async function UnitPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { unit: slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const siblings = await fetchSiblings(product.slug);
  const heroImage = product.background_image || product.image || "/images/unit-bg.png";
  const portraitImage = product.image || product.background_image || "/images/unit-bg.png";
  const specLine = formatProductSpec(product);

  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />

      <WigSideTab href={`/dashboard/book?service=the-glorious-custom-unit&unit=${encodeURIComponent(product.slug)}`} label="Book Your Unit" />

      <UnitHero
        image={heroImage}
        display={product.name}
        script="Unit"
        eyebrow={specLine}
        trail={[{ label: "Wigs", href: "/wigs" }, { label: `${product.name} Unit` }]}
        bookHref={`/dashboard/book?service=the-glorious-custom-unit&unit=${encodeURIComponent(product.slug)}`}
      />

      <UnitStorySection unit={product} tone="light" />

      <UnitGallery
        tone="dark"
        items={siblings}
        heading={{
          eyebrow: "Keep Looking",
          heading: "Other",
          headingAccent: "Units",
        }}
      />

      <ServiceCta cta={unitsPage.cta} image={portraitImage} />

      <div className="relative z-50">
        <ServiceCta
          cta={unitsPage.servicesCta}
          image={portraitImage}
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
