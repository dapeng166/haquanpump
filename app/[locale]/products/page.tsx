import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getProductSeries } from "@/lib/wordpress";
import { toCard } from "@/lib/cardProduct";
import { WILDEN_HUB_PATH, WILDEN_SERIES } from "@/lib/wilden";
import { Container, Section } from "@/components/ui/Primitives";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";
import { ExplorerFallback } from "@/components/products/ExplorerFallback";
import { ProductIndex } from "@/components/products/ProductIndex";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { translate, translateMany } from "@/lib/i18n/translate";
import { cardLabels } from "@/lib/i18n/uiLabels";

type Params = Promise<{ locale: string }>;

// Localized listings render on-demand (ISR); discovered via sitemap + hreflang.
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

const EN_TITLE = "Sewage Pumps — Submersible, Grinder, WILDEN AODD & Centrifugal";
const EN_HEADING = "Sewage Pumps Engineered for Every Duty";
const EN_DESC =
  "Browse Haquan's full range of sewage and process pumps: submersible, grinder, self-priming, WILDEN AODD and QBY diaphragm, and pipeline centrifugal pumps.";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return {};
  const [title, description] = await Promise.all([
    translate(EN_TITLE, locale),
    translate(EN_DESC, locale),
  ]);
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/products`,
      languages: localeAlternates("/products"),
    },
  };
}

const EN_UI = {
  heading: EN_HEADING,
  filterHeading: "Pump Series",
  allLabel: "All Series",
  // A bare "Showing" machine-translates as a noun ("Demostración").
  showing: "Results:",
  of: "of",
  product: "product",
  products: "products",
  empty: "No products to show yet.",
  indexHeading: "Full product index",
  indexHint: "Every pump in the catalogue, grouped by series.",
};

export default async function LocalizedProductsPage({
  params,
}: {
  params: Params;
}) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();

  const [all, allSeriesEn] = await Promise.all([getProducts(), getProductSeries()]);
  // Wilden lives on its own hub; list Haquan's own pumps and link out to it.
  const cards = all.filter((p) => p.seriesSlug !== WILDEN_SERIES).map(toCard);
  const seriesEn = allSeriesEn.filter((s) => s.slug !== WILDEN_SERIES);
  const wilden = allSeriesEn.find((s) => s.slug === WILDEN_SERIES);
  const uiKeys = Object.keys(EN_UI) as (keyof typeof EN_UI)[];
  // Everything in three batched calls (cached per string after the first run).
  const [uiValues, seriesNames, cardText] = await Promise.all([
    translateMany(uiKeys.map((k) => EN_UI[k]), locale),
    translateMany([...seriesEn.map((s) => s.name), wilden?.name ?? ""], locale),
    translateMany(cards.flatMap((p) => [p.name, p.excerpt]), locale),
  ]);
  const T = Object.fromEntries(uiKeys.map((k, i) => [k, uiValues[i]])) as typeof EN_UI;
  const series = seriesEn.map((s, i) => ({ ...s, name: seriesNames[i] }));
  const seriesName = new Map(series.map((s) => [s.slug, s.name]));
  const products = cards.map((p, i) => ({
    ...p,
    name: cardText[i * 2],
    excerpt: cardText[i * 2 + 1],
    seriesName: seriesName.get(p.seriesSlug) ?? p.seriesName,
  }));
  const labels = cardLabels(locale);
  const hrefBase = `/${locale}`;
  const linkChips = wilden
    ? [{
        slug: wilden.slug,
        name: seriesNames[seriesEn.length],
        count: all.length - cards.length,
        href: `${hrefBase}${WILDEN_HUB_PATH}`,
      }]
    : [];

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <Section className="pt-28 sm:pt-32">
        <Container>
          <h1 className="mb-10 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {T.heading}
          </h1>
          <Suspense fallback={<ExplorerFallback products={products} hrefBase={hrefBase} cardLabels={labels} />}>
            <ProductsExplorer
              products={products}
              series={series}
              basePath={`${hrefBase}/products`}
              hrefBase={hrefBase}
              cardLabels={labels}
              text={T}
              linkChips={linkChips}
            />
          </Suspense>
          <ProductIndex
            products={products}
            series={series}
            basePath={hrefBase}
            labels={{ heading: T.indexHeading, hint: T.indexHint }}
          />
        </Container>
      </Section>
    </div>
  );
}
