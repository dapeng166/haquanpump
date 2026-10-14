import Link from "next/link";
import { ArrowRight, Calculator, Gauge } from "lucide-react";
import { img } from "@/lib/images";
import type { ToolsStrings } from "@/lib/tools/strings";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Primitives";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { TOOLS_PATH } from "./ToolPage";

/** The /tools landing page, in English or a locale (`hrefBase` "" or "/es"). */
export function ToolsIndex({ t, hrefBase = "" }: { t: ToolsStrings; hrefBase?: string }) {
  const base = `${hrefBase}${TOOLS_PATH}`;
  const tools = [
    { href: `${base}/pump-selector`, icon: Gauge, title: t.index.selectorTitle, text: t.index.selectorText },
    { href: `${base}/head-calculator`, icon: Calculator, title: t.index.calcTitle, text: t.index.calcText },
  ];
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: hrefBase || "/" },
          { name: t.common.eyebrow, path: base },
        ]}
      />
      <PageHero
        eyebrow={t.common.eyebrow}
        title={t.index.title}
        intro={t.index.intro}
        image={img.supportHero}
        breadcrumbs={[{ label: t.common.eyebrow }]}
      />
      <Section>
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="glass-card group flex flex-col p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent-600 ring-1 ring-accent/20">
                  <tool.icon className="h-6 w-6" aria-hidden />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold text-slate-900">{tool.title}</h2>
                <p className="mt-2 flex-1 text-slate-600">{tool.text}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 group-hover:text-accent-700">
                  {t.index.openTool}
                  <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
