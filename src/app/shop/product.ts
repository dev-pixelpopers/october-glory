export type ProductTag =
  | "new"
  | "hot"
  | "styles"
  | "bangs"
  | "wavy"
  | "volume"
  | "extension";

export const PRODUCT_TAGS: ProductTag[] = [
  "new",
  "hot",
  "styles",
  "bangs",
  "wavy",
  "volume",
  "extension",
];

export interface Product {
  productId: string;
  productTitle: string;
  productDescription: string;
  productImage: string;
  galleryImages: string[];
  productPrice: number;
  productCta: string;
  productCategory: string;
  productTags: ProductTag[];
  /**
   * Marks a product for the featured slot in the full-screen menu's Shop
   * panel. Exactly two products should carry this — the panel shows two.
   */
  showcase?: boolean;
}

const WIG_IMAGES = [
  "/images/collections/wigs-1.png",
  "/images/collections/wigs-2.png",
  "/images/collections/wigs-3.png",
  "/images/collections/wigs-4.png",
  "/images/collections/wigs-5.png",
];

export const products: Product[] = [
  {
    productId: "silk-press-bundle",
    productTitle: "Silk Press Bundle",
    productDescription:
      "Premium 100% human hair bundle, silk-pressed to a glass-smooth finish.",
    productImage: WIG_IMAGES[0],
    galleryImages: [WIG_IMAGES[0], WIG_IMAGES[1]],
    productPrice: 60,
    productCta: "See Options",
    productCategory: "Bundles",
    productTags: ["new", "styles"],
    showcase: true,
  },
  {
    productId: "brooklyn-lace-wig",
    productTitle: "Brooklyn Lace Wig",
    productDescription:
      "Hand-tied lace front wig with a natural hairline, ready to install.",
    productImage: WIG_IMAGES[1],
    galleryImages: [WIG_IMAGES[1], WIG_IMAGES[2]],
    productPrice: 80,
    productCta: "See Options",
    productCategory: "Wigs",
    productTags: ["hot", "wavy"],
    showcase: true,
  },
  {
    productId: "glory-closure-piece",
    productTitle: "Glory Closure Piece",
    productDescription:
      "4x4 closure piece for a seamless part and full coverage.",
    productImage: WIG_IMAGES[2],
    galleryImages: [WIG_IMAGES[2], WIG_IMAGES[3]],
    productPrice: 80,
    productCta: "See Options",
    productCategory: "Closures",
    productTags: ["new"],
  },
  {
    productId: "hydration-repair-mask",
    productTitle: "Hydration Repair Mask",
    productDescription:
      "Deep conditioning treatment that restores moisture from root to tip.",
    productImage: WIG_IMAGES[3],
    galleryImages: [WIG_IMAGES[3], WIG_IMAGES[4]],
    productPrice: 40,
    productCta: "See Options",
    productCategory: "Hair Care",
    productTags: ["hot"],
  },
  {
    productId: "curl-defining-cream",
    productTitle: "Curl Defining Cream",
    productDescription:
      "Lightweight styling cream for frizz-free, defined curls all day.",
    productImage: WIG_IMAGES[4],
    galleryImages: [WIG_IMAGES[4], WIG_IMAGES[0]],
    productPrice: 70,
    productCta: "See Options",
    productCategory: "Hair Care",
    productTags: ["wavy", "volume"],
  },
  {
    productId: "custom-wig-cap",
    productTitle: "Custom Wig Cap",
    productDescription:
      "Breathable, adjustable cap built as the base for custom wig units.",
    productImage: WIG_IMAGES[0],
    galleryImages: [WIG_IMAGES[0], WIG_IMAGES[2]],
    productPrice: 25,
    productCta: "See Options",
    productCategory: "Accessories",
    productTags: ["styles"],
  },
  {
    productId: "bond-builder-treatment",
    productTitle: "Bond Builder Treatment",
    productDescription:
      "Strengthening treatment that repairs broken bonds from coloring.",
    productImage: WIG_IMAGES[1],
    galleryImages: [WIG_IMAGES[1], WIG_IMAGES[3]],
    productPrice: 55,
    productCta: "See Options",
    productCategory: "Hair Care",
    productTags: ["hot"],
  },
  {
    productId: "satin-bonnet",
    productTitle: "Satin Bonnet",
    productDescription:
      "Adjustable satin-lined bonnet that protects your style overnight.",
    productImage: WIG_IMAGES[2],
    galleryImages: [WIG_IMAGES[2], WIG_IMAGES[4]],
    productPrice: 20,
    productCta: "See Options",
    productCategory: "Accessories",
    productTags: ["styles"],
  },
  {
    productId: "glory-ponytail",
    productTitle: "Glory Ponytail",
    productDescription:
      "Clip-in ponytail extension for instant length and volume.",
    productImage: WIG_IMAGES[3],
    galleryImages: [WIG_IMAGES[3], WIG_IMAGES[0]],
    productPrice: 45,
    productCta: "See Options",
    productCategory: "Accessories",
    productTags: ["extension", "volume"],
  },
  {
    productId: "protein-moisture-pack",
    productTitle: "Protein Moisture Pack",
    productDescription:
      "Balanced protein-moisture treatment for stronger, more elastic hair.",
    productImage: WIG_IMAGES[4],
    galleryImages: [WIG_IMAGES[4], WIG_IMAGES[1]],
    productPrice: 50,
    productCta: "See Options",
    productCategory: "Hair Care",
    productTags: ["new"],
  },
  {
    productId: "brooklyn-bob-wig",
    productTitle: "Brooklyn Bob Wig",
    productDescription:
      "Chin-length lace bob wig, pre-plucked for a natural finish.",
    productImage: WIG_IMAGES[0],
    galleryImages: [WIG_IMAGES[0], WIG_IMAGES[3]],
    productPrice: 85,
    productCta: "See Options",
    productCategory: "Wigs",
    productTags: ["bangs", "styles"],
  },
  {
    productId: "wig-adhesive-kit",
    productTitle: "Wig Adhesive Kit",
    productDescription:
      "Salon-grade adhesive and remover kit for secure, damage-free installs.",
    productImage: WIG_IMAGES[1],
    galleryImages: [WIG_IMAGES[1], WIG_IMAGES[4]],
    productPrice: 30,
    productCta: "See Options",
    productCategory: "Accessories",
    productTags: ["styles"],
  },
  {
    productId: "hd-lace-closure",
    productTitle: "HD Lace Closure",
    productDescription:
      "Ultra-thin HD lace closure that melts seamlessly into any install.",
    productImage: WIG_IMAGES[2],
    galleryImages: [WIG_IMAGES[2], WIG_IMAGES[0]],
    productPrice: 90,
    productCta: "See Options",
    productCategory: "Closures",
    productTags: ["hot", "new"],
  },
  {
    productId: "scalp-relief-serum",
    productTitle: "Scalp Relief Serum",
    productDescription:
      "Soothing scalp serum that calms irritation and supports healthy growth.",
    productImage: WIG_IMAGES[3],
    galleryImages: [WIG_IMAGES[3], WIG_IMAGES[2]],
    productPrice: 35,
    productCta: "See Options",
    productCategory: "Hair Care",
    productTags: ["new"],
  },
  {
    productId: "glory-headband-wig",
    productTitle: "Glory Headband Wig",
    productDescription:
      "No-lace headband wig for a quick, glueless everyday install.",
    productImage: WIG_IMAGES[4],
    galleryImages: [WIG_IMAGES[4], WIG_IMAGES[3]],
    productPrice: 65,
    productCta: "See Options",
    productCategory: "Wigs",
    productTags: ["wavy", "volume"],
  },
];
