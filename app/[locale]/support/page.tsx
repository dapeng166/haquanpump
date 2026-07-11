import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, FileText } from "lucide-react";
import { faqs } from "@/lib/data/content";
import { img } from "@/lib/images";
import { getSitePage, acfStr, getDocuments } from "@/lib/wordpress";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion } from "@/components/support/FaqAccordion";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { translate, translateMany } from "@/lib/i18n/translate";

type Params = Promise<{ locale: string }>;

export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

const EN = {
  title: "Technical Support — FAQs, Datasheets & Manuals",
  desc:
    "Haquan technical support: pump-selection FAQs, downloadable catalogues, performance curves, installation manuals and datasheets. Get engineering help within 24 hours.",
  eyebrow: "Technical Support",
  heroTitle: "Sewage Pump Technical Support & Engineering Help",
  intro:
    "Selection advice, technical documentation and after-sales support — so your Haquan pumps are specified, installed and maintained correctly.",
  resourcesEyebrow: "Resources",
  resourcesTitle: "Downloadable Technical Documents",
  resourcesSub: "Catalogues, performance curves, selection guides and datasheets for your records.",
  docsFallbackTitle: "Catalogues & datasheets available on request",
  docsFallbackText: "Tell us your application and we'll send the relevant catalogue, performance curves and datasheets for your pumps.",
  requestDocs: "Request Documents",
  faqEyebrow: "FAQ",
  faqTitle: "Frequently Asked Questions",
  ctaTitle: "Still have a technical question?",
  ctaText: "Our engineering team is ready to help you specify the right pump.",
  contactSupport: "Contact Support",
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return {};
  const [title, description] = await translateMany([EN.title, EN.desc], locale);
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/support`, languages: localeAlternates("/support") },
  };
}

export default async function LocalizedSupportPage({
  params,
}: {
  params: Params;
}) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();

  const [page, documents] = await Promise.all([getSitePage("support"), getDocuments()]);
  const cmsFaqs = [1, 2, 3, 4, 5, 6, 7, 8]
    .map((n) => ({ q: acfStr(page, `faq_${n}_question`), a: acfStr(page, `faq_${n}_answer`) }))
    .filter((f) => f.q && f.a);
  const sourceFaqs = cmsFaqs.length > 0 ? cmsFaqs : faqs;

  const keys = Object.keys(EN) as (keyof typeof EN)[];
  const [labelValues, faqFlat, docTitles, intro] = await Promise.all([
    translateMany(keys.map((k) => EN[k]), locale),
    translateMany(sourceFaqs.flatMap((f) => [f.q, f.a]), locale),
    documents.length ? translateMany(documents.map((d) => d.title), locale) : Promise.resolve([]),
    translate(page?.subtitle || EN.intro, locale),
  ]);
  const T = Object.fromEntries(keys.map((k, i) => [k, labelValues[i]])) as typeof EN;
  const faqItems = sourceFaqs.map((_, i) => ({ q: faqFlat[i * 2], a: faqFlat[i * 2 + 1] }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHero
        eyebrow={T.eyebrow}
        title={T.heroTitle}
        intro={intro}
        image={page?.heroImage || img.supportHero}
        breadcrumbs={[{ label: T.eyebrow }]}
      />

      <Section className="bg-slate-50">
        <Container>
          <SectionHeading eyebrow={T.resourcesEyebrow} title={T.resourcesTitle} subtitle={T.resourcesSub} />
          {documents.length > 0 ? (
            <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
              {documents.map((d, i) => (
                <Reveal key={d.url} index={i % 2} className="h-full">
                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="group flex h-full items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-accent/40 hover:bg-slate-100">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-600 ring-1 ring-accent/20">
                      <FileText className="h-6 w-6" aria-hidden />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium text-slate-900">{docTitles[i] ?? d.title}</span>
                      <span className="text-xs text-slate-400">{d.type} · PDF</span>
                    </span>
                    <Download className="h-5 w-5 text-slate-400 transition-colors group-hover:text-accent-600" aria-hidden />
                  </a>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="mx-auto max-w-2xl">
              <div className="glass-card flex flex-col items-center gap-5 p-8 text-center sm:flex-row sm:text-left">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-600 ring-1 ring-accent/20">
                  <FileText className="h-6 w-6" aria-hidden />
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{T.docsFallbackTitle}</p>
                  <p className="mt-1 text-sm text-slate-600">{T.docsFallbackText}</p>
                </div>
                <Link href={`/${locale}/products`} className="btn-primary shrink-0">
                  {T.requestDocs}
                  <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
                </Link>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow={T.faqEyebrow} title={T.faqTitle} />
          <FaqAccordion items={faqItems} />
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <Reveal>
            <div className="glass-strong flex flex-col items-center justify-between gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-left">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{T.ctaTitle}</h2>
                <p className="mt-2 text-slate-600">{T.ctaText}</p>
              </div>
              <Link href={`/${locale}/products`} className="btn-primary shrink-0">
                {T.contactSupport}
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}
