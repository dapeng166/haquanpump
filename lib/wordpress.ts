import { WP_API_URL } from "@/lib/site";
import type { NewsPost, Product, PumpSeries, SitePage, TechDocument } from "@/lib/types";
import { pumpSeries, seedProducts, seriesWithCounts } from "@/lib/data/products";
import { seedNews } from "@/lib/data/news";
import { productImages, newsImages, pickImage } from "@/lib/images";

/**
 * WordPress REST API integration.
 *
 * Backend: https://haquanpump.com/cms  (Custom Post Type `pump`, taxonomy
 * `pump_series`, ACF fields). Data is fetched with ISR (revalidate) so pages
 * are static-fast but refresh automatically.
 *
 * Every function degrades gracefully: if the CMS is unreachable, returns no
 * data, or is not yet populated, we fall back to the curated seed catalogue so
 * the site always renders real content.
 */

const REVALIDATE_SECONDS = 60; // 1 minute ISR — CMS edits appear quickly

type WPMedia = { source_url?: string; alt_text?: string };
type WPEmbedded = {
  "wp:featuredmedia"?: WPMedia[];
  "wp:term"?: Array<Array<{ slug: string; name: string }>>;
};
type WPRendered = { rendered?: string };

interface WPPump {
  id: number;
  slug: string;
  title: WPRendered;
  excerpt?: WPRendered;
  content?: WPRendered;
  pump_series?: number[];
  acf?: Record<string, unknown>;
  /** Resolved image URLs (featured + gallery) from our custom REST field. */
  gallery?: string[];
  _embedded?: WPEmbedded;
}

interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: WPRendered;
  excerpt?: WPRendered;
  content?: WPRendered;
  _embedded?: WPEmbedded;
}

interface WPSitePage {
  id: number;
  slug: string;
  title: WPRendered;
  acf?: Record<string, unknown>;
  _embedded?: WPEmbedded;
}

interface WPTerm {
  id: number;
  slug: string;
  name: string;
  description?: string;
  count?: number;
}

