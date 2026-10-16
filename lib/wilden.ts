import type { Product, PumpSeries } from "@/lib/types";
import { toCard } from "@/lib/cardProduct";

/** WordPress `pump_series` slug that holds every Wilden product and article. */
export const WILDEN_SERIES = "wilden-aodd-pump";

/** The standalone Wilden hub page (keeps product URLs at /products/<slug>). */
export const WILDEN_HUB_PATH = "/wilden-aodd-pumps";

/** Static pump part-number lookup (all PSG pump builds), linked from the hub. */
export const WILDEN_PARTS_PATH = `${WILDEN_HUB_PATH}/part-numbers`;

/**
 * The pump lookup is split into one page per body material to keep each page
 * light. Aluminum stays at the original URL; the others get a sub-path.
 * `material` matches the `material` field in lib/data/wildenPumps.ts.
 */
export const WILDEN_PUMP_MATERIALS = [
  { slug: "", key: "al", material: "Aluminum" },
  { slug: "stainless-steel", key: "ss", material: "Stainless Steel" },
  { slug: "polypropylene", key: "pp", material: "Polypropylene" },
  { slug: "iron", key: "fe", material: "Iron" },
  { slug: "pvdf", key: "kv", material: "PVDF" },
] as const;

export type WildenPumpMaterial = (typeof WILDEN_PUMP_MATERIALS)[number];

export const pumpLookupPath = (slug: string) => (slug ? `${WILDEN_PARTS_PATH}/${slug}` : WILDEN_PARTS_PATH);

/** Static spare parts & kits lookup, split into one page per part category. */
export const WILDEN_SPARES_PATH = `${WILDEN_HUB_PATH}/parts-lookup`;

/**
 * Spare-part categories, each its own page. `types` lists the part types it
 * holds (as in lib/data/wildenParts.ts); a type not listed anywhere falls into
 * "hardware", so a newly regenerated type never disappears. Kits are their
 * own list (WILDEN_KITS), not matched by type.
 */
export const WILDEN_SPARE_CATEGORIES = [
  {
    slug: "",
    key: "valves",
    types: [
      "Diaphragm", "Back-up Diaphragm", "Valve Ball", "Valve Seat", "Valve Seat Retainer", "Valve Seat/Ball Combo",
      "Valve Seat/Flap Combo", "Valve Seat/Mushroom Combo", "Mushroom Valve", "Flap Valve Assembly", "Flap Valve Seat",
      "Flap Valve Hinge", "Flap Valve Retainer", "Ball Cage", "Gasket", "Wet Path O-Ring", "O-Ring",
    ],
  },
  {
    slug: "air-valves",
    key: "air",
    types: [
      "Air Valve Assembly", "Air Valve", "End Cap", "Air Valve Spool Kit", "Air Control Spool", "Pilot Sleeve", "Pilot Plug",
      "Retaining Ring", "Muffler", "Muffler Plate", "Center Block/Section", "Air Chamber", "Shaft", "Piston", "Outer Piston",
      "Guide Ring",
    ],
  },
  {
    slug: "wet-end",
    key: "wet",
    types: [
      "Liquid Chamber", "Manifold (Inlet)", "Manifold (Discharge)", "Manifold (Combo Inlet or Discharge)", "T-Section",
      "Inlet Elbow", "Discharge Elbows", "Elbow", "Clamp Band",
    ],
  },
  { slug: "hardware", key: "hardware", types: [] },
  { slug: "kits", key: "kits", types: [] },
] as const;

export type WildenSpareCategory = (typeof WILDEN_SPARE_CATEGORIES)[number];
export type WildenSpareKey = WildenSpareCategory["key"];

export const spareLookupPath = (slug: string) => (slug ? `${WILDEN_SPARES_PATH}/${slug}` : WILDEN_SPARES_PATH);

/** Every lookup page path (pumps and spare parts), for the sitemap and hreflang. */
export const WILDEN_LOOKUP_PATHS = [
  ...WILDEN_PUMP_MATERIALS.map((m) => pumpLookupPath(m.slug)),
  ...WILDEN_SPARE_CATEGORIES.map((c) => spareLookupPath(c.slug)),
];

/**
 * Where a "browse this series" link should go. Wilden has its own hub and is
 * left out of the /products catalogue, so its series links to the hub.
 */
export function seriesHref(slug: string, hrefBase = ""): string {
  return slug === WILDEN_SERIES
    ? `${hrefBase}${WILDEN_HUB_PATH}`
    : `${hrefBase}/products?series=${slug}`;
}

export type WildenGroupKey = "pumps" | "parts" | "range" | "applications" | "guides";

export type WildenGroup = { key: WildenGroupKey; items: Product[] };

// Classified by slug, first match wins (order matters: a spare-parts article
// mentioning "T15" is a part, not a pump model).
const PARTS =
  /(diaphragms?-(?!pump)|valve-seat|valve-balls|check-balls|gasket|glyd-ring|washer|center-block|shaft|air-valve|repair|spare-parts|air-parts)/;
const PUMPS =
  /^wilden-(p-?\d|t\d|xps\d|xp\d|ps\d|0\d-\d{5}|1-4|1-2|3-8|1-stainless)|^wilden-pump-00-/;
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
  { port: '1"', pro: "P2 · P200 · P220", shift: "XPS220 · XPS230", turbo: "—" },
  { port: '1-1/2"', pro: "P4 · P420 · P430 · PS4 · PS400", shift: "XPS4 · XPS420 · XPS430", turbo: "—" },
  { port: '2"', pro: "P8 · P800 · P820 · P830 · PS8", shift: "XPS8 · XPS820 · XPS830", turbo: "T8" },
  { port: '3"', pro: "PS1530", shift: "XPS15 · XPS1520 · XPS1530", turbo: "T15" },
];
