import type { Metadata } from "next";
import { getProducts, getProductSeries } from "@/lib/wordpress";
import { Container, Section } from "@/components/ui/Primitives";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";
import { ProductIndex } from "@/components/products/ProductIndex";

export const metadata: Metadata = {
  title: "Sewage Pumps — Submersible, Grinder, WILDEN AODD & Centrifugal",
  description:
    "Browse Haquan's full range of sewage and process pumps: sewage, grinder, self-priming, stainless submersible, WILDEN AODD and QBY diaphragm, and IHG/IRG/IHW/IRW pipeline centrifugal pumps. Filter by series and review full specifications.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ series?: string }>;
}) {
  const [products, series, params] = await Promise.all([
    getProducts(),
    getProductSeries(),
    searchParams,
  ]);

  const initialSeries =
    params.series && series.some((s) => s.slug === params.series)
      ? params.series
      : "all";

  return (
    <Section className="pt-28 sm:pt-32">
      <Container>
        <h1 className="sr-only">Sewage Pumps Engineered for Every Duty</h1>
        <ProductsExplorer
          products={products}
          series={series}
          initialSeries={initialSeries}
        />
        <ProductIndex
          products={products}
          series={series}
          labels={{
            heading: "Full product index",
            hint: "Every pump in the catalogue, grouped by series.",
          }}
        />
      </Container>
    </Section>
  );
}
