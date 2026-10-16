// WILDEN pump selection: plain rules over the per-family table in
// lib/data/wildenFamilies.ts (PSG figures). Runs in the visitor's browser.
// Material and elastomer scores are general guidance only; the page says we
// confirm compatibility before an order.

import { WILDEN_FAMILIES, type WildenOption } from "@/lib/data/wildenFamilies";

export const WILDEN_LIQUIDS = ["water", "oils", "solvents", "chemicals", "slurry", "food"] as const;
export type WildenLiquid = (typeof WILDEN_LIQUIDS)[number];

export const WILDEN_PORTS = ['1/4"', '1/2"', '1"', '1-1/2"', '2"', '3"', '4"'] as const;
/** Nominal port size in mm, as Wilden quotes it ("51 mm (2")"). */
export const PORT_MM: Record<string, number> = {
  '1/4"': 6, '1/2"': 13, '1"': 25, '1-1/2"': 38, '2"': 51, '3"': 76, '4"': 102,
};

export const WILDEN_MATERIALS = ["Aluminum", "Iron", "Stainless Steel", "Polypropylene", "PVDF"] as const;
export type WildenMaterial = (typeof WILDEN_MATERIALS)[number];

/** Diaphragm groups the guidance is written for; PTFE overlays and GORE count as PTFE. */
export const ELASTOMER_GROUPS = [
  "Santoprene", "Neoprene", "EPDM", "Buna-N", "Bunalast", "Hytrel", "Polyurethane", "FKM", "PTFE",
] as const;
export type ElastomerGroup = (typeof ELASTOMER_GROUPS)[number];

export function elastomerGroup(el: string): ElastomerGroup | null {
  if (el.startsWith("PTFE") || el === "GORE") return "PTFE";
  return (ELASTOMER_GROUPS as readonly string[]).includes(el) ? (el as ElastomerGroup) : null;
}

// 2 = first choice, 1 = usable, 0 = not suggested.
const MATERIAL_FIT: Record<WildenLiquid, Record<WildenMaterial, number>> = {
  water: { Aluminum: 2, Iron: 2, Polypropylene: 2, "Stainless Steel": 1, PVDF: 1 },
  oils: { Aluminum: 2, Iron: 2, "Stainless Steel": 2, PVDF: 1, Polypropylene: 0 },
  solvents: { "Stainless Steel": 2, Aluminum: 1, Iron: 1, PVDF: 1, Polypropylene: 0 },
  chemicals: { Polypropylene: 2, PVDF: 2, "Stainless Steel": 1, Aluminum: 0, Iron: 0 },
  slurry: { Aluminum: 2, Iron: 2, "Stainless Steel": 1, Polypropylene: 1, PVDF: 0 },
  food: { "Stainless Steel": 2, Aluminum: 0, Iron: 0, Polypropylene: 0, PVDF: 0 },
};

const ELASTOMER_FIT: Record<WildenLiquid, Partial<Record<ElastomerGroup, number>>> = {
  water: { Santoprene: 2, Neoprene: 2, EPDM: 2, "Buna-N": 1, Bunalast: 1, Hytrel: 1, Polyurethane: 1, PTFE: 1, FKM: 1 },
  oils: { "Buna-N": 2, Bunalast: 2, FKM: 2, PTFE: 2, Hytrel: 1, Polyurethane: 1 },
  solvents: { PTFE: 2, FKM: 1 },
  chemicals: { PTFE: 2, Santoprene: 2, EPDM: 1, FKM: 1 },
  slurry: { Santoprene: 2, Neoprene: 2, Polyurethane: 2, Hytrel: 1, "Buna-N": 1, EPDM: 1, PTFE: 1 },
  food: { PTFE: 2, Santoprene: 1, EPDM: 1, "Buna-N": 1 },
};

/** Materials and elastomers to suggest for a liquid, in the order the tables list them. */
export function suggestFor(liquid: WildenLiquid) {
  const top = <K extends string>(fit: Partial<Record<K, number>>) =>
    (Object.keys(fit) as K[]).filter((k) => fit[k] === 2);
  return { materials: top(MATERIAL_FIT[liquid]), elastomers: top(ELASTOMER_FIT[liquid]) };
}

export type Connection = "Threaded" | "Flanged" | "Tri-Clamp";
export type Construction = "Clamped" | "Bolted";

export type WildenInput = {
  /** Required flow, L/min. */
  lpm: number;
  port: string | "any";
  liquid: WildenLiquid;
  /** Liquid temperature, °C. */
  tempC: number;
  connection: Connection | "any";
  construction: Construction | "any";
  /** Air supply pressure, bar. */
  airBar: number;
};

export type WildenOptionView = {
  elastomer: string;
  fit: number;
  /** US GPM, 0 = not listed. */
  maxGpm: number;
  maxTempF: number;
  minTempF: number;
  part: string;
  builds: number;
};

