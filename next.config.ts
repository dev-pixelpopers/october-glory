import type { NextConfig } from "next";

/**
 * Every service now lives under /services/<parent>[/<child>]. These keep the
 * previous root-level URLs working — they were live, so they redirect
 * permanently rather than 404.
 */
const serviceRedirects = [
  // The five main services, formerly at the root.
  ["/silk-press", "/services/silk-press"],
  ["/relaxers-and-colors", "/services/relaxers-and-colors"],
  ["/wigs-and-extensions", "/services/wigs-and-extensions"],
  ["/haircuts-and-styles", "/services/haircuts-and-styles"],
  ["/treatments", "/services/treatments"],

  // Children that used to sit at the root.
  ["/custom-wig-design", "/services/wigs-and-extensions/custom-wig-design"],
  ["/ponytail-and-updo", "/services/haircuts-and-styles/ponytail-and-updo"],

  // Natural Styles was retired; its services are now under Haircuts & Styles.
  ["/natural-styles", "/services/haircuts-and-styles"],
  ["/natural-styles/rodset", "/services/haircuts-and-styles/rodset"],
  ["/natural-styles/flat-twist", "/services/haircuts-and-styles/flat-twist"],
  ["/natural-styles/wash-and-go", "/services/haircuts-and-styles/wash-and-go"],
  ["/natural-styles/braid-down", "/services/haircuts-and-styles/braid-down"],
  [
    "/natural-styles/2-strand-twist",
    "/services/haircuts-and-styles/2-strand-twist",
  ],
  ["/natural-styles/natural-updo", "/services/haircuts-and-styles/natural-updo"],

  // Silk Press moved twice; send the original URL to where it lives now.
  ["/natural-styles/silk-press", "/services/silk-press"],

  // The old weaves category is covered by the Wigs & Extensions page.
  ["/weaves-and-extensions", "/services/wigs-and-extensions"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return serviceRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
