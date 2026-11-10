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
  ["/wigs-and-extensions", "/wigs"],
  ["/haircuts-and-styles", "/services/haircuts-and-styles"],
  ["/treatments", "/services/treatments"],

  // Children that used to sit at the root.
  ["/custom-wig-design", "/wigs/services/wig-design-and-consult"],
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

  // The Silk Press showcase was reviewed here before it replaced the service page.
  ["/silk-press-new", "/services/silk-press"],

  // The old combined weaves-and-extensions category split in two. Weaves
  // kept its own parent; the Extensions side (Single Track, Wig Prep) now
  // sits under the Wigs destination rather than under /services.
  ["/weaves-and-extensions", "/services/weaves"],
  ["/services/extensions", "/wigs"],
  ["/services/wigs-services", "/wigs"],
  ["/services/wigs-services/:slug", "/wigs"],

  // The previous Wigs and Silk Press pages were parked at /old-* while their
  // replacements were built. Both are gone now; the two wig sub-services that
  // lived under /old-wig moved to /wigs/services.
  ["/old-wig", "/wigs"],
  ["/old-wig/:slug", "/wigs/services/:slug"],
  ["/old-silk-press", "/services/silk-press"],
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return serviceRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
