import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Gauge } from "lucide-react";
import { img } from "@/lib/images";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Primitives";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { TOOLS_PATH } from "@/components/tools/ToolPage";

export const metadata: Metadata = {
  title: "Free Pump Engineering Tools — Pump Selector & Head Calculator",
  description:
    "Free online tools for sewage pump selection: find the right pump type by flow and head, and calculate total dynamic head and friction loss for your pipeline.",
  alternates: { canonical: TOOLS_PATH },
};

const tools = [
  {
    href: `${TOOLS_PATH}/pump-selector`,
    icon: Gauge,
    title: "Pump Selector",
    text: "Enter flow, head, liquid and installation to see which sewage pump types fit, with an estimated motor power, outlet size and example model.",
  },
  {
    href: `${TOOLS_PATH}/head-calculator`,
    icon: Calculator,
    title: "Pump Head Calculator",
    text: "Work out the total dynamic head from static height, pipe length, pipe size and fittings, with friction losses and a system curve.",
  },
];

export default function ToolsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Engineering Tools", path: TOOLS_PATH },
        ]}
      />
      <PageHero
        eyebrow="Engineering Tools"
        title="Free Pump Engineering Tools"
        intro="Size and select a sewage pump in minutes. Free to use, no sign-up, and our engineers are on hand to confirm the final model."
        image={img.supportHero}
        breadcrumbs={[{ label: "Engineering Tools" }]}
      />
      <Section>
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="glass-card group flex flex-col p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent-600 ring-1 ring-accent/20">
                  <t.icon className="h-6 w-6" aria-hidden />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold text-slate-900">{t.title}</h2>
                <p className="mt-2 flex-1 text-slate-600">{t.text}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 group-hover:text-accent-700">
                  Open tool
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
