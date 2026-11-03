import type { Product } from "@/lib/types";
import { KSB_PUMPS, ksbPath } from "@/lib/ksb";
import { DESMI_ITEMS, desmiPath } from "@/lib/desmi";

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

// Home page picks (owner, 2026-11-03): one KSB and one DESMI card take the
// place of the two 4-inch Wilden pumps, which WordPress still flags featured.
const HOME_HIDDEN = new Set([
  "wilden-t15-aodd-pump-4-inch-turbo-flo-1040-l-min-largest-t-series",
  "wilden-p15-aodd-pump-4-inch-1040-l-min-largest-p-series-high-volume",
]);
const HOME_BRAND_SLOT = 4;

function brandCard(href: string, item: { slug: string; title: string; summary: string; image: string }, series: string): Product {
  const noSpecs = { flowRate: "", head: "", power: "", diameter: "", material: "" };
  return { slug: item.slug, href, name: item.title, model: "", seriesSlug: "", seriesName: series, excerpt: item.summary, description: "", image: item.image, gallery: [], specs: noSpecs, applications: [] };
}

/** Home page cards: featured WordPress products with the KSB and DESMI picks slotted in. */
export function homeCards(products: Product[], count: number): Product[] {
  const ksb = KSB_PUMPS.find((k) => k.slug === "etanorm-syt")!;
  const desmi = DESMI_ITEMS.find((d) => d.slug === "rotan-gp")!;
  const brands = [brandCard(ksbPath(ksb), ksb, "Genuine KSB"), brandCard(desmiPath(desmi), desmi, "Genuine DESMI")];
  const featured = products.filter((p) => p.featured && !HOME_HIDDEN.has(p.slug));
  const pool = (featured.length >= 3 ? featured : products).slice(0, count - brands.length).map(toCard);
  return [...pool.slice(0, HOME_BRAND_SLOT), ...brands, ...pool.slice(HOME_BRAND_SLOT)];
}
