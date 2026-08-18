import { products } from "@/app/shop/product";
import { getParents, serviceChildren, servicePath } from "@/data/services";

/**
 * Nav structure and hover-preview content for the full-screen menu.
 *
 * Hovering (or focusing) a link swaps the right-hand panel and the panel
 * *stays* there — it does not revert when the pointer leaves. The panel only
 * resets when the menu closes, and it resets to whichever nav item matches
 * the page you're currently on.
 */

export type MenuLink = {
  key: string;
  label: string;
  href: string;
};

export type PreviewCard = {
  image: string;
  title: string;
  body: string;
  href: string;
};

export type PreviewProduct = {
  title: string;
  price: string;
  image: string;
};

export type PreviewVideo = {
  src: string;
  label: string;
};

export type PreviewPost = {
  image: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  href: string;
};

type PreviewBase = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
};

/** Each variant renders a different panel layout. */
export type MenuPreview =
  | (PreviewBase & { variant: "default"; image: string })
  | (PreviewBase & { variant: "lookbook"; videos: PreviewVideo[] })
  | (PreviewBase & { variant: "blog"; posts: PreviewPost[] })
  | (PreviewBase & { variant: "shop"; products: PreviewProduct[] })
  | (PreviewBase & {
      variant: "contact";
      image: string;
      phone: string;
      phoneHref: string;
      address: string;
      mapHref: string;
    })
  | (PreviewBase & { variant: "cards"; cards: PreviewCard[]; cardCta: string });

/**
 * Placeholder — drop the salon's Google Maps link in here and the address in
 * the Contact panel becomes clickable.
 */
export const CONTACT_MAP_HREF = "#";

/**
 * The single nav list. Services and Packages sit alongside the other links —
 * their children live in the preview panel rather than the left column.
 * "Home" lives on the header logo instead.
 */
export const PRIMARY_LINKS: MenuLink[] = [
  { key: "about-us", label: "About Us", href: "/about-us" },
  { key: "services", label: "Services", href: "/services" },
  { key: "packages", label: "Packages", href: "/services" },
  { key: "lookbook", label: "Lookbook", href: "/lookbook" },
  { key: "glory-news", label: "Glory News", href: "/glory-news" },
  { key: "shop", label: "Shop", href: "/shop" },
  { key: "contact", label: "Contact", href: "/contact" },
];

/**
 * Products flagged `showcase: true` in product.ts. The panel shows two; if
 * nobody has flagged any, fall back to the first two so it never renders empty.
 */
const showcased = products.filter((product) => product.showcase);
const SHOP_PREVIEW_PRODUCTS: PreviewProduct[] = (
  showcased.length > 0 ? showcased : products
)
  .slice(0, 2)
  .map((product) => ({
    title: product.productTitle,
    price: `$${product.productPrice}`,
    image: product.productImage,
  }));

/**
 * Single-page previews. Defined separately so the Services and Packages
 * panels can build their card rows from these same entries.
 */
const PAGE_PREVIEWS = {
  home: {
    variant: "default",
    eyebrow: "By Appointment Only",
    title: "October Glory",
    body: "A Brooklyn salon and wig spa where every look is built around your hair, your texture, and the way you live in it.",
    image: "/images/salon-image.webp",
    href: "/",
  },
  "about-us": {
    variant: "default",
    eyebrow: "Our Story",
    title: "About October Glory",
    body: "Meet Jhavuanna Paterson — owner and master hair stylist — and the philosophy that shaped the salon.",
    image: "/images/about-img.png",
    href: "/about-us",
  },

  "glorious-packages": {
    variant: "default",
    eyebrow: "Packages",
    title: "Glorious Packages",
    body: "Luxury bundled packages combining multiple premium salon services for complete care.",
    image: "/images/GLORIOUS-PACKAGES-01.webp",
    href: "/glorious-packages",
  },
  "bridal-packages": {
    variant: "default",
    eyebrow: "Packages",
    title: "Bridal Packages",
    body: "Exclusive bridal experience ensuring flawless hair styling for your special day.",
    image: "/images/bridal1.webp",
    href: "/bridal-packages",
  },
  "maintenance-packages": {
    variant: "default",
    eyebrow: "Packages",
    title: "Maintenance Packages",
    body: "Regular care and upkeep to keep your custom unit fresh and your natural hair healthy underneath.",
    image: "/images/collections/wigs-2.png",
    href: "/maintenance-packages",
  },
} satisfies Record<string, MenuPreview>;

/**
 * Preview panels for every service, generated from the service data so the
 * menu can't fall out of step with /services. Parents and children both get an
 * entry: children need one so `resolveActiveKey` rests on the right panel when
 * you open the menu on a child page.
 */
