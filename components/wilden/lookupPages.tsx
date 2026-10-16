import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dirForLocale, isIndexableLocale, type IndexableLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { translateMany } from "@/lib/i18n/translate";
import {
  WILDEN_HUB_PATH,
  WILDEN_PUMP_MATERIALS,
  WILDEN_SPARE_CATEGORIES,
  pumpLookupPath,
  spareLookupPath,
} from "@/lib/wilden";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { PARTS_EN, WildenPartsView, pumpPageMeta } from "./WildenPartsView";
import { SPARES_EN, WildenSparesView, sparePageMeta } from "./WildenSparesView";

// Shared route bodies for the split WILDEN lookups (pump builds by material,
// spare parts by category), in English (locale = null) and every indexable
// locale. The data lives in code, not WordPress, so these pages never
// regenerate on a product publish.

type Locale = IndexableLocale | null;

async function translated<T extends Record<string, string>>(en: T, locale: Locale): Promise<T> {
  if (!locale) return en;
  const keys = Object.keys(en) as (keyof T & string)[];
  const values = await translateMany(keys.map((k) => en[k]), locale);
  return Object.fromEntries(keys.map((k, i) => [k, values[i]])) as T;
}

/** Validates the route params; unknown locale or slug is a 404. */
function resolve<S extends { slug: string }>(list: readonly S[], locale: string | null, slug: string) {
  if (locale !== null && !isIndexableLocale(locale)) notFound();
  const item = list.find((x) => x.slug === slug);
  if (!item) notFound();
  return { locale: locale as Locale, item };
}

function meta(locale: Locale, path: string, title: string, description: string): Metadata {
  return {
    title: locale ? { absolute: `${title} | Haquan Pump` } : title,
    description,
    alternates: { canonical: locale ? `/${locale}${path}` : path, languages: localeAlternates(path) },
  };
}

function Shell({ locale, crumbs, children }: { locale: Locale; crumbs: { name: string; path: string }[]; children: React.ReactNode }) {
  const p = locale ? `/${locale}` : "";
  const body = (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: p || "/" }, ...crumbs.map((c) => ({ ...c, path: `${p}${c.path}` }))]} />
      {children}
    </>
  );
  return locale ? <div dir={dirForLocale(locale)} lang={locale}>{body}</div> : body;
}

export async function pumpLookupMetadata(rawLocale: string | null, slug: string): Promise<Metadata> {
  const { locale, item } = resolve(WILDEN_PUMP_MATERIALS, rawLocale, slug);
  const { title, description } = pumpPageMeta(PARTS_EN, item);
  const [t, d] = locale ? await translateMany([title, description], locale) : [title, description];
  return meta(locale, pumpLookupPath(slug), t, d);
}

export async function PumpLookupPage({ locale: rawLocale, slug }: { locale: string | null; slug: string }) {
  const { locale, item } = resolve(WILDEN_PUMP_MATERIALS, rawLocale, slug);
  const T = await translated(PARTS_EN, locale);
  return (
    <Shell
      locale={locale}
      crumbs={[
        { name: T.hubCrumb, path: WILDEN_HUB_PATH },
        { name: T.crumb, path: pumpLookupPath(slug) },
      ]}
    >
      <WildenPartsView T={T} material={item} hrefBase={locale ? `/${locale}` : ""} />
    </Shell>
  );
}

export async function spareLookupMetadata(rawLocale: string | null, slug: string): Promise<Metadata> {
  const { locale, item } = resolve(WILDEN_SPARE_CATEGORIES, rawLocale, slug);
  const { title, description } = sparePageMeta(SPARES_EN, item);
  const [t, d] = locale ? await translateMany([title, description], locale) : [title, description];
  return meta(locale, spareLookupPath(slug), t, d);
}

export async function SpareLookupPage({ locale: rawLocale, slug }: { locale: string | null; slug: string }) {
  const { locale, item } = resolve(WILDEN_SPARE_CATEGORIES, rawLocale, slug);
  const T = await translated(SPARES_EN, locale);
  return (
    <Shell
      locale={locale}
      crumbs={[
        { name: T.hubCrumb, path: WILDEN_HUB_PATH },
        { name: T.crumb, path: spareLookupPath(slug) },
      ]}
    >
      <WildenSparesView T={T} category={item} hrefBase={locale ? `/${locale}` : ""} />
    </Shell>
  );
}
