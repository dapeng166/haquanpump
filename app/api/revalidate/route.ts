import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { indexableLocales } from "@/lib/i18n/config";

// On-demand revalidation endpoint. WordPress pings this when a product, news
// post or page is published/updated, so the change appears immediately instead
// of waiting for the timed ISR window — and without blindly refreshing on a
// timer, which keeps ISR-write usage low. Never cached.
export const dynamic = "force-dynamic";

const SECRET = process.env.REVALIDATE_SECRET;

// The listing/index routes that must refresh when content changes. A caller may
// also pass ?path=/products/some-slug to refresh one specific page.
const BASE_PATHS = ["/", "/products", "/news", "/support"];

function revalidateAllLocales(path: string) {
  revalidatePath(path);
  for (const locale of indexableLocales) {
    revalidatePath(path === "/" ? `/${locale}` : `/${locale}${path}`);
  }
}

async function handle(req: NextRequest) {
  const provided =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("x-revalidate-secret");

  // Safe diagnostic (?debug=1): reveals only whether the env var is set and the
  // lengths — never the values — so a mismatch can be pinpointed.
  if (req.nextUrl.searchParams.get("debug") === "1") {
    const allKeys = Object.keys(process.env);
    return NextResponse.json({
      deployMarker: "v4-envprobe",
      envConfigured: Boolean(SECRET),
      envLength: SECRET?.length ?? 0,
      providedLength: provided?.length ?? 0,
      // Runtime environment probe (NAMES only, never values):
      totalEnvKeys: allKeys.length,
      vercelEnv: process.env.VERCEL_ENV ?? null,
      hasRevalidate: Boolean(process.env.REVALIDATE_SECRET),
      // NEXT_PUBLIC_ / project key NAMES the runtime can actually see
      projectKeys: allKeys
        .filter((k) => /REVAL|WP_API|SITE_URL|CONTENT_MODE|NEXT_PUBLIC/i.test(k))
        .sort(),
    });
  }

  if (!SECRET || provided !== SECRET) {
    return NextResponse.json(
      { revalidated: false, error: "Invalid or missing secret" },
      { status: 401 },
    );
  }

  for (const path of BASE_PATHS) revalidateAllLocales(path);
  // Sitemaps have no locale prefix.
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemap");

  // Optionally refresh one specific page (e.g. the exact product/news URL).
  const extra = req.nextUrl.searchParams.get("path");
  if (extra && extra.startsWith("/")) revalidateAllLocales(extra);

  return NextResponse.json({
    revalidated: true,
    paths: [...BASE_PATHS, "/sitemap.xml", ...(extra ? [extra] : [])],
    now: Date.now(),
  });
}

export const GET = handle;
export const POST = handle;
