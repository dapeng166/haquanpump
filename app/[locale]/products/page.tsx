import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/wordpress";
import { Container, Section } from "@/components/ui/Primitives";
import { ProductCard } from "@/components/products/ProductCard";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { translateProductCard } from "@/lib/i18n/translateProduct";
import { translate } from "@/lib/i18n/translate";

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

export default async function LocalizedProductsPage({
  params,
}: {
  params: Params;
}) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();

  const products = await getProducts();
  const [heading, translated] = await Promise.all([
    translate(EN_HEADING, locale),
    Promise.all(products.map((p) => translateProductCard(p, locale))),
  ]);

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <Section className="pt-28 sm:pt-32">
        <Container>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {heading}
          </h1>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {translated.map((p) => (
              <ProductCard key={p.slug} product={p} hrefBase={`/${locale}`} />
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
