import type { MetadataRoute } from "next";
import { company } from "@/lib/site";

// Generates /sitemap.xml. Mirrors the required sitemap exactly (same URLs,
// change frequencies and priorities) using the public site URL.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.url; // https://www.haquanpump.com
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
