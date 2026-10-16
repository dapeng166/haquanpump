import { PumpLookupPage, pumpLookupMetadata } from "@/components/wilden/lookupPages";

// Aluminum builds (the original lookup URL). Fully static: the builds list
// lives in code, not WordPress, so publishing a product never regenerates it.
export const generateMetadata = () => pumpLookupMetadata(null, "");

export default function WildenPartNumbersPage() {
  return <PumpLookupPage locale={null} slug="" />;
}
