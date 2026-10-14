import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { toolStrings } from "@/lib/tools/translateTools";
import { ToolsIndex } from "@/components/tools/ToolsIndex";
import { TOOLS_PATH } from "@/components/tools/ToolPage";

type Params = Promise<{ locale: string }>;

// Localized tools render on demand (ISR); discovered via sitemap + hreflang.
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return {};
  const t = await toolStrings(locale);
  return {
    title: t.index.metaTitle,
    description: t.index.metaDesc,
    alternates: { canonical: `/${locale}${TOOLS_PATH}`, languages: localeAlternates(TOOLS_PATH) },
  };
}

export default async function LocalizedToolsPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();
  const t = await toolStrings(locale);
  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <ToolsIndex t={t} hrefBase={`/${locale}`} />
    </div>
  );
}
