import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DESMI_HUB_PATH, DESMI_ITEMS, desmiDetailDescription, desmiPath } from "@/lib/desmi";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { translateMany } from "@/lib/i18n/translate";
import { localizeDesmi } from "@/lib/i18n/desmi";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { DesmiDetailView } from "@/components/desmi/DesmiViews";

type Params = Promise<{ locale: string; slug: string }>;

const find = (slug: string) => DESMI_ITEMS.find((i) => i.slug === slug);

// On-demand ISR like the other locale routes: built on first visit, then cached.
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = find(slug);
  if (!isIndexableLocale(locale) || !item) return {};
  const [{ items }, [description]] = await Promise.all([
    localizeDesmi(locale),
    translateMany([desmiDetailDescription(item)], locale),
  ]);
  const title = items.find((i) => i.slug === slug)?.title ?? item.title;
  const path = `/${locale}${desmiPath(item)}`;
  return {
    title: { absolute: `${title} | Haquan Pump` },
    description,
    alternates: { canonical: path, languages: localeAlternates(desmiPath(item)) },
    openGraph: {
      title: `${title} | Haquan Pump`,
      description,
      url: path,
      images: [{ url: item.image, width: 720, height: 540, alt: title }],
    },
  };
}

export default async function LocalizedDesmiSeriesPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const source = find(slug);
  if (!isIndexableLocale(locale) || !source) notFound();
  const { T, items } = await localizeDesmi(locale);
  const item = items.find((i) => i.slug === slug) ?? source;

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: `/${locale}` },
          { name: T.crumb, path: `/${locale}${DESMI_HUB_PATH}` },
          { name: item.name, path: `/${locale}${desmiPath(item)}` },
        ]}
      />
      <DesmiDetailView T={T} item={item} items={items} hrefBase={`/${locale}`} />
    </div>
  );
}
