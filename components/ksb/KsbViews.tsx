import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, Clock, Hash } from "lucide-react";
import { img } from "@/lib/images";
import { KSB_HUB_PATH, ksbPath, type KsbItem } from "@/lib/ksb";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

/** Every UI string on the KSB hub and detail pages; locale routes translate these. */
export const KSB_EN = {
  metaTitle: "Genuine KSB Thermal Oil Pumps, Standard Pumps & Valves",
  metaDesc:
    "Haquan supplies genuine, original KSB pumps and valves: Etanorm SYT (ETNY), Etanorm RSY, Etabloc SYT (ETBY) thermal oil pumps, Etabloc (ETB) close-coupled pumps, HPK-L hot water pumps, BOA-H bellows valves and BOA-S strainers. Quote by model code, lead time about 6 weeks.",
  eyebrow: "Genuine KSB",
  heroTitle: "KSB Pumps & Valves",
  heroIntro:
    "Haquan supplies genuine, original KSB pumps and valves from the German KSB brand: thermal oil pumps, close-coupled standard pumps, hot water pumps, bellows valves and strainers. Send us the model code or your duty point for a quotation.",
  crumb: "KSB Pumps",
  why1Title: "Genuine KSB only",
  why1Text:
    "Original KSB pumps and valves from KSB's own production, identified by the KSB model code. No copies or look-alikes.",
  why2Title: "Quote by model code",
  why2Text:
    "Send the model code from the nameplate, for example ETNY 050-032-160, or your flow, head and temperature, and we confirm the right build.",
  why3Title: "About 6 weeks, 12-month warranty",
  why3Text:
    "Typical lead time is about 6 weeks from order confirmation, with export packing and shipping arranged by us. Every KSB pump and valve comes with a 12-month warranty.",
  pumpsEyebrow: "KSB pumps",
  pumpsTitle: "KSB pump series",
  pumpsSubtitle:
    "Thermal oil and hot water pumps for heat transfer systems, plus close-coupled standard pumps for water and HVAC.",
  valvesEyebrow: "KSB valves",
  valvesTitle: "KSB valves & strainers",
  valvesSubtitle: "Shut-off valves and strainers for the same steam, thermal oil and hot water lines.",
  hubNote:
    "Figures are the maximum values of each KSB type series; the exact rating depends on size, material and build. We confirm the model, rating and lead time with every quotation.",
  ctaTitle: "Need a KSB pump or valve?",
  ctaText: "Send the model code, a nameplate photo or your flow, head and temperature. We reply within 24 hours.",
  quote: "Request a Quote",
  viewDetails: "View details",
  flowUpTo: "Flow up to",
  headUpTo: "Delivery head up to",
  tempUpTo: "Temperature up to",
  pressureUpTo: "Pressure up to",
  keyData: "Key technical data",
  specSeries: "KSB type series",
  specCode: "Model code prefix",
  specType: "Pump or valve type",
  specPn: "Nominal pressure",
  specDn: "Largest nominal size",
  specFlow: "Maximum flow rate",
  specHead: "Maximum delivery head",
  specPressure: "Maximum working pressure",
  specTemp: "Maximum fluid temperature",
  specNote: "Maximum values of the KSB type series; the rating of each model depends on size, material and build.",
  warranty: "Genuine, original KSB with a 12-month warranty. Typical lead time about 6 weeks from order confirmation.",
  features: "Design features",
  applications: "Typical uses",
  quoteHeading: "What to send for a quote",
  quoteValve1: "Nominal size (DN) and pressure class (PN)",
  quoteValve2: "Body material, if you have a preference",
  quoteValve3: "Fluid and operating temperature",
  quotePump1: "Model code from the nameplate, or your flow rate and head",
  quotePump2: "Fluid (thermal oil type or water) and operating temperature",
  quotePump3: "Motor voltage and frequency",
  quoteQty: "Quantity and delivery country",
  others: "Other KSB pumps & valves",
  allLink: "All KSB pumps & valves",
};

export type KsbStrings = typeof KSB_EN;

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

function ItemCard({ item, T, hrefBase }: { item: KsbItem; T: KsbStrings; hrefBase: string }) {
  return (
    <Link href={`${hrefBase}${ksbPath(item)}`} className="glass-card group flex h-full flex-col p-6 transition hover:border-accent/40">
      <div className="mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-white">
        <Image
          src={item.image}
          alt={`KSB ${item.name} ${item.kind.toLowerCase()}`}
          width={720}
          height={540}
          className="h-full w-full object-contain"
        />
      </div>
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
        <Spec label={T.flowUpTo} value={item.flow} unit="m³/h" />
        <Spec label={T.headUpTo} value={item.head} unit="m" />
        <Spec label={T.tempUpTo} value={item.temp} unit="°C" />
        <Spec label={T.pressureUpTo} value={item.pressure} unit="bar" />
      </dl>
      <ul className="mt-4 space-y-1 text-sm text-slate-600">
        {item.uses.map((u) => (
          <li key={u} className="flex gap-2">
            <span className="text-accent-600" aria-hidden>•</span>
            {u}
          </li>
        ))}
      </ul>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent-600 group-hover:text-accent-700">
        {T.viewDetails}
        <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
      </span>
    </Link>
  );
}

/**
 * KSB hub body. `pumps`/`valves` carry the (possibly translated) item text;
 * `hrefBase` is "" for English or "/es" etc. for a locale route.
 */
