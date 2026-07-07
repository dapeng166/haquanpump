import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/wordpress";
import { company } from "@/lib/site";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import {
  translateProduct,
  translateProductLabels,
} from "@/lib/i18n/translateProduct";
import { translateMany } from "@/lib/i18n/translate";

type Params = Promise<{ locale: string; slug: string }>;

// Render localized pages on-demand (ISR) rather than pre-building locale ×
// product at deploy time — that would multiply CMS fetches per build. Google
// still discovers them via the sitemap + hreflang; each is cached on first hit.
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isIndexableLocale(locale)) return {};
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const [name, excerpt] = await translateMany(
    [product.name, product.excerpt],
    locale,
  );
  const path = `/products/${product.slug}`;

  return {
    title: name,
    description: excerpt,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: localeAlternates(path),
    },
    openGraph: {
      title: `${name} | Haquan Pump`,
      description: excerpt,
      images: [{ url: product.image, alt: name }],
    },
  };
}

export default async function LocalizedProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug } = await params;
  if (!isIndexableLocale(locale)) notFound();

  const source = await getProductBySlug(slug);
  if (!source) notFound();

  const [product, related, labels] = await Promise.all([
    translateProduct(source, locale),
    getRelatedProducts(source).then((list) =>
      Promise.all(list.map((p) => translateProduct(p, locale))),
    ),
    translateProductLabels(locale),
  ]);

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
    inLanguage: locale,
  };

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView
        product={product}
        related={related}
        labels={labels}
        hrefBase={`/${locale}`}
      />
    </div>
  );
}
