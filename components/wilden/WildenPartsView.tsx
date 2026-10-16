import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { img } from "@/lib/images";
import {
  WILDEN_HUB_PATH,
  WILDEN_PUMP_MATERIALS,
  WILDEN_SPARES_PATH,
  pumpLookupPath,
  type WildenPumpMaterial,
} from "@/lib/wilden";
import { WILDEN_PUMP_BUILDS } from "@/lib/data/wildenPumps";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Primitives";
import { WildenPartsFilter } from "./WildenPartsFilter";
import { LookupTabs } from "./LookupTabs";

/** English source strings; the localized route translates them as one batch. */
export const PARTS_EN = {
  // Per-material page titles: al = aluminum (the original URL), ss, pp, fe = iron, kv = PVDF.
  alMetaTitle: "WILDEN Aluminum AODD Pump Part Numbers & Build Codes",
  alMetaDesc:
    "Look up genuine WILDEN aluminum AODD pumps by part number or build code: Pro-Flo, Pro-Flo SHIFT and Turbo-Flo models from 1/4\" to 3\", with series, connection and elastomer for each build. Request a quote from Haquan.",
  alTab: "Aluminum",
  ssMetaTitle: "WILDEN Stainless Steel AODD Pump Part Numbers & Build Codes",
  ssMetaDesc:
    "Look up genuine WILDEN stainless steel AODD pumps by part number or build code: Pro-Flo, Pro-Flo SHIFT, FIT and Saniflo builds from 1/4\" to 3\", with series, connection and elastomer for each build. Request a quote from Haquan.",
  ssTab: "Stainless steel",
  ppMetaTitle: "WILDEN Polypropylene AODD Pump Part Numbers & Build Codes",
  ppMetaDesc:
    "Look up genuine WILDEN polypropylene AODD pumps by part number or build code: Pro-Flo and Pro-Flo SHIFT plastic builds from 1/4\" to 3\", with series, connection and elastomer for each build. Request a quote from Haquan.",
  ppTab: "Polypropylene",
  feMetaTitle: "WILDEN Iron AODD Pump Part Numbers & Build Codes",
  feMetaDesc:
    "Look up genuine WILDEN iron AODD pumps by part number or build code: Pro-Flo, Pro-Flo SHIFT and Turbo-Flo builds from 1\" to 4\", with series, connection and elastomer for each build. Request a quote from Haquan.",
  feTab: "Iron",
  kvMetaTitle: "WILDEN PVDF AODD Pump Part Numbers & Build Codes",
  kvMetaDesc:
    "Look up genuine WILDEN PVDF AODD pumps by part number or build code: Pro-Flo and Pro-Flo SHIFT plastic builds from 1/4\" to 3\", with series, connection and elastomer for each build. Request a quote from Haquan.",
  kvTab: "PVDF",
  eyebrow: "Genuine WILDEN",
  title: "WILDEN Part Number Lookup",
  intro:
    "Every WILDEN pump build we can supply, listed by part number and build code: aluminum, stainless steel, polypropylene, iron and PVDF. Pick the body material, then type the code from your pump nameplate or filter by port size, series or elastomer.",
  crumb: "Part numbers",
  hubCrumb: "WILDEN AODD Pumps",
  tabsLabel: "Pump body material",
  search: "Part number or build code, e.g. 08-14814 or XPS830",
  allPorts: "All port sizes",
  allSeries: "All series",
  allElastomers: "All elastomers",
  showing: "Showing",
  of: "of",
  noMatch: "No build matches. Send us the nameplate photo and we will identify it.",
  alsoIn: "Also found in:",
  colPart: "Part No.",
  colModel: "Model",
  colBuild: "Build code",
  colPort: "Port",
  colSeries: "Series",
  colConstruction: "Construction",
  colConnection: "Connection",
  colElastomer: "Elastomer",
  quote: "Quote",
  note:
    "In a build code, the first letter of the second group is the wetted-path material (A aluminum, S stainless steel, P polypropylene, W iron, K PVDF) and the last groups describe the diaphragm, valve ball and valve seat materials. Alloy C and other builds are available on request.",
  spareTitle: "Need spare parts or a repair kit?",
  spareText: "Diaphragms, valve balls and seats, air valves, manifolds, hardware and wet end kits, by WILDEN part number.",
  spareButton: "Spare Parts Lookup",
  ctaTitle: "Can't find your build?",
  ctaText: "Send the full code or a photo of the nameplate. We will confirm the exact configuration and reply within 24 hours.",
  ctaButton: "Request a Quote",
};

