// Shape of a single package card entry
export type PackageItem = {
  slug: string;
  cardTitle: string;
  cardBlurb: string;
  cardImage: string;
};

// Single source of truth for all packages.
// The slug MUST match the folder name of each package page.
export const packages: PackageItem[] = [
  {
    slug: "glorious-packages",
    cardTitle: "Glorious Package",
    cardBlurb: "Short description for the glorious package goes here.",
    cardImage: "/images/GLORIOUS-PACKAGES-01.webp",
  },
  {
    slug: "bridal-packages",
    cardTitle: "Bridal Package",
    cardBlurb: "Short description for the bridal package goes here.",
    cardImage: "/images/bridal1.webp",
  },
  {
    slug: "maintenance-packages",
    cardTitle: "Maintenance Package",
    cardBlurb: "Short description for the maintenance package goes here.",
    cardImage: "/images/collections/wigs-2.png",
  },
];

// Builds the URL for a package detail page
export const packagePath = (slug: string): string => `${slug}`;