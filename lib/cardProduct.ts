import type { Product } from "@/lib/types";

/**
 * Strip a product down to what a card shows before handing it to a client
 * component. Client props are serialized into every page's HTML + RSC payload,
 * and a listing page passing all ~500 products with their full HTML
 * descriptions weighed ~7 MB — Vercel bills ISR writes per 8 KB, so each
 * WordPress publish (which refreshes the listings in 7 languages) cost ~5,000
 * writes and blew the Hobby quota. Cards never render description/gallery.
 */
export function toCard(p: Product): Product {
  return {
    slug: p.slug,
    name: p.name,
    model: "",
    seriesSlug: p.seriesSlug,
    seriesName: p.seriesName,
    // Cards clamp the summary to two lines; ~160 chars is plenty.
    excerpt: p.excerpt.length > 160 ? p.excerpt.slice(0, 160).trimEnd() + "…" : p.excerpt,
    description: "",
    image: p.image,
    gallery: [],
    // Cards show flow / head / power only.
    specs: { flowRate: p.specs.flowRate, head: p.specs.head, power: p.specs.power, diameter: "", material: "" },
    applications: [],
  };
}
