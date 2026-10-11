import type { Metadata } from "next";
import { getProducts } from "@/lib/wordpress";
import { groupWilden, wildenCatalogue, WILDEN_HUB_PATH } from "@/lib/wilden";
import { localeAlternates } from "@/lib/i18n/alternates";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { groupNames, WILDEN_EN, WildenHubView } from "@/components/wilden/WildenHubView";

export const metadata: Metadata = {
  title: WILDEN_EN.metaTitle,
  description: WILDEN_EN.metaDesc,
  alternates: { canonical: WILDEN_HUB_PATH, languages: localeAlternates(WILDEN_HUB_PATH) },
};

// Static (ISR); the ?series= filter is read on the client.
export default async function WildenHubPage() {
  const groups = groupWilden(await getProducts());
  const { products, series } = wildenCatalogue(groups, groupNames(WILDEN_EN));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: WILDEN_EN.crumb, path: WILDEN_HUB_PATH },
        ]}
      />
      <WildenHubView
        T={WILDEN_EN}
        products={products}
        series={series}
        heroImage={groups.find((g) => g.key === "pumps")?.items[0]?.image}
      />
    </>
  );
}
