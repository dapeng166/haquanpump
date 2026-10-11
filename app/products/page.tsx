import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts, getProductSeries } from "@/lib/wordpress";
import { toCard } from "@/lib/cardProduct";
import { Container, Section } from "@/components/ui/Primitives";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";
import { ExplorerFallback } from "@/components/products/ExplorerFallback";
import { ProductIndex } from "@/components/products/ProductIndex";

export const metadata: Metadata = {
  title: "Sewage Pumps — Submersible, Grinder, WILDEN AODD & Centrifugal",
  description:
    "Browse Haquan's full range of sewage and process pumps: sewage, grinder, self-priming, stainless submersible, WILDEN AODD and QBY diaphragm, and IHG/IRG/IHW/IRW pipeline centrifugal pumps. Filter by series and review full specifications.",
  alternates: { canonical: "/products" },
};

// Static (ISR) — the ?series= filter is read on the client, so this page is
// no longer re-rendered with all ~500 products on every single request.
export default async function ProductsPage() {
  const [all, series] = await Promise.all([getProducts(), getProductSeries()]);
  const products = all.map(toCard);

  return (
    <Section className="pt-28 sm:pt-32">
      <Container>
        <h1 className="sr-only">Sewage Pumps Engineered for Every Duty</h1>
        <Suspense fallback={<ExplorerFallback products={products} />}>
          <ProductsExplorer products={products} series={series} />
        </Suspense>
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
