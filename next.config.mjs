/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        // WordPress media library (product photos uploaded in the CMS)
        protocol: "https",
        hostname: "cms.haquanpump.com",
      },
    ],
  },
  // Renamed article URLs (old slug → new slug). Permanent so search engines
  // move the ranking to the new address.
  async redirects() {
    const renamed = [
      // News 584: the owner never calls Haquan an "authorized dealer" (2026-10-23).
      [
        "authorized-wilden-diaphragm-pump-dealer-genuine-pumps-spare-parts-in-stock-ready-for-worldwide-shipping",
        "genuine-wilden-diaphragm-pump-supplier-original-pumps-spare-parts-in-stock",
      ],
    ];
    return renamed.flatMap(([from, to]) => [
      { source: `/news/${from}`, destination: `/news/${to}`, permanent: true },
      { source: `/:locale(es|pt|fr|de|ru|ar)/news/${from}`, destination: `/:locale/news/${to}`, permanent: true },
    ]);
  },
};

export default nextConfig;
