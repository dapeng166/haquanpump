import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { company } from "@/lib/site";
import { img } from "@/lib/images";
import { WILDEN_PARTS_PATH, WILDEN_SPARES_PATH } from "@/lib/wilden";
import type { ToolPageText, ToolsStrings } from "@/lib/tools/strings";
import { fill } from "@/lib/tools/strings";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { FaqAccordion } from "@/components/support/FaqAccordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const TOOLS_PATH = "/tools";

export type Faq = { q: string; a: string };

/**
 * Shared layout for an engineering tool page: hero, the tool itself, a plain
 * "how it works" explainer and an FAQ — the text is what lets search engines
 * and AI assistants understand (and cite) the page, not just the widget.
 *
 * `path` is the English path; `hrefBase` the locale prefix ("" or "/es").
 */
export function ToolPage({
  path,
  page,
  common,
  tool,
  hrefBase = "",
  lang = "en",
}: {
  path: string;
  page: ToolPageText;
  common: ToolsStrings["common"];
  tool: ReactNode;
  hrefBase?: string;
  lang?: string;
}) {
  const url = `${hrefBase}${path}`;
  const toolsUrl = `${hrefBase}${TOOLS_PATH}`;
  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: page.name,
    url: `${company.url}${url}`,
    description: page.metaDesc,
    inLanguage: lang,
    applicationCategory: "EngineeringApplication",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    publisher: { "@type": "Organization", name: company.name, url: company.url },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  // Trusted copy from lib/tools/strings.ts (or its server-side translation).
  const howItWorks = fill(page.howItWorks, {
    calcHref: `${toolsUrl}/head-calculator`,
    selectorHref: `${toolsUrl}/pump-selector`,
    converterHref: `${toolsUrl}/unit-converter`,
    lookupHref: `${hrefBase}${WILDEN_PARTS_PATH}`,
    sparesHref: `${hrefBase}${WILDEN_SPARES_PATH}`,
  });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: hrefBase || "/" },
          { name: common.eyebrow, path: toolsUrl },
          { name: page.name, path: url },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <PageHero
        eyebrow={common.eyebrow}
        title={page.title}
        intro={page.intro}
        image={img.supportHero}
        breadcrumbs={[{ label: common.eyebrow, href: toolsUrl }, { label: page.name }]}
      />
      {/* Plain sections: Section's own py-20/28 would win over a smaller padding. */}
      <section className="bg-slate-50 py-10 sm:py-14">
        <Container>{tool}</Container>
      </section>
      <section className="py-14 sm:py-20">
        <Container>
          <div
            className="mx-auto max-w-3xl space-y-4 leading-relaxed text-slate-600 [&_h2]:pt-2 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:pt-2 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:mt-1.5 [&_a]:text-accent-600 [&_a]:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-slate-800 [&_code]:[direction:ltr] [&_code]:[unicode-bidi:isolate] [&_strong]:text-slate-900 [&_ul]:list-disc [&_ul]:ps-5"
            dangerouslySetInnerHTML={{ __html: howItWorks }}
          />
        </Container>
      </section>
      <Section className="pt-0">
        <Container>
          <SectionHeading eyebrow={common.faqEyebrow} title={common.faqTitle} />
          <FaqAccordion items={page.faqs} />
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3">
            <Link href={toolsUrl} className="btn-outline">
              {common.allTools}
            </Link>
            <Link href={`${hrefBase}/contact`} className="btn-primary">
              {common.askEngineers}
              <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
