import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { toolStrings } from "@/lib/tools/translateTools";
import { WildenSelector } from "@/components/tools/WildenSelector";
import { ToolPage, TOOLS_PATH } from "@/components/tools/ToolPage";

type Params = Promise<{ locale: string }>;

const PATH = `${TOOLS_PATH}/wilden-pump-selector`;

export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return {};
  const { wilden } = await toolStrings(locale);
  return {
    title: wilden.page.metaTitle,
    description: wilden.page.metaDesc,
    alternates: { canonical: `/${locale}${PATH}`, languages: localeAlternates(PATH) },
  };
}

export default async function LocalizedWildenPumpSelectorPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();
  const t = await toolStrings(locale);
  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <ToolPage
        path={PATH}
        page={t.wilden.page}
        common={t.common}
        hrefBase={`/${locale}`}
        lang={locale}
        tool={<WildenSelector t={t.wilden.ui} hrefBase={`/${locale}`} />}
      />
    </div>
  );
}