export type WildenMatch = {
  model: string;
  port: string;
  series: string;
  material: WildenMaterial;
  construction: string;
  connection: string;
  standard: string;
  maxAirPsi: number;
  solidsIn: number;
  liftFt: number;
  /** [L/min, discharge bar, air bar, Nm³/h] from the PSG curve note, or empty. */
  curve: number[];
  /** Suitable diaphragm options, best first. */
  options: WildenOptionView[];
  /** Max flow of the best option, US GPM (0 = not listed). */
  maxGpm: number;
  /** Required flow ÷ max flow after the air-pressure allowance (0 = unknown). */
  load: number;
  /** Air supply above the pump's max air pressure: a regulator is needed. */
  needsRegulator: boolean;
  materialFit: number;
  score: number;
};

export const GPM_TO_LPM = 3.785411784;
export const BAR_TO_PSI = 14.503774;
export const cToF = (c: number) => (c * 9) / 5 + 32;
export const fToC = (f: number) => ((f - 32) * 5) / 9;

/** Load bands: below COMFORT the pump runs well inside its range. */
export const COMFORT = 0.6;
export const NEAR_LIMIT = 0.85;

export type Band = "comfort" | "high" | "limit" | "unknown";
export function band(load: number): Band {
  if (!load) return "unknown";
  return load <= COMFORT ? "comfort" : load <= NEAR_LIMIT ? "high" : "limit";
}

/**
 * Rank build families for a duty. A family qualifies when its body material
 * and at least one diaphragm suit the liquid and temperature, and the flow
 * fits under its max flow. Max flow is quoted at maximum air pressure, so a
 * lower supply gets a rough allowance (square root of the pressure ratio);
 * the actual duty point always has to be read from the curve.
 */
export function selectWilden(i: WildenInput, limit = 6): WildenMatch[] {
  const tF = cToF(i.tempC);
  const airPsi = i.airBar * BAR_TO_PSI;
  const out: WildenMatch[] = [];

  for (const [model, port, series, material, construction, connection, standard, maxAir, solids, lift, curve, opts] of WILDEN_FAMILIES) {
    if (i.port !== "any" && port !== i.port) continue;
    if (i.connection !== "any" && connection !== i.connection) continue;
    if (i.construction !== "any" && construction !== i.construction) continue;
    const mat = material as WildenMaterial;
    const materialFit = MATERIAL_FIT[i.liquid][mat] ?? 0;
    if (!materialFit) continue;
    if (i.liquid === "food" && connection !== "Tri-Clamp") continue;

    const options = opts
      .map((o: WildenOption) => {
        const g = elastomerGroup(o[0]);
        return {
          elastomer: o[0],
          fit: g ? (ELASTOMER_FIT[i.liquid][g] ?? 0) : 0,
          maxGpm: o[1],
          maxTempF: o[2],
          minTempF: o[3],
          part: o[4],
          builds: o[5],
        };
      })
      .filter((o) => o.fit > 0 && (!o.maxTempF || tF <= o.maxTempF) && (!o.minTempF || tF >= o.minTempF))
      .sort((a, b) => b.fit - a.fit || b.builds - a.builds);
    if (!options.length) continue;

    const maxGpm = Math.max(...options.map((o) => o.maxGpm));
    const allowance = maxAir && airPsi < maxAir ? Math.sqrt(Math.max(airPsi, 1) / maxAir) : 1;
    const load = maxGpm ? i.lpm / (maxGpm * GPM_TO_LPM * allowance) : 0;
    // Unknown max flow: shown only when the visitor picked that port size.
    if (!maxGpm && i.port === "any") continue;
    if (load > 1) continue;

    const flowFit = !load ? 0 : load <= COMFORT ? (load >= 0.3 ? 3 : 3 - (0.3 - load) * 8) : load <= NEAR_LIMIT ? 1.5 : 0;
    const score = materialFit * 3 + options[0].fit * 2 + flowFit + (i.liquid === "slurry" && solids >= 0.25 ? 1 : 0);
    out.push({
      model, port, series, material: mat, construction, connection, standard,
      maxAirPsi: maxAir, solidsIn: solids, liftFt: lift, curve, options, maxGpm, load,
      needsRegulator: !!maxAir && airPsi > maxAir + 0.5,
      materialFit, score,
    });
  }

  out.sort(
    (a, b) =>
      b.score - a.score ||
      WILDEN_PORTS.indexOf(a.port as (typeof WILDEN_PORTS)[number]) - WILDEN_PORTS.indexOf(b.port as (typeof WILDEN_PORTS)[number]) ||
      b.options.reduce((n, o) => n + o.builds, 0) - a.options.reduce((n, o) => n + o.builds, 0),
  );
  // At most two families per model, so the shortlist shows real alternatives.
  const perModel = new Map<string, number>();
  return out
    .filter((m) => {
      const n = perModel.get(m.model) ?? 0;
      perModel.set(m.model, n + 1);
      return n < 2;
    })
    .slice(0, limit);
}
