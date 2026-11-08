/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Serve images straight from their source instead of through Vercel's optimizer: the Hobby plan's
    // image-optimization allowance ran out (2026-10-31, rolling 30 days) and every new image then
    // returned 402 and showed blank. Most WP media is already web-sized (median ~240 KB).
    unoptimized: true,
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
    // Old or garbled addresses Search Console reported as 404 (2026-11-03):
    // typos, machine-translated slugs and early placeholder products, each
    // sent to the closest live page. Removed test articles stay 404.
    const moved = [
      ["/wilden-aodd-pumps/part-numbers/polypropene", "/wilden-aodd-pumps/part-numbers/polypropylene"],
      [`/wilden-aodd-pumps/part-numbers/${encodeURIComponent("polyпропилен")}`, "/wilden-aodd-pumps/part-numbers/polypropylene"],
      ["/news/60hz-special-length-sewage-pumps", "/news/60hz-special-voltage-sewage-pumps"],
      [`/news/${encodeURIComponent("non-clog-corrosion-résistant-sewage-pump-guide")}`, "/news/non-clog-corrosion-resistant-sewage-pump-guide"],
      ["/news/non-clog-corrosion-treatment-sewage-pump-guide", "/news/non-clog-corrosion-resistant-sewage-pump-guide"],
      ["/news/non-clog-corrosion-resistent-sewage-pump-guide", "/news/non-clog-corrosion-resistant-sewage-pump-guide"],
      ["/products/wilden-t15-tree-15-3800-09-07-2", "/products/wilden-t15-shaft-15-3800-09-07-2"],
      ["/products/qby-aodd-pump", "/products/qby-diaphragm-pump-complete-product-range-and-selection-guide"],
      ["/products/qw258221-1mobilesubmersiblewastepump", "/products/qw-25-8-22-1-1-mobile-submersible-waste-pump"],
      ["/products/qby-air-diaphragm-pump-for-chemical-netrochemical-transfer", "/products/qby-air-diaphragm-pump-for-chemical-petrochemical-transfer"],
      ["/products/wilden-t4-aodd-pump-2-inch-turbo-flo-833-l-min-high-pression", "/products/wilden-t4-aodd-pump-2-inch-turbo-flo-833-l-min-high-pressure"],
      ["/products/wilden-t4-aodd-pump-2-inch-turbo-flo-833-l-min-high-%20Pressure", "/products/wilden-t4-aodd-pump-2-inch-turbo-flo-833-l-min-high-pressure"],
      ["/products/50gnwq20-15-2-2-cutter-pump-factory-canteen-2", "/products/50gnwq20-15-2-2-cutter-pump-factory-canteen"],
      ["/products/qby-aodd-pump-for-ceramics-paint-ink-transfer-glaze-pigments-coatings-efficiency", "/products/qby-aodd-pump-for-ceramics-paint-ink-transfer-glaze-pigments-coatings-efficiently"],
      ["/products/wilden-aodd-pump-handles-any-fluid-from-high-viscosity-to-abrasive-slurries", "/wilden-aodd-pumps"],
      ["/products/wq-submersible-sewage-pump", "/news/wq-qw-submersible-sewage-pump-differences"],
      ["/products/wqd-sewage-pump", "/products/wq-32-8-12-0-75kw-32mm-submersible-sewage-pump"],
      ["/products/wqp-stainless-submersible-pump", "/products/stainless-steel-wq-submersible-pump-corrosive-wastewater"],
      ["/products/wqk-grinder-pump", "/products/wqk-submersible-grinder-sewage-pump-factory-direct"],
      ["/products/isg-vertical-pipeline-pump", "/products/isg-vertical-inline-centrifugal-pump"],
      ["/products/isw-horizontal-pipeline-pump", "/products/isw-horizontal-pump-dust-suppression-water"],
      ["/products/irg-hot-water-pipeline-pump", "/news/irg-hot-water-circulation-pump"],
      ["/products/ihg-chemical-pipeline-pump", "/news/ihg-stainless-steel-chemical-inline-pump"],
      // QBY pages renamed 2026-11-08: the old addresses called the pump itself
      // "explosion-proof", which the company does not claim for QBY.
      ["/products/qby-air-diaphragm-pump-spark-free-explosion-proof-transfer", "/products/qby-air-diaphragm-pump-air-driven-flammable-liquid-transfer"],
      ["/products/qby-diaphragm-pump-explosion-proof-for-flammable-liquids", "/products/qby-diaphragm-pump-for-flammable-liquids"],
      ["/products/qby-explosion-proof-diaphragm-pump-safe-transfer-of-acids-solvents-hazardous-chemicals", "/products/qby-diaphragm-pump-acids-solvents-hazardous-chemicals"],
      // WQK20-15QG: the old address gave the flow as 80 m³/h; the owner confirmed 20 (2026-11-08).
      [`/products/${encodeURIComponent("wqk20-15qg-sewage-pump-80-m³-h-flow-1-5-kw-cuts-everything")}`, "/products/wqk20-15qg-cutting-sewage-pump-20-m3-h-15-m-1-5-kw"],
    ];
    return [
      ...renamed.flatMap(([from, to]) => [
        { source: `/news/${from}`, destination: `/news/${to}`, permanent: true },
        { source: `/:locale(es|pt|fr|de|ru|ar)/news/${from}`, destination: `/:locale/news/${to}`, permanent: true },
      ]),
      ...moved.flatMap(([from, to]) => [
        { source: from, destination: to, permanent: true },
        { source: `/:locale(es|pt|fr|de|ru|ar)${from}`, destination: `/:locale${to}`, permanent: true },
      ]),
    ];
  },
};

export default nextConfig;
