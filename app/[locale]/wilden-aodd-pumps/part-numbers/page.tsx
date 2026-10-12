import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { translateMany } from "@/lib/i18n/translate";
import { WILDEN_HUB_PATH, WILDEN_PARTS_PATH } from "@/lib/wilden";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import {
  PARTS_EN,
  WildenPartsView,
  type PartsStrings,
} from "@/components/wilden/WildenPartsView";

type Params = Promise<{ locale: string }>;

export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

async function strings(locale: Parameters<typeof translateMany>[1]): Promise<PartsStrings> {
  const keys = Object.keys(PARTS_EN) as (keyof PartsStrings)[];
  const values = await translateMany(keys.map((k) => PARTS_EN[k]), locale);
  return Object.fromEntries(keys.map((k, i) => [k, values[i]])) as PartsStrings;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return {};
  const [title, description] = await translateMany([PARTS_EN.metaTitle, PARTS_EN.metaDesc], locale);
  return {
    title: { absolute: `${title} | Haquan Pump` },
    description,
    alternates: {
      canonical: `/${locale}${WILDEN_PARTS_PATH}`,
      languages: localeAlternates(WILDEN_PARTS_PATH),
    },
  };
}

export default async function LocalizedWildenPartNumbersPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();
  const T = await strings(locale);

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: `/${locale}` },
          { name: T.hubCrumb, path: `/${locale}${WILDEN_HUB_PATH}` },
          { name: T.crumb, path: `/${locale}${WILDEN_PARTS_PATH}` },
        ]}
      />
      <WildenPartsView T={T} hrefBase={`/${locale}`} />
    </div>
  );
}
