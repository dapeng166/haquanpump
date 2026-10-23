import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNews } from "@/lib/wordpress";
import { img } from "@/lib/images";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Primitives";
import { NewsGrid } from "@/components/news/NewsGrid";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { translateNewsCard } from "@/lib/i18n/translateNews";
import { translate } from "@/lib/i18n/translate";
import { newsLabels } from "@/lib/i18n/uiLabels";
import { translateMany } from "@/lib/i18n/translate";
import { SERIES_SHORT } from "@/lib/newsSeries";

type Params = Promise<{ locale: string }>;

export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

const EN_EYEBROW = "News & Guides";
const EN_TITLE = "Pump News, Technical Guides & Case Studies";
const EN_INTRO =
  "Company news, technical guides on selection, installation, maintenance and troubleshooting, and real order cases from the Haquan engineering team.";
const EN_DESC =
  "Company news, technical guides and real order case studies from Haquan Pump — practical pump selection, installation, maintenance and troubleshooting advice for buyers worldwide.";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return {};
  const [title, description] = await Promise.all([
    translate(EN_TITLE, locale),
    translate(EN_DESC, locale),
  ]);
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/news`,
      languages: localeAlternates("/news"),
    },
  };
}

export default async function LocalizedNewsPage({
  params,
}: {
  params: Params;
}) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();

  // Cards only need the summary fields; leave the article bodies out.
  const posts = (await getNews()).map((p) => ({ ...p, content: "" }));
  const seriesKeys = Object.keys(SERIES_SHORT);
  const [title, intro, eyebrow, translated, seriesNames] = await Promise.all([
    translate(EN_TITLE, locale),
    translate(EN_INTRO, locale),
    translate(EN_EYEBROW, locale),
    Promise.all(posts.map((p) => translateNewsCard(p, locale))),
    translateMany(seriesKeys.map((k) => SERIES_SHORT[k]), locale),
  ]);
  const seriesLabels = Object.fromEntries(seriesKeys.map((k, i) => [k, seriesNames[i]]));

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        image={img.supportHero}
        breadcrumbs={[{ label: title }]}
      />
      <Section>
        <Container>
          <NewsGrid
            posts={translated}
            hrefBase={`/${locale}`}
            labels={newsLabels(locale)}
            seriesLabels={seriesLabels}
          />
        </Container>
      </Section>
    </div>
  );
}
