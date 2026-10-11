import type { Product, PumpSeries } from "@/lib/types";
import { toCard } from "@/lib/cardProduct";

/** WordPress `pump_series` slug that holds every Wilden product and article. */
export const WILDEN_SERIES = "wilden-aodd-pump";

/** The standalone Wilden hub page (keeps product URLs at /products/<slug>). */
export const WILDEN_HUB_PATH = "/wilden-aodd-pumps";

export type WildenGroupKey = "pumps" | "parts" | "range" | "applications" | "guides";

export type WildenGroup = { key: WildenGroupKey; items: Product[] };

// Classified by slug, first match wins (order matters: a spare-parts article
// mentioning "T15" is a part, not a pump model).
const PARTS =
  /(diaphragms?-(?!pump)|valve-seat|valve-balls|check-balls|gasket|glyd-ring|washer|center-block|shaft|air-valve|repair|spare-parts|air-parts)/;
const PUMPS =
  /^wilden-(p-?\d|t\d|xps\d|0\d-\d{5}|1-4|1-2|3-8|1-stainless)|^wilden-pump-00-/;
const GUIDES = /(guide|introduction|principle|advantage|-vs-|how-to|checklist|maintenance-service)/;
const RANGE =
  /(aluminium|aluminum|stainless|polypropylene|pvdf|cast-iron|alloy-c|conductive|ptfe-diaphragm-pump|pro-flo-shift|saniflo|sanitary|advanced-series|original-series|t-series|ps-series|explosion-proof|food-grade)/;
const APPLICATIONS =
  /(-for-|pumps-|application|industry|viscous|viscosity|slurry|wastewater|chemical|oil|food|marine|ink|adhesive|ceramic|semiconductor)/;

function classify(slug: string): WildenGroupKey {
  if (PARTS.test(slug) && !/aodd-pump|diaphragm-pump/.test(slug)) return "parts";
  if (PUMPS.test(slug) && !/-for-/.test(slug)) return "pumps";
  if (GUIDES.test(slug)) return "guides";
  if (/(-for-|industry|application)/.test(slug)) return "applications";
  if (RANGE.test(slug)) return "range";
  if (APPLICATIONS.test(slug)) return "applications";
  return "guides";
}

/**
 * Drop "authorized dealer/distributor" claims from text shown on the hub. The
 * owner doesn't want that claim; older WordPress excerpts still carry it but
 * are already indexed, so they stay as-is and are only cleaned for display here.
 */
export function cleanDealerClaims(text: string): string {
  const DEALER = String.raw`authori[sz]ed\s+(?:wilden\s+)?(?:dealer|distributor)`;
  return text
    .replace(new RegExp(String.raw`\bAs an\s+${DEALER},\s*`, "gi"), "")
    .replace(
      new RegExp(String.raw`\s*(?:[—,]\s*)?(?:(?:pump and spare parts\s+)?stocked\s+)?(?:from|by)\s+an?\s+${DEALER}`, "gi"),
      "",
    )
    .replace(new RegExp(String.raw`\b${DEALER}\s*,?\s*`, "gi"), "")
    .replace(/\s*—\s*Genuine Wilden Dealer\b/gi, " — Genuine Wilden")
    .replace(/\s+,/g, ",")
    .replace(/,\s*\./g, ".")
    .replace(/\.\s*,\s*/g, ". ")
    .replace(/(^|[.!?]\s*)\.+/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim()
    .replace(/(^|[.!?]\s+)([a-z])/g, (_, p: string, c: string) => p + c.toUpperCase());
}

/** Split the Wilden series into hub sections, in display order. */
export function groupWilden(products: Product[]): WildenGroup[] {
  const order: WildenGroupKey[] = ["pumps", "parts", "range", "applications", "guides"];
  const buckets = new Map<WildenGroupKey, Product[]>(order.map((k) => [k, []]));
  for (const p of products) {
    if (p.seriesSlug !== WILDEN_SERIES) continue;
    buckets
      .get(classify(p.slug))!
      .push({ ...p, name: cleanDealerClaims(p.name), excerpt: cleanDealerClaims(p.excerpt) });
  }
  // Items keep the CMS order (newest first), like the products page.
  return order
    .map((key) => ({ key, items: buckets.get(key)! }))
    .filter((g) => g.items.length > 0);
}

/**
 * Re-tag Wilden products with their hub category so the shared products
 * explorer can filter by it (`seriesSlug` = group key, badge = group name).
 * New WordPress posts are classified by slug automatically.
 */
export function wildenCatalogue(
  groups: WildenGroup[],
  groupNames: Record<WildenGroupKey, string>,
): { products: Product[]; series: PumpSeries[] } {
  return {
    products: groups.flatMap((g) =>
      g.items.map((p) => ({ ...toCard(p), seriesSlug: g.key, seriesName: groupNames[g.key] })),
    ),
    series: groups.map((g) => ({ slug: g.key, name: groupNames[g.key], description: "" })),
  };
}

/**
 * Port size of each Wilden frame, as listed for current builds on the PSG
 * store (Wilden's parent company) — the reference the owner chose. Only models
 * actually seen there are included; buyers treat this as a technical reference,
 * so never add a frame here without checking it first.
 */
export const WILDEN_SIZES: { port: string; pro: string; shift: string; turbo: string }[] = [
  { port: '1/4"', pro: "P.025 · PS25", shift: "—", turbo: "—" },
  { port: '1/2"', pro: "P1 · P100", shift: "XPS1", turbo: "—" },
  { port: '1"', pro: "P2 · P200", shift: "XPS220 · XPS230", turbo: "—" },
  { port: '1-1/2"', pro: "P4 · P420 · P430 · PS4 · PS400", shift: "XPS4 · XPS420 · XPS430", turbo: "—" },
  { port: '2"', pro: "P8 · P800 · P820 · P830 · PS8", shift: "XPS8 · XPS820 · XPS830", turbo: "T8" },
  { port: '3"', pro: "PS1530", shift: "XPS15 · XPS1520 · XPS1530", turbo: "T15" },
];
