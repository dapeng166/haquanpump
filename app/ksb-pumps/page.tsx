import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, Hash } from "lucide-react";
import { img } from "@/lib/images";
import { KSB_HUB_PATH, KSB_PUMPS, KSB_VALVES, type KsbItem } from "@/lib/ksb";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const TITLE = "Genuine KSB Thermal Oil Pumps, Standard Pumps & Valves";
const DESC =
  "Haquan supplies genuine, original KSB pumps and valves: Etanorm SYT (ETNY), Etanorm RSY, Etabloc SYT (ETBY) thermal oil pumps, Etabloc (ETB) close-coupled pumps, HPK-L hot water pumps, BOA-H bellows valves and BOA-S strainers. Quote by model code, lead time about 6 weeks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: KSB_HUB_PATH },
  openGraph: { title: `${TITLE} | Haquan Pump`, description: DESC, url: KSB_HUB_PATH },
};

const why = [
  {
    icon: BadgeCheck,
    title: "Genuine KSB only",
    text: "Original KSB pumps and valves from KSB's own production, identified by the KSB model code. No copies or look-alikes.",
  },
  {
    icon: Hash,
    title: "Quote by model code",
    text: "Send the model code from the nameplate, for example ETNY 050-032-160, or your flow, head and temperature, and we confirm the right build.",
  },
  {
    icon: Clock,
    title: "About 6 weeks",
    text: "Typical lead time is about 6 weeks from order confirmation, with export packing and shipping arranged by us.",
  },
];

function Spec({ label, value, unit }: { label: string; value: string; unit: string }) {
  if (!value) return null;
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900" translate="no">
        {value} {unit}
      </dd>
    </div>
  );
}

function ItemCard({ item }: { item: KsbItem }) {
  return (
    <div className="glass-card flex h-full flex-col p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl font-bold text-slate-900" translate="no">
          KSB {item.name}
        </h3>
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent-700" translate="no">
          {item.code}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-accent-600">{item.kind}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.summary}</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Spec label="Flow up to" value={item.flow} unit="m³/h" />
        <Spec label="Head up to" value={item.head} unit="m" />
        <Spec label="Temperature up to" value={item.temp} unit="°C" />
        <Spec label="Pressure up to" value={item.pressure} unit="bar" />
      </dl>
      <ul className="mt-4 space-y-1 text-sm text-slate-600">
        {item.uses.map((u) => (
          <li key={u} className="flex gap-2">
            <span className="text-accent-600" aria-hidden>•</span>
            {u}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function KsbHubPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "KSB Pumps", path: KSB_HUB_PATH },
        ]}
      />
      <PageHero
        eyebrow="Genuine KSB"
        title="KSB Pumps & Valves"
        intro="Haquan supplies genuine, original KSB pumps and valves from the German KSB brand: thermal oil pumps, close-coupled standard pumps, hot water pumps, bellows valves and strainers. Send us the model code or your duty point for a quotation."
        image={img.heroSecondary}
        breadcrumbs={[{ label: "KSB Pumps" }]}
      />

      <Section className="pb-0 sm:pb-0">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {why.map((w) => (
              <Reveal key={w.title}>
                <div className="glass-card h-full p-6">
                  <w.icon className="h-6 w-6 text-accent-600" aria-hidden />
                  <h2 className="mt-4 font-display text-lg font-semibold text-slate-900">{w.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Pumps"
            title="KSB pump series"
            subtitle="Thermal oil and hot water pumps for heat transfer systems, plus close-coupled standard pumps for water and HVAC."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {KSB_PUMPS.map((p) => (
              <Reveal key={p.code}>
                <ItemCard item={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <SectionHeading
            eyebrow="Valves"
            title="KSB valves & strainers"
            subtitle="Shut-off valves and strainers for the same steam, thermal oil and hot water lines."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {KSB_VALVES.map((v) => (
              <Reveal key={v.code}>
                <ItemCard item={v} />
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Figures are the maximum values of each KSB type series; the exact rating depends on size, material and
            build. We confirm the model, rating and lead time with every quotation.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <div className="glass-strong flex flex-col items-center justify-between gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-left">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Need a KSB pump or valve?</h2>
                <p className="mt-2 text-slate-600">
                  Send the model code, a nameplate photo or your flow, head and temperature. We reply within 24 hours.
                </p>
              </div>
              <Link href="/contact" className="btn-primary shrink-0">
                Request a Quote
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
