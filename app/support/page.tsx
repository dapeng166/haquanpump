import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { TOOLS_EN } from "@/lib/tools/strings";
import { SupportTools } from "@/components/support/SupportTools";
import { supportFaqs } from "@/lib/supportFaqs";
import { img } from "@/lib/images";
import { getSitePage, getDocuments } from "@/lib/wordpress";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion } from "@/components/support/FaqAccordion";
import { DocumentGrid } from "@/components/support/DocumentGrid";
import { AfterSalesSection } from "@/components/support/AfterSalesSection";
import { localeAlternates } from "@/lib/i18n/alternates";

export const metadata: Metadata = {
  title: "Technical Support — FAQs, Datasheets & Manuals",
  description:
    "Haquan technical support: pump-selection FAQs, downloadable catalogues, performance curves, installation manuals and datasheets. Get engineering help within 24 hours.",
  alternates: { canonical: "/support", languages: localeAlternates("/support") },
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

  const faqItems = supportFaqs(page);

  return (
    <>
      <FaqJsonLd items={faqItems} />
      <PageHero
        eyebrow="Technical Support"
        title="Sewage Pump Technical Support & Engineering Help"
        intro={
          page?.subtitle ||
          "Selection advice, technical documentation and after-sales support — so your Haquan pumps are specified, installed and maintained correctly."
        }
        image={page?.heroImage || img.supportHero}
        breadcrumbs={[{ label: "Technical Support" }]}
      />

      {/* Engineering tools */}
      <SupportTools
        t={TOOLS_EN}
        title={TOOLS_EN.index.title}
        subtitle="Free tools to work out your head, convert units and shortlist the right sewage or WILDEN pump before you ask for a quote."
      />

      <AfterSalesSection />

      {/* Downloads — from the WordPress "Documents" section (unlimited) */}
      <Section id="documents" className="scroll-mt-24 bg-slate-50">
        <Container>
          <SectionHeading
            eyebrow="Resources"
            title="Downloadable Technical Documents"
            subtitle="Catalogues, performance curves, selection guides and datasheets for your records."
          />
          {documents.length > 0 ? (
            <DocumentGrid documents={documents} />
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
      <Section id="faq" className="scroll-mt-24">
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