export function KsbHubView({
  T,
  pumps,
  valves,
  hrefBase = "",
}: {
  T: KsbStrings;
  pumps: KsbItem[];
  valves: KsbItem[];
  hrefBase?: string;
}) {
  const why = [
    { icon: BadgeCheck, title: T.why1Title, text: T.why1Text },
    { icon: Hash, title: T.why2Title, text: T.why2Text },
    { icon: Clock, title: T.why3Title, text: T.why3Text },
  ];
  return (
    <>
      <PageHero
        eyebrow={T.eyebrow}
        title={T.heroTitle}
        intro={T.heroIntro}
        image={img.heroSecondary}
        breadcrumbs={[{ label: T.crumb }]}
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
          <SectionHeading eyebrow={T.pumpsEyebrow} title={T.pumpsTitle} subtitle={T.pumpsSubtitle} />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pumps.map((p) => (
              <Reveal key={p.code}>
                <ItemCard item={p} T={T} hrefBase={hrefBase} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <SectionHeading eyebrow={T.valvesEyebrow} title={T.valvesTitle} subtitle={T.valvesSubtitle} />
          <div className="grid gap-6 md:grid-cols-2">
            {valves.map((v) => (
              <Reveal key={v.code}>
                <ItemCard item={v} T={T} hrefBase={hrefBase} />
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500">{T.hubNote}</p>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <div className="glass-strong flex flex-col items-center justify-between gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-start">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{T.ctaTitle}</h2>
                <p className="mt-2 text-slate-600">{T.ctaText}</p>
              </div>
              <Link href={`${hrefBase}/contact`} className="btn-primary shrink-0">
                {T.quote}
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

/** KSB series detail body; `items` is the full (translated) list, used for "other series". */
export function KsbDetailView({
  T,
  item,
  items,
  valve,
  hrefBase = "",
}: {
  T: KsbStrings;
  item: KsbItem;
  items: KsbItem[];
  valve: boolean;
  hrefBase?: string;
}) {
  const specs: [string, string][] = [
    [T.specSeries, item.name],
    [T.specCode, item.code],
    [T.specType, item.kind],
    ...(valve
      ? ([
          [T.specPn, item.pn ?? ""],
          [T.specDn, item.dn ?? ""],
        ] as [string, string][])
      : ([
          [T.specFlow, `${item.flow} m³/h`],
          [T.specHead, `${item.head} m`],
          [T.specPressure, `${item.pressure} bar`],
        ] as [string, string][])),
    [T.specTemp, `${item.temp} °C`],
  ];
  const quoteInfo = valve
    ? [T.quoteValve1, T.quoteValve2, T.quoteValve3, T.quoteQty]
    : [T.quotePump1, T.quotePump2, T.quotePump3, T.quoteQty];
  const others = items.filter((i) => i.slug !== item.slug);
  const hub = `${hrefBase}${KSB_HUB_PATH}`;

  return (
    <>
      <PageHero
        eyebrow={T.eyebrow}
        title={item.title}
        intro={item.summary}
        image={img.heroSecondary}
        breadcrumbs={[{ label: T.crumb, href: hub }, { label: item.name }]}
      />

      {/* Photo + key data */}
      <Section>
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="glass-card flex aspect-[4/3] items-center justify-center overflow-hidden bg-white p-6">
                <Image
                  src={item.image}
                  alt={`KSB ${item.name} ${item.kind.toLowerCase()}`}
                  width={720}
                  height={540}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
            </Reveal>
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-slate-900">{T.keyData}</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-start text-sm">
                  <tbody className="divide-y divide-slate-200">
                    {specs.map(([k, v]) => (
                      <tr key={k}>
                        <th scope="row" className="w-1/2 bg-slate-50 px-5 py-3 text-start font-medium text-slate-600">{k}</th>
                        <td className="px-5 py-3 font-semibold text-slate-900" translate="no">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-slate-500">{T.specNote}</p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-4 text-sm text-slate-700">
                <Clock className="h-5 w-5 shrink-0 text-accent-600" aria-hidden />
                {T.warranty}
              </div>
              <Link href={`${hrefBase}/contact`} className="btn-primary mt-6">
                {T.quote}
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Features + applications */}
      <Section className="bg-slate-50">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-slate-900">{T.features}</h2>
              <ul className="mt-5 space-y-3">
                {item.features.map((f) => (
                  <li key={f} className="flex gap-3 text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-slate-900">{T.applications}</h2>
              <ul className="mt-5 space-y-3">
                {item.uses.map((u) => (
                  <li key={u} className="flex gap-3 text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
              <h2 className="mt-10 font-display text-2xl font-bold text-slate-900">{T.quoteHeading}</h2>
              <ul className="mt-5 list-disc space-y-2 ps-5 text-slate-600">
                {quoteInfo.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Other KSB series */}
      <Section>
        <Container>
          <h2 className="font-display text-2xl font-bold text-slate-900">{T.others}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`${hrefBase}${ksbPath(o)}`}
                className="glass-card flex items-center gap-4 p-4 transition hover:border-accent/40"
              >
                <Image
                  src={o.image}
                  alt=""
                  width={96}
                  height={72}
                  className="h-[72px] w-24 shrink-0 rounded-lg bg-white object-contain"
                />
                <div>
                  <p className="font-semibold text-slate-900" translate="no">KSB {o.name}</p>
                  <p className="text-sm text-slate-500">{o.kind}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link href={hub} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent-600 hover:text-accent-700">
            {T.allLink}
            <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
          </Link>
        </Container>
      </Section>
    </>
  );
}
