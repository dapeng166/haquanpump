import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getAdjacentProducts } from "@/lib/wordpress";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { metaTitle, metaDescription } from "@/lib/seo";
import {
  translateProduct,
  translateProductLabels,
} from "@/lib/i18n/translateProduct";
import { translate, translateMany } from "@/lib/i18n/translate";
import { cardLabels } from "@/lib/i18n/uiLabels";

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
    title: metaTitle(name),
    description: metaDescription(excerpt),
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

  const [product, related, labels, crumbLabels, adjacent] = await Promise.all([
    translateProduct(source, locale),
    getRelatedProducts(source).then((list) =>
      Promise.all(list.map((p) => translateProduct(p, locale))),
    ),
    translateProductLabels(locale),
    translateMany(["Home", "Products"], locale),
    // Only the neighbour's name is shown, so translate just that (not the whole product).
    getAdjacentProducts(source).then(async ({ prev, next }) => ({
      prev: prev ? { ...prev, name: await translate(prev.name, locale) } : null,
      next: next ? { ...next, name: await translate(next.name, locale) } : null,
    })),
  ]);
  const [homeLabel, productsLabel] = crumbLabels;

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <ProductJsonLd
        product={product}
        path={`/${locale}/products/${product.slug}`}
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: homeLabel, path: `/${locale}` },
          { name: productsLabel, path: `/${locale}/products` },
          { name: product.name, path: `/${locale}/products/${source.slug}` },
        ]}
      />
      <ProductDetailView
        product={product}
        related={related}
        labels={labels}
        hrefBase={`/${locale}`}
        cardLabels={cardLabels(locale)}
        prev={adjacent.prev}
        next={adjacent.next}
      />
    </div>
  );
}
