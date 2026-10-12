import type { Metadata } from "next";
import { localeAlternates } from "@/lib/i18n/alternates";
import { WILDEN_HUB_PATH, WILDEN_PARTS_PATH } from "@/lib/wilden";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { PARTS_EN, WildenPartsView } from "@/components/wilden/WildenPartsView";

export const metadata: Metadata = {
  title: PARTS_EN.metaTitle,
  description: PARTS_EN.metaDesc,
  alternates: { canonical: WILDEN_PARTS_PATH, languages: localeAlternates(WILDEN_PARTS_PATH) },
};

// Fully static: the builds list lives in code, not WordPress, so publishing a
// product never regenerates this page.
export default function WildenPartNumbersPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: PARTS_EN.hubCrumb, path: WILDEN_HUB_PATH },
          { name: PARTS_EN.crumb, path: WILDEN_PARTS_PATH },
        ]}
      />
      <WildenPartsView T={PARTS_EN} />
    </>
  );
}
