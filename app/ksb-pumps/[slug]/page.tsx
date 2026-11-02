import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { img } from "@/lib/images";
import { KSB_HUB_PATH, KSB_ITEMS, KSB_VALVES, ksbPath, type KsbItem } from "@/lib/ksb";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

type Params = Promise<{ slug: string }>;

const find = (slug: string) => KSB_ITEMS.find((i) => i.slug === slug);
const isValve = (item: KsbItem) => KSB_VALVES.includes(item);

export const dynamicParams = false;

export function generateStaticParams() {
  return KSB_ITEMS.map((i) => ({ slug: i.slug }));
}

/** One-line spec summary for meta descriptions. */
function specLine(item: KsbItem): string {
  if (isValve(item)) return `${item.pn}, up to ${item.dn}, up to ${item.temp} °C`;
  return `up to ${item.flow} m³/h, ${item.head} m head, ${item.temp} °C and ${item.pressure} bar`;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const item = find((await params).slug);
  if (!item) return {};
  const description = `Genuine, original KSB ${item.name} (${item.code}): ${item.kind.toLowerCase()}, ${specLine(item)}. Quote by model code, lead time about 6 weeks.`;
  return {
    title: item.title,
    description,
    alternates: { canonical: ksbPath(item) },
    openGraph: {
      title: `${item.title} | Haquan Pump`,
      description,
      url: ksbPath(item),
      images: [{ url: item.image, width: 720, height: 540, alt: item.title }],
    },
  };
}

export default async function KsbSeriesPage({ params }: { params: Params }) {
  const item = find((await params).slug);
  if (!item) notFound();
  const valve = isValve(item);

  const specs: [string, string][] = [
    ["KSB type series", item.name],
    ["Model code prefix", item.code],
    ["Type", item.kind],
    ...(valve
      ? ([
          ["Nominal pressure", item.pn ?? ""],
          ["Largest nominal size", item.dn ?? ""],
        ] as [string, string][])
      : ([
          ["Max. flow rate", `${item.flow} m³/h`],
          ["Max. head", `${item.head} m`],
          ["Max. working pressure", `${item.pressure} bar`],
        ] as [string, string][])),
    ["Max. fluid temperature", `${item.temp} °C`],
  ];

  const quoteInfo = valve
    ? [
        "Nominal size (DN) and pressure class (PN)",
        "Body material, if you have a preference",
        "Fluid and operating temperature",
        "Quantity and delivery country",
      ]
    : [
        "Model code from the nameplate, or your flow rate and head",
        "Fluid (thermal oil type or water) and operating temperature",
        "Motor voltage and frequency",
        "Quantity and delivery country",
      ];

  const others = KSB_ITEMS.filter((i) => i.slug !== item.slug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "KSB Pumps", path: KSB_HUB_PATH },
          { name: item.name, path: ksbPath(item) },
        ]}
      />
      <PageHero
        eyebrow="Genuine KSB"
        title={item.title}
        intro={item.summary}
        image={img.heroSecondary}
        breadcrumbs={[{ label: "KSB Pumps", href: KSB_HUB_PATH }, { label: item.name }]}
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
              <h2 className="font-display text-2xl font-bold text-slate-900">Key data</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-200">
                    {specs.map(([k, v]) => (
                      <tr key={k}>
                        <th scope="row" className="w-1/2 bg-slate-50 px-5 py-3 font-medium text-slate-600">{k}</th>
                        <td className="px-5 py-3 font-semibold text-slate-900" translate="no">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Maximum values of the KSB type series; the rating of each model depends on size, material and build.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-4 text-sm text-slate-700">
                <Clock className="h-5 w-5 shrink-0 text-accent-600" aria-hidden />
                Genuine, original KSB. Typical lead time about 6 weeks from order confirmation.
              </div>
              <Link href="/contact" className="btn-primary mt-6">
                Request a Quote
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
              <h2 className="font-display text-2xl font-bold text-slate-900">Design features</h2>
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
              <h2 className="font-display text-2xl font-bold text-slate-900">Main applications</h2>
              <ul className="mt-5 space-y-3">
                {item.uses.map((u) => (
                  <li key={u} className="flex gap-3 text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
              <h2 className="mt-10 font-display text-2xl font-bold text-slate-900">What to send for a quote</h2>
              <ul className="mt-5 list-disc space-y-2 pl-5 text-slate-600">
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
          <h2 className="font-display text-2xl font-bold text-slate-900">Other KSB pumps &amp; valves</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={ksbPath(o)}
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
          <Link href={KSB_HUB_PATH} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent-600 hover:text-accent-700">
            All KSB pumps &amp; valves
            <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
          </Link>
        </Container>
      </Section>
    </>
  );
}
