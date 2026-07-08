import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/wordpress";
import { company } from "@/lib/site";
import {
  ProductDetailView,
  EN_PRODUCT_LABELS,
} from "@/components/products/ProductDetailView";
import { localeAlternates } from "@/lib/i18n/alternates";

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
    alternates: {
      canonical: `/products/${product.slug}`,
      languages: localeAlternates(`/products/${product.slug}`),
    },
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

      <ProductDetailView product={product} related={related} labels={EN_PRODUCT_LABELS} />
    </>
  );
}
