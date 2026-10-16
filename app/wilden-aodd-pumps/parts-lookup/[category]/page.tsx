import { WILDEN_SPARE_CATEGORIES } from "@/lib/wilden";
import { SpareLookupPage, spareLookupMetadata } from "@/components/wilden/lookupPages";

type Params = Promise<{ category: string }>;

// One static page per part category (the first category is the parent route).
export const dynamicParams = false;
export function generateStaticParams() {
  return WILDEN_SPARE_CATEGORIES.filter((c) => c.slug).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  return spareLookupMetadata(null, (await params).category);
}

export default async function WildenSparePartsCategoryPage({ params }: { params: Params }) {
  return <SpareLookupPage locale={null} slug={(await params).category} />;
}
