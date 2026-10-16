import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { toolStrings } from "@/lib/tools/translateTools";
import { UnitConverter } from "@/components/tools/UnitConverter";
import { ToolPage, TOOLS_PATH } from "@/components/tools/ToolPage";

type Params = Promise<{ locale: string }>;

const PATH = `${TOOLS_PATH}/unit-converter`;

export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return {};
  const { conv } = await toolStrings(locale);
  return {
    title: conv.page.metaTitle,
    description: conv.page.metaDesc,
    alternates: { canonical: `/${locale}${PATH}`, languages: localeAlternates(PATH) },
  };
}

export default async function LocalizedUnitConverterPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();
  const t = await toolStrings(locale);
  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <ToolPage
        path={PATH}
        page={t.conv.page}
        common={t.common}
        hrefBase={`/${locale}`}
        lang={locale}
        tool={<UnitConverter t={t.conv.ui} />}
      />
    </div>
  );
}
