import { NextResponse } from "next/server";
import { isIndexableLocale } from "@/lib/i18n/config";
import { localizedCatalogue } from "@/lib/tools/localCatalogue";

// The localized pump selectors load the full catalogue from here after the
// page has rendered: one cached JSON per locale, refreshed on product publish
// via /api/revalidate, instead of a copy baked into every localized page.
export const dynamic = "force-static";
export const revalidate = 604800;
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return NextResponse.json([], { status: 404 });
  return NextResponse.json(await localizedCatalogue(locale));
}
