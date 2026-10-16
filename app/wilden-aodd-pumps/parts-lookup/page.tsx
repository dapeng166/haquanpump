import { SpareLookupPage, spareLookupMetadata } from "@/components/wilden/lookupPages";

// Diaphragms, valve balls & seats (the first spare-parts category). Fully
// static: the parts list lives in code, not WordPress.
export const generateMetadata = () => spareLookupMetadata(null, "");

export default function WildenSparePartsPage() {
  return <SpareLookupPage locale={null} slug="" />;
}
