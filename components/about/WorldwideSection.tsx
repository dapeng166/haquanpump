import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Where our pumps work" on the About page — replaces the old Milestones
 * timeline, whose 2017–2026 entries were never confirmed (owner, 2026-10-23).
 * Countries are the owner's list; the case cards link only to news posts about
 * real orders and inquiries. Add a country or a case here as new ones happen.
 */
export const EN_WORLDWIDE = {
  eyebrow: "Worldwide",
  title: "Where Haquan Pumps Are Working",
  subtitle: "Our pumps are in service in these countries and more. A few recent jobs:",
  more: "and more",
  readCase: "Read the case",
  countries: ["Dubai, UAE", "Vietnam", "Thailand", "Cyprus", "Chile", "Brazil", "Portugal"],
  cases: [
    {
      place: "Dubai, UAE",
      text: "A custom single-phase sewage pump built for a sewage pit.",
      slug: "custom-single-phase-sewage-pump-dubai-wqd90-7-3",
    },
    {
      place: "Portugal",
      text: "Custom ZW self-priming sewage pumps shipped to a trading partner.",
      slug: "haquan-pump-valve-ships-custom-zw-self-priming-pumps-to-portugal",
    },
    {
      // Owner, 2026-10-23: both Cyprus jobs use Haquan GNWQ cutter pumps. The
      // linked post covers the ship's 440 V, 60 Hz build.
      place: "Cyprus",
      text: "Haquan GNWQ cutter pumps discharge wastewater on a ship and at a farm.",
      slug: "60hz-special-voltage-sewage-pumps",
    },
  ],
};

export type WorldwideLabels = typeof EN_WORLDWIDE;

export function WorldwideSection({ T = EN_WORLDWIDE, hrefBase = "" }: { T?: WorldwideLabels; hrefBase?: string }) {
  return (
    <Section className="bg-slate-50">
      <Container>
        <SectionHeading eyebrow={T.eyebrow} title={T.title} subtitle={T.subtitle} />
        <ul className="flex flex-wrap justify-center gap-3">
          {T.countries.map((c) => (
            <li
              key={c}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              <MapPin className="h-4 w-4 text-accent-600" aria-hidden />
              {c}
            </li>
          ))}
          <li className="inline-flex items-center px-2 py-2 text-sm text-slate-500">{T.more}</li>
        </ul>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {T.cases.map((c, i) => (
            <Reveal key={c.slug} index={i} className="h-full">
              <Link
                href={`${hrefBase}/news/${c.slug}`}
                className="glass-card group flex h-full flex-col p-6 transition-colors hover:border-accent/50"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-accent-600">{c.place}</span>
                <p className="mt-2 flex-1 leading-relaxed text-slate-700">{c.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                  {T.readCase}
                  <ArrowRight className="h-4 w-4 rtl-flip transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
