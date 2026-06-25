import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, FileText, LifeBuoy, Mail, Phone } from "lucide-react";
import { company } from "@/lib/site";
import { downloads, faqs } from "@/lib/data/content";
import { img } from "@/lib/images";
import { getSitePage, acfStr } from "@/lib/wordpress";
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

// FAQ structured data for SEO rich results.
function FaqJsonLd() {
  // Kept in sync with lib/data/content faqs.
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What information do you need to recommend a pump?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Required flow rate (m³/h), total head (m), the medium being pumped, and the power supply. With those we return a sized recommendation and quotation within 24 hours.",
        },
      },
      {
        "@type": "Question",
        name: "What warranty do your pumps carry?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our pumps carry a 12-month warranty against manufacturing defects from the date of shipment, backed by spare parts and engineering support.",
        },
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default async function TechnicalSupportPage() {
  // FAQs, hero and a downloadable PDF are editable via the `support` site_page.
  const page = await getSitePage("support");
  const cmsFaqs = [1, 2]
    .map((n) => ({
      q: acfStr(page, `faq_${n}_question`),
      a: acfStr(page, `faq_${n}_answer`),
    }))
    .filter((f) => f.q && f.a);
  const downloadFile = acfStr(page, "download_file");

  return (
    <>
      <FaqJsonLd />
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

      {/* Quick support channels */}
      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: LifeBuoy, title: "Application Engineering", text: "Send your duty point and medium — we size the right pump and respond within 24 hours.", href: "/contact", cta: "Ask an Engineer" },
              { icon: Phone, title: "Talk to Us", text: company.phone, href: `tel:${company.phoneHref}`, cta: "Call Now" },
              { icon: Mail, title: "Email Support", text: company.email, href: `mailto:${company.email}`, cta: "Email Us" },
            ].map((c, i) => (
              <Reveal key={c.title} index={i} className="h-full">
                <div className="glass-card flex h-full flex-col p-7">
                  <c.icon className="h-8 w-8 text-accent-300" aria-hidden />
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-navy-100/65">{c.text}</p>
                  <Link href={c.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-300 hover:text-accent">
                    {c.cta} <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Downloads */}
      <Section className="bg-charcoal-900/30">
        <Container>
          <SectionHeading
            eyebrow="Resources"
            title="Downloadable Technical Documents"
            subtitle="Catalogues, performance curves, selection guides and datasheets for your records."
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {(downloadFile
              ? [
                  { title: "Haquan Product Brochure", type: "Brochure", size: "PDF", url: downloadFile },
                  ...downloads.map((d) => ({ ...d, url: "#" })),
                ]
              : downloads.map((d) => ({ ...d, url: "#" }))
            ).map((d, i) => (
              <Reveal key={d.title} index={i % 2} className="h-full">
                <a
                  href={d.url}
                  {...(d.url !== "#" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-accent/40 hover:bg-white/[0.05]"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-300 ring-1 ring-accent/20">
                    <FileText className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium text-white">{d.title}</span>
                    <span className="text-xs text-navy-100/45">{d.type} · {d.size}</span>
                  </span>
                  <Download className="h-5 w-5 text-navy-100/40 transition-colors group-hover:text-accent-300" aria-hidden />
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQs */}
      <Section>
        <Container>
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
          <FaqAccordion items={cmsFaqs.length > 0 ? [...cmsFaqs, ...faqs] : undefined} />
        </Container>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <Container>
          <Reveal>
            <div className="glass-strong flex flex-col items-center justify-between gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-left">
              <div>
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  Still have a technical question?
                </h2>
                <p className="mt-2 text-navy-100/65">
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