export type PartsStrings = typeof PARTS_EN;

const uniq = (xs: string[]) => [...new Set(xs.filter(Boolean))];
const PORT_ORDER = ['1/4"', '1/2"', '1"', '1-1/2"', '2"', '3"', '4"'];

const buildsOf = (m: WildenPumpMaterial) => WILDEN_PUMP_BUILDS.filter((b) => b.material === m.material);

export function pumpPageMeta(T: PartsStrings, m: WildenPumpMaterial) {
  return { title: T[`${m.key}MetaTitle`], description: T[`${m.key}MetaDesc`] };
}

export function WildenPartsView({
  T,
  material,
  hrefBase = "",
}: {
  T: PartsStrings;
  material: WildenPumpMaterial;
  hrefBase?: string;
}) {
  const BUILDS = buildsOf(material);
  const ports = uniq(BUILDS.map((b) => b.port)).sort((a, b) => PORT_ORDER.indexOf(a) - PORT_ORDER.indexOf(b));
  const series = uniq(BUILDS.map((b) => b.series)).sort();
  const elastomers = uniq(BUILDS.map((b) => b.elastomer)).sort();
  const others = WILDEN_PUMP_MATERIALS.filter((m) => m.slug !== material.slug);

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
            tabs={WILDEN_PUMP_MATERIALS.map((m) => ({
              href: `${hrefBase}${pumpLookupPath(m.slug)}`,
              label: T[`${m.key}Tab`],
              count: buildsOf(m).length,
              current: m.slug === material.slug,
            }))}
          />
          <h2 className="mb-4 font-display text-xl font-semibold text-slate-900">{T[`${material.key}MetaTitle`]}</h2>

          <WildenPartsFilter
            tableId="wilden-builds"
            total={BUILDS.length}
            searchCols={[0, 1, 2]}
            selects={[
              { col: 3, all: T.allPorts, options: ports },
              { col: 4, all: T.allSeries, options: series },
              { col: 7, all: T.allElastomers, options: elastomers },
            ]}
            others={others.map((m) => ({
              label: T[`${m.key}Tab`],
              href: `${hrefBase}${pumpLookupPath(m.slug)}`,
              parts: buildsOf(m).map((b) => b.part).join("|"),
            }))}
            labels={{ search: T.search, showing: T.showing, of: T.of, noMatch: T.noMatch, alsoIn: T.alsoIn }}
          />

          {/* Plain rows: styles live on the table and the filter reads cell text,
              because per-row classes/attributes across 600+ rows roughly doubled
              the page weight (ISR writes are billed per 8 KB). */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table
              id="wilden-builds"
              translate="no"
              className="w-full min-w-[960px] text-left text-sm text-slate-600 [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2.5 [&_tbody_tr:nth-child(even)]:bg-slate-50 [&_td:first-child]:font-semibold [&_td:first-child]:text-slate-900 [&_td:nth-child(3)]:font-mono [&_td:nth-child(3)]:text-xs [&_td_a]:font-medium [&_td_a]:text-accent-600 [&_td_a:hover]:underline"
            >
              <thead className="sticky top-0 bg-slate-100 text-slate-900">
                <tr>
                  <th scope="col">{T.colPart}</th>
                  <th scope="col">{T.colModel}</th>
                  <th scope="col">{T.colBuild}</th>
                  <th scope="col">{T.colPort}</th>
                  <th scope="col">{T.colSeries}</th>
                  <th scope="col">{T.colConstruction}</th>
                  <th scope="col">{T.colConnection}</th>
                  <th scope="col">{T.colElastomer}</th>
                  <th scope="col"><span className="sr-only">{T.quote}</span></th>
                </tr>
              </thead>
              <tbody>
                {BUILDS.map((b) => (
                  <tr key={b.part}>
                    <td>{b.part}</td>
                    <td>{b.model}</td>
                    <td>{b.build}</td>
                    <td>{b.port}</td>
                    <td>{b.series}</td>
                    <td>{b.construction}</td>
                    <td>{b.connection}</td>
                    <td>{b.elastomer}</td>
                    <td>
                      <a href={`${hrefBase}/contact?product=WILDEN+${b.part}`}>{T.quote}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">{T.note}</p>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-accent/30 bg-accent/5 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">{T.spareTitle}</h2>
              <p className="mt-1 text-sm text-slate-600">{T.spareText}</p>
            </div>
            <Link href={`${hrefBase}${WILDEN_SPARES_PATH}`} className="btn-primary shrink-0">
              {T.spareButton}
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
