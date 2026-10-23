import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { indexableLocales } from "@/lib/i18n/config";
import { WILDEN_HUB_PATH } from "@/lib/wilden";

// On-demand revalidation endpoint. WordPress pings this when a product, news
// post or page is published/updated, so the change appears immediately instead
// of waiting for the timed ISR window — and without blindly refreshing on a
// timer, which keeps ISR-write usage low. Never cached.
export const dynamic = "force-dynamic";

const SECRET = process.env.REVALIDATE_SECRET;

// The listing/index routes that must refresh when content changes. A caller may
// also pass ?path=/products/some-slug to refresh one specific page.
const BASE_PATHS = ["/", "/products", "/news", "/support", WILDEN_HUB_PATH];
// "/news" too: a `pump` entry tagged as a guide or case study is listed under
// News & Guides (and its /products URL redirects to /news).
const PRODUCT_PATHS = ["/", "/products", "/news", WILDEN_HUB_PATH, "/tools/pump-selector"];
const NEWS_PATHS = ["/", "/news"];

function revalidateAllLocales(path: string) {
  revalidatePath(path);
  for (const locale of indexableLocales) {
    revalidatePath(path === "/" ? `/${locale}` : `/${locale}${path}`);
  }
}

// WordPress sends slugs percent-encoded (e.g. "m%c2%b3" for "m³"), which may not
// match the path Next cached, so refresh the decoded and re-encoded forms too.
function pathVariants(path: string) {
  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch {}
  const encoded = encodeURI(decoded);
  return [...new Set([path, decoded, encoded, encoded.toLowerCase()])];
}

async function handle(req: NextRequest) {
  const provided =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("x-revalidate-secret");

  if (!SECRET || provided !== SECRET) {
    return NextResponse.json(
      { revalidated: false, error: "Invalid or missing secret" },
      { status: 401 },
    );
  }

  // Optionally refresh one specific page (e.g. the exact product/news URL).
  const extra = req.nextUrl.searchParams.get("path");

  // Only refresh the listings the published item actually appears on — every
  // refreshed page is rewritten in 7 languages and billed as ISR writes.
  const listings = extra?.startsWith("/products/")
    ? PRODUCT_PATHS
    : extra?.startsWith("/news/")
      ? NEWS_PATHS
      : BASE_PATHS;
  for (const path of listings) revalidateAllLocales(path);
  // The localized pump selectors load the catalogue from a per-locale JSON (only
  // their small default-duty seed is in the page, refreshed with it above).
  if (listings === PRODUCT_PATHS)
    for (const locale of indexableLocales) revalidatePath(`/api/tools/catalogue/${locale}`);
  // Sitemaps have no locale prefix.
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemap");
  // Site search index, so new products, documents and news are searchable now
  // rather than after its daily refresh.
  revalidatePath("/api/search");

  if (extra && extra.startsWith("/")) for (const p of pathVariants(extra)) revalidateAllLocales(p);
  if (extra?.startsWith("/products/"))
    for (const p of pathVariants(extra.replace("/products/", "/news/"))) revalidateAllLocales(p);

  return NextResponse.json({
    revalidated: true,
    paths: [...listings, "/sitemap.xml", ...(extra ? [extra] : [])],
    now: Date.now(),
  });
}

export const GET = handle;
export const POST = handle;
