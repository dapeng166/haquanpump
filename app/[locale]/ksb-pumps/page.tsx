import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KSB_HUB_PATH, KSB_PUMPS } from "@/lib/ksb";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { localizeKsb } from "@/lib/i18n/ksb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { KsbHubView } from "@/components/ksb/KsbViews";

type Params = Promise<{ locale: string }>;

// Rendered on first request and then cached. The KSB data lives in code, so
// nothing revalidates these pages until the next deploy.
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return {};
  const { T } = await localizeKsb(locale);
  const path = `/${locale}${KSB_HUB_PATH}`;
  return {
    title: { absolute: `${T.metaTitle} | Haquan Pump` },
    description: T.metaDesc,
    alternates: { canonical: path, languages: localeAlternates(KSB_HUB_PATH) },
    openGraph: {
      title: `${T.metaTitle} | Haquan Pump`,
      description: T.metaDesc,
      url: path,
      images: [{ url: KSB_PUMPS[0].image, width: 720, height: 540, alt: `KSB ${KSB_PUMPS[0].name}` }],
    },
  };
}

export default async function LocalizedKsbHubPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();
  const { T, pumps, valves } = await localizeKsb(locale);

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: `/${locale}` },
          { name: T.crumb, path: `/${locale}${KSB_HUB_PATH}` },
        ]}
      />
      <KsbHubView T={T} pumps={pumps} valves={valves} hrefBase={`/${locale}`} />
    </div>
  );
}