async function wpFetch<T>(path: string): Promise<T | null> {
  // Hard cap each CMS request so a slow/hung WordPress can never tie up the
  // Node server (which would cascade into 503s). On timeout/error we fall back
  // to seed data upstream.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${WP_API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Network error / DNS / CMS down / timeout — fall back to seed data.
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function stripHtml(html = ""): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

/** Read an ACF value tolerant of several likely field-name spellings. */
function acf(fields: Record<string, unknown> = {}, ...keys: string[]): string {
  for (const key of keys) {
    const v = fields[key];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  return "";
}

function featuredImage(embedded?: WPEmbedded, fallback?: string): string {
  return embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? fallback ?? productImages[0];
}

function mapPump(raw: WPPump, index: number): Product {
  const fields = raw.acf ?? {};
  const term = raw._embedded?.["wp:term"]?.flat()?.[0];

  const brochure = fields["pdf_brochure"] ?? fields["brochure"] ?? fields["pdf"];
  const brochureUrl =
    typeof brochure === "string"
      ? brochure
      : typeof brochure === "object" && brochure !== null
        ? ((brochure as { url?: string }).url ?? undefined)
        : undefined;

  // Resolved image URLs (Featured Image + Gallery 1–4) from our custom REST
  // field. Falls back to the embedded featured image, then a seed image.
  const cmsGallery = Array.isArray(raw.gallery)
    ? raw.gallery.filter((u) => typeof u === "string" && u.startsWith("http"))
    : [];
  const mainImage =
    cmsGallery[0] ?? featuredImage(raw._embedded, pickImage(productImages, index));
  const gallery = cmsGallery.length ? cmsGallery : [mainImage];

  // WordPress's auto-excerpt truncates by word (spaces). Chinese text has no
  // spaces, so the "excerpt" can end up being the entire body. Cap it to a
  // real summary length here so cards and the detail summary stay short.
  const rawExcerpt = stripHtml(raw.excerpt?.rendered) || stripHtml(raw.content?.rendered);
  const excerpt =
    rawExcerpt.length > 200 ? rawExcerpt.slice(0, 200).trimEnd() + "…" : rawExcerpt;

  return {
    slug: raw.slug,
    name: stripHtml(raw.title.rendered),
    model: acf(fields, "model", "model_no") || stripHtml(raw.title.rendered),
    seriesSlug: term?.slug ?? "sewage-pumps",
    seriesName: term?.name ?? "Sewage Pumps",
    excerpt,
    description: raw.content?.rendered ?? `<p>${stripHtml(raw.excerpt?.rendered)}</p>`,
    image: mainImage,
    gallery,
    specs: {
      flowRate: acf(fields, "flow_rate", "flowrate", "flow") || "—",
      head: acf(fields, "head", "lift") || "—",
      power: acf(fields, "power", "motor_power", "kw") || "—",
      diameter: acf(fields, "inlet_outlet_diameter", "diameter", "inlet_outlet", "bore") || "—",
      material: acf(fields, "material", "materials") || "—",
    },
    applications: acf(fields, "applications", "industries")
      .split(/[,/]/)
      .map((a) => a.trim())
      .filter(Boolean),
    brochureUrl,
    featured: Boolean(fields["featured"]),
    seoKeywords: acf(fields, "seo_keywords") || undefined,
  };
}

// ----------------------------------------------------------------------
// Public API
//
// Content source is controlled by NEXT_PUBLIC_CONTENT_MODE:
//   "merge" (default) — full curated catalogue, supplemented by any extra live
//                       CMS items (curated entries are authoritative so the
//                       preview is always complete and well-organised).
//   "live"            — only WordPress; falls back to seed if the CMS is empty
//                       or unreachable. Use this once your CMS is fully built.
//   "seed"            — curated catalogue only (offline / fully static demo).
// ----------------------------------------------------------------------

const CONTENT_MODE = (process.env.NEXT_PUBLIC_CONTENT_MODE ?? "live").toLowerCase();

/** Combine two lists, keeping `primary` on slug collisions. */
function mergeBySlug<T extends { slug: string }>(primary: T[], secondary: T[]): T[] {
  const seen = new Set(primary.map((x) => x.slug));
  return [...primary, ...secondary.filter((x) => !seen.has(x.slug))];
}

export async function getProducts(): Promise<Product[]> {
  if (CONTENT_MODE === "seed") return seedProducts;
  const raw = await wpFetch<WPPump[]>("/wp/v2/pump?_embed&per_page=100");
  const live = raw ? raw.map(mapPump) : [];
  if (CONTENT_MODE === "merge") return mergeBySlug(seedProducts, live);
  return live.length ? live : seedProducts; // "live"
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const raw = await wpFetch<WPPump[]>(`/wp/v2/pump?slug=${encodeURIComponent(slug)}&_embed`);
  if (raw && raw.length > 0) return mapPump(raw[0], 0);
  return seedProducts.find((p) => p.slug === slug) ?? null;
}

export async function getProductSeries(): Promise<PumpSeries[]> {
  const seedSeries = seriesWithCounts();
  if (CONTENT_MODE === "seed") return seedSeries;
  const raw = await wpFetch<WPTerm[]>("/wp/v2/pump_series?per_page=100&hide_empty=false");
  const live: PumpSeries[] = raw
    ? raw.map((t) => ({
        slug: t.slug,
        name: t.name,
        description:
          stripHtml(t.description) ||
          pumpSeries.find((s) => s.slug === t.slug)?.description ||
          "",
        count: t.count,
      }))
    : [];
  if (CONTENT_MODE === "merge") return mergeBySlug(seedSeries, live);
  return live.length ? live : seedSeries; // "live"
}

export async function getRelatedProducts(
  product: Product,
  limit = 3,
): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.slug !== product.slug && p.seriesSlug === product.seriesSlug)
    .concat(all.filter((p) => p.slug !== product.slug && p.seriesSlug !== product.seriesSlug))
    .slice(0, limit);
}

