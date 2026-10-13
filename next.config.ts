import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Off on purpose: detail pages await params before streaming so unknown slugs
  // answer a real 404. Revisit when Next makes Partial Prefetching mandatory.
  partialPrefetching: false,
  images: {
    remotePatterns: [new URL("https://cdn.sanity.io/images/**")],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
