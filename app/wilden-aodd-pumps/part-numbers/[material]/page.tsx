import { WILDEN_PUMP_MATERIALS } from "@/lib/wilden";
import { PumpLookupPage, pumpLookupMetadata } from "@/components/wilden/lookupPages";

type Params = Promise<{ material: string }>;

// One static page per body material (aluminum is the parent route).
export const dynamicParams = false;
export function generateStaticParams() {
  return WILDEN_PUMP_MATERIALS.filter((m) => m.slug).map((m) => ({ material: m.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  return pumpLookupMetadata(null, (await params).material);
}

export default async function WildenPartNumbersMaterialPage({ params }: { params: Params }) {
  return <PumpLookupPage locale={null} slug={(await params).material} />;
}
