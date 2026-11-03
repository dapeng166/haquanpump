import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DESMI_HUB_PATH, DESMI_ITEMS } from "@/lib/desmi";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { localizeDesmi } from "@/lib/i18n/desmi";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { DesmiHubView } from "@/components/desmi/DesmiViews";

type Params = Promise<{ locale: string }>;

// Rendered on first request and then cached. The DESMI data lives in code, so
// nothing revalidates these pages until the next deploy.
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return {};
  const { T } = await localizeDesmi(locale);
  const path = `/${locale}${DESMI_HUB_PATH}`;
  return {
    title: { absolute: `${T.metaTitle} | Haquan Pump` },
    description: T.metaDesc,
    alternates: { canonical: path, languages: localeAlternates(DESMI_HUB_PATH) },
    openGraph: {
      title: `${T.metaTitle} | Haquan Pump`,
      description: T.metaDesc,
      url: path,
      images: [{ url: DESMI_ITEMS[1].image, width: 720, height: 540, alt: `DESMI ${DESMI_ITEMS[1].name}` }],
    },
  };
}

export default async function LocalizedDesmiHubPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();
  const { T, items } = await localizeDesmi(locale);

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: `/${locale}` },
          { name: T.crumb, path: `/${locale}${DESMI_HUB_PATH}` },
        ]}
      />
      <DesmiHubView T={T} items={items} hrefBase={`/${locale}`} />
    </div>
  );
}
