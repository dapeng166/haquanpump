import Link from "next/link";
import { ArrowLeftRight, ArrowRight, Calculator, Gauge, Wind } from "lucide-react";
import type { ToolsStrings } from "@/lib/tools/strings";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { TOOLS_PATH } from "@/components/tools/ToolPage";

/**
 * The engineering tools block on the Support page, in English or a locale.
 * Card titles and texts come from the tools' own (hand-checked) strings, and
 * links stay in the visitor's language (`hrefBase` "" or "/es"), which also
 * gives the localized tool pages internal links from their own language.
 */
export function SupportTools({
  t,
  hrefBase = "",
  title,
  subtitle,
}: {
  t: ToolsStrings;
  hrefBase?: string;
  title: string;
  subtitle: string;
}) {
  const base = `${hrefBase}${TOOLS_PATH}`;
  const tools = [
    { href: `${base}/pump-selector`, icon: Gauge, title: t.index.selectorTitle, text: t.index.selectorText },
    { href: `${base}/head-calculator`, icon: Calculator, title: t.index.calcTitle, text: t.index.calcText },
    { href: `${base}/wilden-pump-selector`, icon: Wind, title: t.index.wildenTitle, text: t.index.wildenText },
    { href: `${base}/unit-converter`, icon: ArrowLeftRight, title: t.index.convTitle, text: t.index.convText },
  ];
  return (
    <Section id="tools" className="scroll-mt-24 pb-0 sm:pb-0">
      <Container>
        <SectionHeading eyebrow={t.common.eyebrow} title={title} subtitle={subtitle} />
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="glass-card group flex items-start gap-5 p-6">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-600 ring-1 ring-accent/20">
                <tool.icon className="h-6 w-6" aria-hidden />
              </span>
              <span>
                <span className="block font-display text-lg font-bold text-slate-900">{tool.title}</span>
                <span className="mt-1 block text-sm text-slate-600">{tool.text}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 group-hover:text-accent-700">
                  {t.index.openTool}
                  <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
