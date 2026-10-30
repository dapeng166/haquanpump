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

// Listings are refreshed in English only. Each localized listing is ~2 MB of
// HTML + RSC, so refreshing all six on every publish cost ~1,600 ISR writes per
// publish and pushed the Hobby plan to 526K/200K (2026-10-30). The localized
// listings now pick new items up on their own timed window (data cache, 7 days);
// the published page itself is still refreshed in every language below.
function revalidateEnglish(path: string) {
  revalidatePath(path);
}

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
  // refreshed page is rewritten and billed as ISR writes (per 8 KB).
  const listings = extra?.startsWith("/products/")
    ? PRODUCT_PATHS
    : extra?.startsWith("/news/")
      ? NEWS_PATHS
      : BASE_PATHS;
  for (const path of listings) revalidateEnglish(path);
  // The localized pump selectors' catalogue JSON and the HTML /sitemap page
  // follow their own timed windows. The XML sitemap stays here so Google finds
  // new URLs the same day.
  revalidatePath("/sitemap.xml");
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
