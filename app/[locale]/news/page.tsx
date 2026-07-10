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

type Params = Promise<{ locale: string }>;

export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

const EN_EYEBROW = "Newsroom";
const EN_TITLE = "Sewage Pump News & Engineering Insights";
const EN_INTRO =
  "Product launches, practical pump-selection guides and company updates from the Haquan engineering team.";
const EN_DESC =
  "Product launches, technical guides and company news from Shanghai Haquan Pump — practical pump-selection advice and updates for industrial buyers worldwide.";

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

  const posts = await getNews();
  const [title, intro, eyebrow, translated] = await Promise.all([
    translate(EN_TITLE, locale),
    translate(EN_INTRO, locale),
    translate(EN_EYEBROW, locale),
    Promise.all(posts.map((p) => translateNewsCard(p, locale))),
  ]);

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
          />
        </Container>
      </Section>
    </div>
  );
}
