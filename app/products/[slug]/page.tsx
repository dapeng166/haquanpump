import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/wordpress";
import { company } from "@/lib/site";
import {
  ProductDetailView,
  type ProductDetailLabels,
} from "@/components/products/ProductDetailView";

// English source strings; localized routes translate these before rendering.
const EN_LABELS: ProductDetailLabels = {
  home: "Home",
  products: "Products",
  model: "Model:",
  specifications: "Specifications",
  flowRate: "Flow Rate",
  head: "Head",
  power: "Power",
  diameter: "Inlet / Outlet Diameter",
  material: "Material",
  overview: "Product Overview",
  applications: "Typical Applications",
  related: "Related Products",
  inquire: "Inquire About This Product",
};

// Pre-render known products; new WordPress products render on-demand (ISR).
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    // Use the product name alone; the site template appends " | Haquan Pump".
    // Appending the series name here duplicated keywords (e.g. "WQK … Sewage
    // Pump — WQK … Sewage Pump") and pushed the title past Google's ~60-char cut.
    title: product.name,
    description: product.excerpt,
    keywords: product.seoKeywords
      ? product.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : undefined,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | Haquan Pump`,
      description: product.excerpt,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  // Product structured data for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.excerpt,
    sku: product.model,
    category: product.seriesName,
    brand: { "@type": "Brand", name: "Haquan" },
    manufacturer: { "@type": "Organization", name: company.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProductDetailView product={product} related={related} labels={EN_LABELS} />
    </>
  );
}
