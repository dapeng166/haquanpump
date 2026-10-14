import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { toolStrings } from "@/lib/tools/translateTools";
import { localizedCatalogue } from "@/lib/tools/localCatalogue";
import { openingMatches } from "@/lib/tools/catalogue";
import { PumpSelector } from "@/components/tools/PumpSelector";
import { ToolPage, TOOLS_PATH } from "@/components/tools/ToolPage";

type Params = Promise<{ locale: string }>;

const PATH = `${TOOLS_PATH}/pump-selector`;

export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return {};
  const { selector } = await toolStrings(locale);
  return {
    title: selector.page.metaTitle,
    description: selector.page.metaDesc,
    alternates: { canonical: `/${locale}${PATH}`, languages: localeAlternates(PATH) },
  };
}

// Only the products listed at the opening duty are embedded (so the first
// render and crawlers see real matches); the selector then fetches the full
// translated catalogue, shared by every visit, from /api/tools/catalogue/[locale].
export default async function LocalizedPumpSelectorPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();
  const [t, catalogue] = await Promise.all([toolStrings(locale), localizedCatalogue(locale)]);
  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <ToolPage
        path={PATH}
        page={t.selector.page}
        common={t.common}
        hrefBase={`/${locale}`}
        lang={locale}
        tool={
          <PumpSelector
            catalogue={openingMatches(catalogue)}
            catalogueUrl={`/api/tools/catalogue/${locale}`}
            t={t.selector.ui}
            hrefBase={`/${locale}`}
          />
        }
      />
    </div>
  );
}
