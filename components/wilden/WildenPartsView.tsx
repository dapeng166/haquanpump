import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { img } from "@/lib/images";
import { WILDEN_HUB_PATH, WILDEN_PARTS_PATH } from "@/lib/wilden";
import { WILDEN_ALUMINUM_BUILDS as BUILDS } from "@/lib/data/wildenAluminum";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Primitives";
import { WildenPartsFilter } from "./WildenPartsFilter";

/** English source strings; the localized route translates them as one batch. */
export const PARTS_EN = {
  metaTitle: "WILDEN Aluminum AODD Pump Part Numbers & Build Codes",
  metaDesc:
    "Look up genuine WILDEN aluminum AODD pumps by part number or build code: Pro-Flo, Pro-Flo SHIFT and Turbo-Flo models from 1/4\" to 3\", with series, connection and elastomer for each build. Request a quote from Haquan.",
  eyebrow: "Genuine WILDEN",
  title: "WILDEN Part Number Lookup",
  intro:
    "Every aluminum WILDEN pump build we can supply, listed by part number and build code. Type the code from your pump nameplate, or filter by port size, series or elastomer.",
  crumb: "Part numbers",
  hubCrumb: "WILDEN AODD Pumps",
  search: "Part number or build code, e.g. 08-14814 or XPS830",
  allPorts: "All port sizes",
  allSeries: "All series",
  allElastomers: "All elastomers",
  showing: "Showing",
  of: "of",
  noMatch: "No build matches. Send us the nameplate photo and we will identify it.",
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
    "Aluminum builds only. Stainless steel, cast iron, Alloy C, polypropylene and PVDF builds are available on request. In a build code, the last groups describe the diaphragm, valve ball and valve seat materials.",
  ctaTitle: "Can't find your build?",
  ctaText: "Send the full code or a photo of the nameplate. We will confirm the exact configuration and reply within 24 hours.",
  ctaButton: "Request a Quote",
};

export type PartsStrings = typeof PARTS_EN;

const uniq = (xs: string[]) => [...new Set(xs.filter(Boolean))];
const PORTS = uniq(BUILDS.map((b) => b.port));
const SERIES = uniq(BUILDS.map((b) => b.series)).sort();
const ELASTOMERS = uniq(BUILDS.map((b) => b.elastomer)).sort();

export function WildenPartsView({ T, hrefBase = "" }: { T: PartsStrings; hrefBase?: string }) {
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
          <WildenPartsFilter
            tableId="wilden-builds"
            total={BUILDS.length}
            ports={PORTS}
            series={SERIES}
            elastomers={ELASTOMERS}
            labels={{
              search: T.search,
              allPorts: T.allPorts,
              allSeries: T.allSeries,
              allElastomers: T.allElastomers,
              showing: T.showing,
              of: T.of,
              noMatch: T.noMatch,
            }}
          />

          {/* Plain rows: styles live on the table and the filter reads cell text,
              because per-row classes/attributes across 637 rows roughly doubled
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
