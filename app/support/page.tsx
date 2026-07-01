import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import { faqs } from "@/lib/data/content";
import { img } from "@/lib/images";
import { getSitePage, acfStr, getDocuments } from "@/lib/wordpress";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion } from "@/components/support/FaqAccordion";

export const metadata: Metadata = {
  title: "Technical Support — FAQs, Datasheets & Manuals",
  description:
    "Haquan technical support: pump-selection FAQs, downloadable catalogues, performance curves, installation manuals and datasheets. Get engineering help within 24 hours.",
  alternates: { canonical: "/support" },
};

// FAQ structured data for SEO rich results — generated from the FAQs shown.
function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default async function TechnicalSupportPage() {
  const [page, documents] = await Promise.all([getSitePage("support"), getDocuments()]);

  // FAQs are editable via the `support` site_page (FAQ 1–8). When any are filled
  // in we show only those; otherwise the curated defaults.
  const cmsFaqs = [1, 2, 3, 4, 5, 6, 7, 8]
    .map((n) => ({
      q: acfStr(page, `faq_${n}_question`),
      a: acfStr(page, `faq_${n}_answer`),
    }))
    .filter((f) => f.q && f.a);
  const faqItems = cmsFaqs.length > 0 ? cmsFaqs : faqs;

  return (
    <>
      <FaqJsonLd items={faqItems} />
      <PageHero
        eyebrow="Technical Support"
        title="Engineering Help When You Need It"
        intro={
          page?.subtitle ||
          "Selection advice, technical documentation and after-sales support — so your Haquan pumps are specified, installed and maintained correctly."
        }
        image={page?.heroImage || img.supportHero}
        breadcrumbs={[{ label: "Technical Support" }]}
      />

      {/* Downloads — from the WordPress "Documents" section (unlimited) */}
      <Section className="bg-slate-50">
        <Container>
          <SectionHeading
            eyebrow="Resources"
            title="Downloadable Technical Documents"
            subtitle="Catalogues, performance curves, selection guides and datasheets for your records."
          />
          {documents.length > 0 ? (
            <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
              {documents.map((d, i) => (
                <Reveal key={d.url} index={i % 2} className="h-full">
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-accent/40 hover:bg-slate-100"
                  >
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-600 ring-1 ring-accent/20">
                      <FileText className="h-6 w-6" aria-hidden />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium text-slate-900">{d.title}</span>
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
                  <p className="font-medium text-slate-900">
                    Catalogues &amp; datasheets available on request
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Tell us your application and we&apos;ll send the relevant catalogue,
                    performance curves and datasheets for your pumps.
                  </p>
                </div>
                <Link href="/contact" className="btn-primary shrink-0">
                  Request Documents
                  <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
                </Link>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>

      {/* FAQs */}
      <Section>
        <Container>
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
          <FaqAccordion items={faqItems} />
        </Container>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <Container>
          <Reveal>
            <div className="glass-strong flex flex-col items-center justify-between gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-left">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                  Still have a technical question?
                </h2>
                <p className="mt-2 text-slate-600">
                  Our engineering team is ready to help you specify the right pump.
                </p>
              </div>
              <Link href="/contact" className="btn-primary shrink-0">
                Contact Support
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
