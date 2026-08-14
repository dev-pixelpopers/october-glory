import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Silk Press was promoted out of Natural Styles into a top-level
        // service. Keep the old URL working for anything already linking to it.
        source: "/natural-styles/silk-press",
        destination: "/silk-press",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