const SERVICE_PREVIEWS: Record<string, MenuPreview> = Object.fromEntries([
  ...getParents().map((parent) => [
    parent.slug,
    {
      variant: "default" as const,
      eyebrow: "Services",
      title: parent.cardTitle,
      body: parent.cardBlurb,
      image: parent.cardImage,
      href: servicePath(parent),
    },
  ]),
  ...serviceChildren.map((child) => [
    child.slug,
    {
      variant: "default" as const,
      eyebrow: "Services",
      title: child.cardTitle,
      body: child.hero.intro,
      image: child.cardImage,
      href: servicePath(child),
    },
  ]),
]);

/** The five main services, as cards for the Services panel. */
const SERVICE_CARDS: PreviewCard[] = getParents().map((parent) => ({
  image: parent.cardImage,
  title: parent.cardTitle,
  body: parent.cardBlurb,
  href: servicePath(parent),
}));

/** Turns page previews into the card rows used by Services and Packages. */
const cardsFrom = (keys: (keyof typeof PAGE_PREVIEWS)[]): PreviewCard[] =>
  keys.map((key) => {
    const preview = PAGE_PREVIEWS[key];
    return {
      image: preview.image,
      title: preview.title,
      body: preview.body,
      href: preview.href,
    };
  });

export const PREVIEWS: Record<string, MenuPreview> = {
  ...PAGE_PREVIEWS,
  ...SERVICE_PREVIEWS,

  lookbook: {
    variant: "lookbook",
    eyebrow: "The Gallery",
    title: "The Lookbook",
    body: "Finished looks straight from the chair — hover any reel to play it.",
    href: "/lookbook",
    videos: [
      { src: "/images/1-video.mp4", label: "Sew-In Install" },
      { src: "/images/video-2.mp4", label: "Silk Press" },
    ],
  },

  "glory-news": {
    variant: "blog",
    eyebrow: "The Journal",
    title: "Glory Girl Blog",
    body: "Style Trends, Maintenance & How To's for the Modern Glory Girl.",
    href: "/glory-news",
    posts: [
      {
        image: "/images/post-01.webp",
        title: "The Ultimate Guide to Maintaining Your Hair Extensions",
        date: "June 15, 2026",
        readTime: "5 Min Read",
        excerpt:
          "Discover expert tips and techniques to keep your hair extensions looking flawless and beautiful for longer.",
        href: "/glory-news",
      },
      {
        image: "/images/post-01.webp",
        title: "The Ultimate Guide to Maintaining Your Hair Extensions",
        date: "June 15, 2026",
        readTime: "5 Min Read",
        excerpt:
          "Discover expert tips and techniques to keep your hair extensions looking flawless and beautiful for longer.",
        href: "/glory-news",
      },
    ],
  },

  shop: {
    variant: "shop",
    eyebrow: "The Collection",
    title: "Shop October Glory",
    body: "Custom units, closure pieces and the products we reach for in the salon.",
    href: "/shop",
    products: SHOP_PREVIEW_PRODUCTS,
  },

  contact: {
    variant: "contact",
    eyebrow: "Visit Us",
    title: "Get In Touch",
    body: "Ready for a luxurious transformation? Reach out to schedule your private appointment with Jhavuanna Paterson at October Glory.",
    image: "/images/salon-image.webp",
    href: "/contact",
    phone: "917 - 905 - 6552",
    phoneHref: "tel:+19179056552",
    address: "1381 Bedford Avenue Brooklyn, NY 11216",
    mapHref: CONTACT_MAP_HREF,
  },

  services: {
    variant: "cards",
    eyebrow: "What We Do",
    title: "Our Services",
    body: "Each of our services are tailored to our client's personality and style.",
    href: "/services",
    cardCta: "View Service",
    cards: SERVICE_CARDS,
  },

  packages: {
    variant: "cards",
    eyebrow: "Curated",
    title: "Our Packages",
    body: "Bundled experiences that combine several premium services in one visit.",
    href: "/services",
    cardCta: "View Package",
    cards: cardsFrom([
      "glorious-packages",
      "bridal-packages",
      "maintenance-packages",
    ]),
  },
};

export const DEFAULT_PREVIEW_KEY = "home";

/**
 * Longest-prefix match of the current route to a preview key, so opening the
 * menu on /services/silk-press/ponytail-and-updo rests on that child's panel.
 */
export function resolveActiveKey(pathname: string | null): string {
  if (!pathname || pathname === "/") return DEFAULT_PREVIEW_KEY;

  let matchedKey = DEFAULT_PREVIEW_KEY;
  let matchedLength = 0;

  for (const [key, preview] of Object.entries(PREVIEWS)) {
    const { href } = preview;
    if (href === "/") continue;

    const isMatch = pathname === href || pathname.startsWith(`${href}/`);
    if (isMatch && href.length > matchedLength) {
      matchedKey = key;
      matchedLength = href.length;
    }
  }

  return matchedKey;
}
