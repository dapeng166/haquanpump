import { PumpLookupPage, pumpLookupMetadata } from "@/components/wilden/lookupPages";

type Params = Promise<{ locale: string; material: string }>;

// Rendered on first request per locale, then cached; unknown slugs 404.
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, material } = await params;
  return pumpLookupMetadata(locale, material);
}

export default async function LocalizedWildenPartNumbersMaterialPage({ params }: { params: Params }) {
  const { locale, material } = await params;
  return <PumpLookupPage locale={locale} slug={material} />;
}
