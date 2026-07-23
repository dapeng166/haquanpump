import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getAdjacentProducts } from "@/lib/wordpress";
import {
  ProductDetailView,
  EN_PRODUCT_LABELS,
} from "@/components/products/ProductDetailView";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { localeAlternates } from "@/lib/i18n/alternates";
import { metaTitle, metaDescription } from "@/lib/seo";

// Render product pages on-demand (ISR) rather than at build time. This keeps a
// deploy from depending on the CMS being reachable during the build (a
// transient CMS failure would otherwise fail the build or bake a 404), and each
// page is cached after its first hit. Google still discovers them via the
// sitemap. `getProductBySlug` throws on a CMS hiccup so a real product is never
// cached as a 404.
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
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
    title: metaTitle(product.name),
    description: metaDescription(product.excerpt),
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

  const [related, { prev, next }] = await Promise.all([
    getRelatedProducts(product),
    getAdjacentProducts(product),
  ]);

  return (
    <>
      <ProductJsonLd product={product} path={`/products/${product.slug}`} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.name, path: `/products/${product.slug}` },
        ]}
      />

      <ProductDetailView
        product={product}
        related={related}
        labels={EN_PRODUCT_LABELS}
        prev={prev}
        next={next}
      />
    </>
  );
}
