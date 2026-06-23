import type { Metadata } from "next";
import { getProducts, getProductSeries } from "@/lib/wordpress";
import { img } from "@/lib/images";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Primitives";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";

export const metadata: Metadata = {
  title: "Industrial Pumps — Sewage, Grinder, AODD & Centrifugal",
  description:
    "Browse Haquan's full range of industrial pumps: sewage, grinder, self-priming, stainless submersible, AODD (WILDEN-compatible) and ISG/IRG/IHG/ISW pipeline centrifugal pumps. Filter by series and download brochures.",
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
    <>
      <PageHero
        eyebrow="Product Range"
        title="Industrial Pumps Engineered for Every Duty"
        intro="Six core pump series covering sewage, slurry, process and clean-water applications. Filter by series, review specifications, and download technical brochures."
        image={img.heroSecondary}
        breadcrumbs={[{ label: "Products" }]}
      />
      <Section>
        <Container>
          <ProductsExplorer
            products={products}
            series={series}
            initialSeries={initialSeries}
          />
        </Container>
      </Section>
    </>
  );
}
