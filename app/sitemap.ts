import type { MetadataRoute } from "next";
import { company } from "@/lib/site";
import { getNews, getProducts } from "@/lib/wordpress";

// Refresh the sitemap hourly so newly published news/products are submitted to
// search engines automatically.
export const revalidate = 3600;

/**
 * Generates /sitemap.xml — the six core pages plus every product detail and
 * news article (so Google can discover and index each one). Falls back to just
 * the static pages if the CMS is unreachable.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = company.url;
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms-of-use`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  let dynamic: MetadataRoute.Sitemap = [];
  try {
    const [products, news] = await Promise.all([getProducts(), getNews()]);
    dynamic = [
      ...products.map((p) => ({
        url: `${base}/products/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...news.map((n) => ({
        url: `${base}/news/${n.slug}`,
        lastModified: n.date ? new Date(n.date) : now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    // CMS unreachable — still return the static sitemap.
  }

  return [...staticUrls, ...dynamic];
}
