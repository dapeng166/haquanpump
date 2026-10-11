import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe2, Hash } from "lucide-react";
import type { Product, PumpSeries } from "@/lib/types";
import type { CardLabels } from "@/lib/i18n/uiLabels";
import { img } from "@/lib/images";
import { WILDEN_HUB_PATH, WILDEN_SIZES, type WildenGroupKey } from "@/lib/wilden";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";
import { ProductIndex } from "@/components/products/ProductIndex";
import { ExplorerFallback } from "@/components/products/ExplorerFallback";

/** English source strings; localized routes translate these as one batch. */
export const WILDEN_EN = {
  metaTitle: "Genuine WILDEN AODD Pumps & Spare Parts Supplier",
  metaDesc:
    "Haquan supplies genuine WILDEN air-operated double-diaphragm pumps and spare parts worldwide: Pro-Flo, Pro-Flo SHIFT (XPS) and Turbo-Flo (T-Series) pumps, diaphragms, valve balls and seats, air valves, shafts and repair kits. Quote by part number or build code.",
  eyebrow: "Genuine WILDEN",
  title: "WILDEN AODD Pumps & Spare Parts",
  intro:
    "Haquan is an authorized dealer of genuine WILDEN air-operated double-diaphragm pumps. Send us a part number or pump build code and we will confirm fitment, lead time and export shipping.",
  crumb: "WILDEN AODD Pumps",
  why1Title: "Genuine parts only",
  why1Text: "Every pump and spare part is original WILDEN, identified by its official part number — no copies, no look-alikes.",
  why2Title: "Quote by part number",
  why2Text: "Have the part number or build code from the pump nameplate? That is all we need to confirm the exact configuration.",
  why3Title: "Shipped worldwide",
  why3Text: "Export packing and documentation handled in-house, with one point of contact from quotation to delivery.",
  catalogueEyebrow: "Catalogue",
  catalogueTitle: "WILDEN pumps & spare parts",
  partsNote: "WILDEN spare parts fit WILDEN pumps only — they are not interchangeable with our own QBY diaphragm pumps.",
  filterHeading: "Browse by",
  allLabel: "All WILDEN",
  // A bare "Showing" machine-translates as a noun ("Demostración").
  showing: "Results:",
  of: "of",
  product: "item",
  products: "items",
  empty: "No items to show yet.",
  pumpsTitle: "Pump models",
  partsTitle: "Spare parts",
  rangeTitle: "Series & materials",
  applicationsTitle: "Applications",
  guidesTitle: "Guides & articles",
  sizesEyebrow: "Model range",
  sizesTitle: "WILDEN pump models by port size",
  sizesSubtitle:
    "Find your frame size first, then choose body material and diaphragm. Not sure which one you have? Send us the code on the nameplate.",
  colPort: "Port size",
  colPro: "Pro-Flo / Original",
  colShift: "Pro-Flo SHIFT (XPS)",
  colTurbo: "Turbo-Flo (T-Series)",
  sizesNote: "Port sizes as listed for current WILDEN builds. Other frames available on request.",
  indexHeading: "Full WILDEN index",
  indexHint: "Every WILDEN pump, spare part and article, grouped by category.",
  ctaTitle: "Need a WILDEN pump or part?",
  ctaText: "Send the part number, build code or a nameplate photo — we reply within 24 hours.",
  ctaButton: "Request a Quote",
};

export type WildenStrings = typeof WILDEN_EN;

export const groupNames = (T: WildenStrings): Record<WildenGroupKey, string> => ({
  pumps: T.pumpsTitle,
  parts: T.partsTitle,
  range: T.rangeTitle,
  applications: T.applicationsTitle,
  guides: T.guidesTitle,
});

export function WildenHubView({
  T,
  products,
  series,
  heroImage,
  hrefBase = "",
  cardLabels,
}: {
  T: WildenStrings;
  /** Wilden products re-tagged by hub category (see wildenCatalogue). */
  products: Product[];
  series: PumpSeries[];
  /** A real Wilden product photo from the CMS; stock image as fallback. */
  heroImage?: string;
  /** Locale URL prefix, e.g. "/es". Empty for the English (root) route. */
  hrefBase?: string;
  cardLabels?: CardLabels;
}) {
  const why = [
    { icon: BadgeCheck, title: T.why1Title, text: T.why1Text },
    { icon: Hash, title: T.why2Title, text: T.why2Text },
    { icon: Globe2, title: T.why3Title, text: T.why3Text },
  ];

  return (
    <>
      <PageHero
        eyebrow={T.eyebrow}
        title={T.title}
        intro={T.intro}
        image={heroImage || img.heroSecondary}
        breadcrumbs={[{ label: T.crumb }]}
      />

      {/* Why Haquan */}
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

      {/* Catalogue — same explorer as /products, filtered by hub category */}
      <Section id="catalogue" className="scroll-mt-24">
        <Container>
          <div className="mb-10 max-w-3xl">
            <span className="eyebrow">{T.catalogueEyebrow}</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {T.catalogueTitle}
            </h2>
            <p className="mt-3 text-sm text-slate-500">{T.partsNote}</p>
          </div>
          <Suspense
            fallback={
              <ExplorerFallback products={products} hrefBase={hrefBase} cardLabels={cardLabels} hideSpecs />
            }
          >
          <ProductsExplorer
            products={products}
            series={series}
            basePath={`${hrefBase}${WILDEN_HUB_PATH}`}
            hrefBase={hrefBase}
            cardLabels={cardLabels}
            hideSpecs
            text={{
              filterHeading: T.filterHeading,
              allLabel: T.allLabel,
              showing: T.showing,
              of: T.of,
              product: T.product,
              products: T.products,
              empty: T.empty,
            }}
          />
          </Suspense>
        </Container>
      </Section>

      {/* Model range by port size */}
      <Section className="bg-slate-50">
        <Container>
          <SectionHeading eyebrow={T.sizesEyebrow} title={T.sizesTitle} subtitle={T.sizesSubtitle} />
          <Reveal>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-900">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">{T.colPort}</th>
                    <th scope="col" className="px-5 py-3 font-semibold">{T.colPro}</th>
                    <th scope="col" className="px-5 py-3 font-semibold">{T.colShift}</th>
                    <th scope="col" className="px-5 py-3 font-semibold">{T.colTurbo}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  {WILDEN_SIZES.map((r) => (
                    <tr key={r.port}>
                      <th scope="row" className="whitespace-nowrap px-5 py-3 font-semibold text-slate-900" translate="no">{r.port}</th>
                      <td className="px-5 py-3" translate="no">{r.pro}</td>
                      <td className="px-5 py-3" translate="no">{r.shift}</td>
                      <td className="px-5 py-3" translate="no">{r.turbo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">{T.sizesNote}</p>
          </Reveal>
        </Container>
      </Section>

      {/* CTA + crawlable index of every Wilden link (the explorer paginates) */}
      <Section>
        <Container>
          <Reveal>
            <div className="glass-strong flex flex-col items-center justify-between gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-left">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{T.ctaTitle}</h2>
                <p className="mt-2 text-slate-600">{T.ctaText}</p>
              </div>
              <Link href={`${hrefBase}/contact`} className="btn-primary shrink-0">
                {T.ctaButton}
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
            </div>
          </Reveal>
          <ProductIndex
            products={products}
            series={series}
            basePath={hrefBase}
            labels={{ heading: T.indexHeading, hint: T.indexHint }}
          />
        </Container>
      </Section>
    </>
  );
}
