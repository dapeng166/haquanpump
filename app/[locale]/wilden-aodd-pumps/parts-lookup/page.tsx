import { SpareLookupPage, spareLookupMetadata } from "@/components/wilden/lookupPages";

type Params = Promise<{ locale: string }>;

// Rendered on first request per locale, then cached (machine-translated UI).
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }) {
  return spareLookupMetadata((await params).locale, "");
}

export default async function LocalizedWildenSparePartsPage({ params }: { params: Params }) {
  return <SpareLookupPage locale={(await params).locale} slug="" />;
}
