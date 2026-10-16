import { SpareLookupPage, spareLookupMetadata } from "@/components/wilden/lookupPages";

type Params = Promise<{ locale: string; category: string }>;

// Rendered on first request per locale, then cached; unknown slugs 404.
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, category } = await params;
  return spareLookupMetadata(locale, category);
}

export default async function LocalizedWildenSparePartsCategoryPage({ params }: { params: Params }) {
  const { locale, category } = await params;
  return <SpareLookupPage locale={locale} slug={category} />;
}
