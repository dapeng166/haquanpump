import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { img } from "@/lib/images";
import {
  WILDEN_HUB_PATH,
  WILDEN_PARTS_PATH,
  WILDEN_SPARE_CATEGORIES,
  spareLookupPath,
  type WildenSpareCategory,
} from "@/lib/wilden";
import { WILDEN_KITS, WILDEN_SPARE_PARTS, type WildenPart } from "@/lib/data/wildenParts";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Primitives";
import { WildenPartsFilter } from "./WildenPartsFilter";
import { LookupTabs } from "./LookupTabs";

/** English source strings; the localized route translates them as one batch. */
export const SPARES_EN = {
  // Per-category pages, keyed by WILDEN_SPARE_CATEGORIES[].key.
  valvesTab: "Diaphragms, balls & seats",
  valvesMetaTitle: "WILDEN Diaphragms, Valve Balls & Seats by Part Number",
  valvesMetaDesc:
    "Look up genuine WILDEN diaphragms, back-up diaphragms, valve balls, valve seats, gaskets and O-rings by part number, with pump size, material and the pump models each part fits. Request a quote from Haquan.",
  airTab: "Air valves & center section",
  airMetaTitle: "WILDEN Air Valves, End Caps, Shafts & Center Blocks by Part Number",
  airMetaDesc:
    "Look up genuine WILDEN air valve assemblies, end caps, pilot sleeves, muffler plates, center blocks, air chambers, shafts and pistons by part number, with pump size and fitment. Request a quote from Haquan.",
  wetTab: "Manifolds, chambers & clamps",
  wetMetaTitle: "WILDEN Manifolds, Liquid Chambers & Clamp Bands by Part Number",
  wetMetaDesc:
    "Look up genuine WILDEN inlet and discharge manifolds, liquid chambers, T-sections, elbows and clamp bands by part number, with pump size, material and fitment. Request a quote from Haquan.",
  hardwareTab: "Hardware & fittings",
  hardwareMetaTitle: "WILDEN Pump Hardware: Screws, Nuts, Washers & Fittings by Part Number",
  hardwareMetaDesc:
    "Look up genuine WILDEN screws, bolts, studs, nuts, washers, pipe plugs and other pump hardware by part number, with size, material and dimensions. Request a quote from Haquan.",
  kitsTab: "Repair kits",
  kitsMetaTitle: "WILDEN Wet End Kits & Air Repair Kits by Part Number",
  kitsMetaDesc:
    "Look up genuine WILDEN wet end kits and air repair kits by part number, with pump size, diaphragm material and code, and the pump models each kit fits. Request a quote from Haquan.",
  eyebrow: "Genuine WILDEN",
  title: "WILDEN Spare Parts & Kits Lookup",
  intro:
    "Over 2,000 genuine WILDEN spare parts and repair kits, listed by part number. Pick a category, then type the part number or filter by pump size, part type or material.",
  crumb: "Spare parts",
  hubCrumb: "WILDEN AODD Pumps",
  tabsLabel: "Part category",
  search: "Part number or pump model, e.g. 15-2000-07 or P200",
  allSizes: "All pump sizes",
  allTypes: "All part types",
  allMaterials: "All materials",
  showing: "Showing",
  of: "of",
  noMatch: "No part matches. Send us the part number or a photo and we will identify it.",
  alsoIn: "Also found in:",
  colPart: "Part No.",
  colType: "Part type",
  colSize: "Pump size",
  colMaterial: "Material",
  colFits: "Fits / details",
  quote: "Quote",
  note:
    "Pump size is the port size of the pump the part belongs to. In kits, the material column shows the diaphragm material and its code from the pump build code. WILDEN parts fit WILDEN pumps only and are not interchangeable with other diaphragm pumps.",
  pumpTitle: "Looking for a complete pump?",
  pumpText: "Search every WILDEN pump build by part number or build code, in aluminum, stainless steel, polypropylene, iron and PVDF.",
  pumpButton: "Pump Part Number Lookup",
  ctaTitle: "Can't find your part?",
  ctaText: "Send the part number, the pump build code or a photo. We will confirm the right genuine part and reply within 24 hours.",
  ctaButton: "Request a Quote",
};

export type SparesStrings = typeof SPARES_EN;

const SIZE_ORDER = ['1/4"', '1/2"', '1"', '1-1/2"', '2"', '3"', '4"'];
// A range such as 1-1/2"-3" sorts right after its first size.
const sizeRank = (s: string) => {
  const i = SIZE_ORDER.indexOf(s);
  return i >= 0 ? i : SIZE_ORDER.indexOf(s.split('"-')[0] + '"') + 0.5;
};
const uniq = (xs: string[]) => [...new Set(xs.filter(Boolean))];

const mapped = new Set<string>(WILDEN_SPARE_CATEGORIES.flatMap((c) => c.types as readonly string[]));

