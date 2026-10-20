import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/wordpress";
import { toCard } from "@/lib/cardProduct";
import { groupWilden, wildenCatalogue, WILDEN_HUB_PATH } from "@/lib/wilden";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { translateMany } from "@/lib/i18n/translate";
import { cardLabels } from "@/lib/i18n/uiLabels";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import {
  groupNames,
  WILDEN_EN,
  WildenHubView,
  type WildenStrings,
} from "@/components/wilden/WildenHubView";

type Params = Promise<{ locale: string }>;

export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

// Hand-written titles that lead with the phrase people actually search in each
// language ("bombas wilden" had 73 impressions and no clicks under the
// machine-translated "Proveedor de bombas…" title).
const HUB_TITLES: Record<string, string> = {
  es: "Bombas WILDEN AODD originales y repuestos",
  pt: "Bombas WILDEN AODD originais e peças de reposição",
  fr: "Pompes WILDEN AODD d'origine et pièces détachées",
  de: "WILDEN Druckluft-Membranpumpen: Original und Ersatzteile",
  ru: "Насосы WILDEN AODD: оригинальные насосы и запчасти",
  ar: "مضخات WILDEN AODD الأصلية وقطع الغيار",
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return {};
  const [mtTitle, description] = await translateMany([WILDEN_EN.metaTitle, WILDEN_EN.metaDesc], locale);
  const title = HUB_TITLES[locale] ?? mtTitle;
  return {
    title: { absolute: `${title} | Haquan Pump` },
    description,
    alternates: {
      canonical: `/${locale}${WILDEN_HUB_PATH}`,
      languages: localeAlternates(WILDEN_HUB_PATH),
    },
  };
}

export default async function LocalizedWildenHubPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();

  const groups = groupWilden(await getProducts());
  const keys = Object.keys(WILDEN_EN) as (keyof WildenStrings)[];
  const items = groups.flatMap((g) => g.items.map(toCard));
  // Card fields (name + excerpt) for every item in one batched call.
  const [labelValues, cardText] = await Promise.all([
    translateMany(keys.map((k) => WILDEN_EN[k]), locale),
    translateMany(items.flatMap((p) => [p.name, p.excerpt]), locale),
  ]);
  const T = Object.fromEntries(keys.map((k, i) => [k, labelValues[i]])) as WildenStrings;

  let n = 0;
  const translatedGroups = groups.map((g) => ({
    key: g.key,
    items: g.items.map((p) => ({ ...p, name: cardText[n++], excerpt: cardText[n++] })),
  }));
  const { products, series } = wildenCatalogue(translatedGroups, groupNames(T));

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: `/${locale}` },
          { name: T.crumb, path: `/${locale}${WILDEN_HUB_PATH}` },
        ]}
      />
      <WildenHubView
        T={T}
        products={products}
        series={series}
        heroImage={groups.find((g) => g.key === "pumps")?.items[0]?.image}
        hrefBase={`/${locale}`}
        cardLabels={cardLabels(locale)}
      />
    </div>
  );
}
