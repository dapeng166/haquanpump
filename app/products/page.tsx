import type { Metadata } from "next";
import { getProducts, getProductSeries } from "@/lib/wordpress";
import { Container, Section } from "@/components/ui/Primitives";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";

export const metadata: Metadata = {
  title: "Industrial Pumps — Sewage, Grinder, AODD & Centrifugal",
  description:
    "Browse Haquan's full range of industrial pumps: sewage, grinder, self-priming, stainless submersible, AODD (WILDEN-compatible) and ISG/IRG/IHG/ISW pipeline centrifugal pumps. Filter by series and review full specifications.",
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
        <h1 className="sr-only">Industrial Pumps Engineered for Every Duty</h1>
        <ProductsExplorer
          products={products}
          series={series}
          initialSeries={initialSeries}
        />
      </Container>
    </Section>
  );
}