/** The parts listed on one category page (unmapped types fall into hardware). */
export function partsOf(c: WildenSpareCategory): WildenPart[] {
  if (c.key === "kits") return WILDEN_KITS;
  if (c.key === "hardware") return WILDEN_SPARE_PARTS.filter((p) => !mapped.has(p.type));
  const types = new Set<string>(c.types);
  return WILDEN_SPARE_PARTS.filter((p) => types.has(p.type));
}

export function sparePageMeta(T: SparesStrings, c: WildenSpareCategory) {
  return { title: T[`${c.key}MetaTitle`], description: T[`${c.key}MetaDesc`] };
}

export function WildenSparesView({
  T,
  category,
  hrefBase = "",
}: {
  T: SparesStrings;
  category: WildenSpareCategory;
  hrefBase?: string;
}) {
  const PARTS = partsOf(category);
  const sizes = uniq(PARTS.map((p) => p.size)).sort((a, b) => sizeRank(a) - sizeRank(b));
  const types = uniq(PARTS.map((p) => p.type)).sort();
  const materials = uniq(PARTS.map((p) => p.material)).sort();
  const others = WILDEN_SPARE_CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <>
      <PageHero
        eyebrow={T.eyebrow}
        title={T.title}
        intro={T.intro}
        image={img.heroSecondary}
        breadcrumbs={[{ label: T.hubCrumb, href: `${hrefBase}${WILDEN_HUB_PATH}` }, { label: T.crumb }]}
      />

      <Section className="pt-12 sm:pt-16">
        <Container>
          <LookupTabs
            label={T.tabsLabel}
            tabs={WILDEN_SPARE_CATEGORIES.map((c) => ({
              href: `${hrefBase}${spareLookupPath(c.slug)}`,
              label: T[`${c.key}Tab`],
              count: partsOf(c).length,
              current: c.slug === category.slug,
            }))}
          />
          <h2 className="mb-4 font-display text-xl font-semibold text-slate-900">{T[`${category.key}MetaTitle`]}</h2>

          <WildenPartsFilter
            tableId="wilden-spares"
            total={PARTS.length}
            searchCols={[0, 4]}
            selects={[
              { col: 2, all: T.allSizes, options: sizes },
              { col: 1, all: T.allTypes, options: types },
              { col: 3, all: T.allMaterials, options: materials },
            ]}
            others={others.map((c) => ({
              label: T[`${c.key}Tab`],
              href: `${hrefBase}${spareLookupPath(c.slug)}`,
              parts: partsOf(c).map((p) => p.part).join("|"),
            }))}
            labels={{ search: T.search, showing: T.showing, of: T.of, noMatch: T.noMatch, alsoIn: T.alsoIn }}
          />

          {/* Plain rows, styled from the table: see WildenPartsView. */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table
              id="wilden-spares"
              translate="no"
              className="w-full min-w-[820px] text-left text-sm text-slate-600 [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2.5 [&_tbody_tr:nth-child(even)]:bg-slate-50 [&_td:first-child]:whitespace-nowrap [&_td:first-child]:font-semibold [&_td:first-child]:text-slate-900 [&_td:nth-child(5)]:text-xs [&_td_a]:font-medium [&_td_a]:text-accent-600 [&_td_a:hover]:underline"
            >
              <thead className="sticky top-0 bg-slate-100 text-slate-900">
                <tr>
                  <th scope="col">{T.colPart}</th>
                  <th scope="col">{T.colType}</th>
                  <th scope="col">{T.colSize}</th>
                  <th scope="col">{T.colMaterial}</th>
                  <th scope="col">{T.colFits}</th>
                  <th scope="col"><span className="sr-only">{T.quote}</span></th>
                </tr>
              </thead>
              <tbody>
                {PARTS.map((p) => (
                  <tr key={p.part}>
                    <td>{p.part}</td>
                    <td>{p.type}</td>
                    <td>{p.size}</td>
                    <td>{p.material}</td>
                    <td>{p.fits}</td>
                    <td>
                      <a href={`${hrefBase}/contact?product=WILDEN+${p.part}`}>{T.quote}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">{T.note}</p>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-accent/30 bg-accent/5 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">{T.pumpTitle}</h2>
              <p className="mt-1 text-sm text-slate-600">{T.pumpText}</p>
            </div>
            <Link href={`${hrefBase}${WILDEN_PARTS_PATH}`} className="btn-primary shrink-0">
              {T.pumpButton}
              <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
            </Link>
          </div>

          <div className="glass-strong mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{T.ctaTitle}</h2>
              <p className="mt-2 text-slate-600">{T.ctaText}</p>
            </div>
            <Link href={`${hrefBase}/contact`} className="btn-primary shrink-0">
              {T.ctaButton}
              <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
