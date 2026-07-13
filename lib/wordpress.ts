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

/**
 * Like {@link wpFetch}, but THROWS on a transient failure (network error,
 * timeout, or non-2xx such as Hostinger's intermittent 403) instead of
 * returning null. A genuine "nothing matched" still resolves to a valid empty
 * array (HTTP 200 []).
 *
 * This distinction matters for single-item lookups (product/news by slug): if a
 * transient CMS hiccup were swallowed as null, the page would call notFound()
 * and Next.js would **cache that 404**, taking a real product offline until the
 * next successful revalidation. By throwing instead, Next keeps serving the
 * last-good page (or 500s on a never-generated path) and never caches a 404 for
 * a product that actually exists.
 */
async function wpFetchStrict<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${WP_API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`CMS responded ${res.status} for ${path}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch one page of a WordPress collection, returning both the body and the
 * `X-WP-TotalPages` header so callers can page through the whole collection.
 */
async function wpFetchPage<T>(
  path: string,
): Promise<{ data: T[]; totalPages: number } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${WP_API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const totalPages = Number(res.headers.get("x-wp-totalpages") ?? "1") || 1;
    const data = (await res.json()) as T[];
    return { data, totalPages };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch an ENTIRE WordPress collection, transparently paging past the REST
 * API's hard `per_page=100` limit. Page 1 tells us the total page count; the
 * remaining pages are fetched in parallel. `maxPages` caps the total requests
 * as a safety valve (100 × 30 = up to 3,000 items). Returns null only if the
 * very first request fails, so callers can fall back to seed data.
 */
async function wpFetchAll<T>(path: string, maxPages = 30): Promise<T[] | null> {
  const sep = path.includes("?") ? "&" : "?";
  const first = await wpFetchPage<T>(`${path}${sep}per_page=100&page=1`);
  if (!first) return null;
  if (first.totalPages <= 1) return first.data;

  const pages = Math.min(first.totalPages, maxPages);
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) =>
      wpFetchPage<T>(`${path}${sep}per_page=100&page=${i + 2}`),
    ),
  );
  return rest.reduce<T[]>((all, r) => (r ? all.concat(r.data) : all), first.data);
}

/**
 * Decode the HTML entities WordPress emits in `*.rendered` fields. wptexturize
 * turns straight quotes/dashes into numeric entities (e.g. 1" -> 1&#8243;,
 * -- -> &#8211;), which show up literally when the value is rendered as plain
 * text. Decode numeric (decimal + hex) and the common named entities. `&amp;`
 * is decoded last so an encoded ampersand doesn't revive other entities.
 */
function decodeEntities(text: string): string {
  const codePoint = (raw: string, radix: number): string => {
    const cp = parseInt(raw, radix);
    return Number.isFinite(cp) && cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "";
  };
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => codePoint(hex, 16))
    .replace(/&#(\d+);/g, (_, dec) => codePoint(dec, 10))
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function stripHtml(html = ""): string {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).trim();
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
    // Real model code from ACF; left empty (not the title) when unset so the
    // product page can hide the "Model:" line instead of repeating the name.
    model: acf(fields, "model", "model_no"),
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
  // Page through the whole `pump` collection — WP caps per_page at 100, so a
  // catalogue larger than 100 needs pagination or products silently disappear.
  const raw = await wpFetchAll<WPPump>("/wp/v2/pump?_embed");
  const live = raw ? raw.map(mapPump) : [];
  if (CONTENT_MODE === "merge") return mergeBySlug(seedProducts, live);
  return live.length ? live : seedProducts; // "live"
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  let raw: WPPump[];
  try {
    raw = await wpFetchStrict<WPPump[]>(
      `/wp/v2/pump?slug=${encodeURIComponent(slug)}&_embed`,
    );
  } catch {
    // CMS unreachable — do NOT treat this as "product doesn't exist" (which
    // would let the page cache a 404). Serve seed data if we have it; otherwise
    // rethrow so Next.js keeps the last-good page instead of caching notFound().
    const seed = seedProducts.find((p) => p.slug === slug);
    if (seed) return seed;
    throw new Error(`CMS unavailable while resolving product "${slug}"`);
  }
  if (raw.length > 0) return mapPump(raw[0], 0);
  // Genuine 200-empty: the product really doesn't exist → allow notFound().
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
  let raw: WPPost[];
  try {
    raw = await wpFetchStrict<WPPost[]>(
      `/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`,
    );
  } catch {
    // CMS unreachable — serve seed if present, else rethrow so a real article
    // is never taken offline by a cached 404 (see getProductBySlug).
    const seed = seedNews.find((n) => n.slug === slug);
    if (seed) return seed;
    throw new Error(`CMS unavailable while resolving article "${slug}"`);
  }
  if (raw.length > 0) {
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
  // Documents are "unlimited" too — page past the 100 cap so a long list is
  // never truncated on the Support page.
  const raw = await wpFetchAll<WPDocument>("/wp/v2/document?orderby=menu_order&order=asc");
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