export async function getNews(): Promise<NewsPost[]> {
  if (CONTENT_MODE === "seed") return seedNews;
  const raw = await wpFetch<WPPost[]>("/wp/v2/posts?_embed&per_page=24");
  const live: NewsPost[] = raw
    ? raw.map((post, i) => ({
        slug: post.slug,
        title: stripHtml(post.title.rendered),
        excerpt: stripHtml(post.excerpt?.rendered).slice(0, 200),
        content: post.content?.rendered ?? "",
        image: featuredImage(post._embedded, pickImage(newsImages, i)),
        date: post.date,
        author:
          post._embedded?.["wp:term"]?.flat()?.find(Boolean)?.name ?? "Haquan",
        category: post._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "News",
        readingTime: Math.max(
          2,
          Math.round(stripHtml(post.content?.rendered).split(/\s+/).length / 200),
        ),
      }))
    : [];
  if (CONTENT_MODE === "merge") return mergeBySlug(seedNews, live);
  return live.length ? live : seedNews; // "live"
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  const raw = await wpFetch<WPPost[]>(`/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`);
  if (raw && raw.length > 0) {
    const post = raw[0];
    return {
      slug: post.slug,
      title: stripHtml(post.title.rendered),
      excerpt: stripHtml(post.excerpt?.rendered),
      content: post.content?.rendered ?? "",
      image: featuredImage(post._embedded),
      date: post.date,
      author: "Haquan",
      category: "News",
      readingTime: Math.max(2, Math.round(stripHtml(post.content?.rendered).split(/\s+/).length / 200)),
    };
  }
  return seedNews.find((n) => n.slug === slug) ?? null;
}

/**
 * Fetch the single `site_page` record for a given category (home | about |
 * support | contact). Returns null when the CPT is absent or empty, so each
 * page can fall back to its built-in default content.
 */
export async function getSitePage(category: string): Promise<SitePage | null> {
  const raw = await wpFetch<WPSitePage[]>("/wp/v2/site_page?_embed&per_page=20");
  if (!raw || raw.length === 0) return null;

  const match = raw.find((p) => {
    const section =
      typeof p.acf?.page_section === "string" ? (p.acf.page_section as string) : "";
    const termSlug = p._embedded?.["wp:term"]?.flat()?.[0]?.slug;
    return section === category || termSlug === category;
  });
  if (!match) return null;

  const acf = match.acf ?? {};
  const str = (k: string) => (typeof acf[k] === "string" ? (acf[k] as string).trim() : "");

  return {
    category,
    title: stripHtml(match.title?.rendered),
    subtitle: str("subtitle"),
    heroImage: str("hero_image") || null,
    ctaText: str("cta_text"),
    ctaLink: str("cta_link"),
    acf,
  };
}

/** Read an ACF string value with a fallback (for page-specific fields). */
export function acfStr(
  page: SitePage | null,
  key: string,
  fallback = "",
): string {
  const v = page?.acf?.[key];
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

interface WPDocument {
  id: number;
  title: WPRendered;
  file_url?: string; // resolved by the Haquan — Documents plugin
  acf?: Record<string, unknown>;
}

/**
 * Downloadable technical documents from the `document` CPT (Support page).
 * Unlimited — add as many as you like in wp-admin. Only documents with an
 * actual file are returned; empty if the CPT/plugin isn't present.
 */
export async function getDocuments(): Promise<TechDocument[]> {
  const raw = await wpFetch<WPDocument[]>("/wp/v2/document?per_page=100&orderby=menu_order&order=asc");
  if (!raw) return [];
  return raw
    .map((d) => ({
      title: stripHtml(d.title?.rendered),
      url: typeof d.file_url === "string" ? d.file_url.trim() : "",
      type:
        typeof d.acf?.doc_type === "string" && (d.acf.doc_type as string).trim()
          ? (d.acf.doc_type as string).trim()
          : "Document",
    }))
    .filter((d) => d.url);
}
