// Unit factors for the converter: each unit's value in the group's base unit
// (m³/h, kPa, kW). Head in metres / feet of water assumes water (ρ = 1000
// kg/m³, standard gravity 9.80665 m/s²), the usual convention for pumps.

export type UnitGroupKey = "flow" | "pressure" | "power";

export type UnitDef = { key: string; symbol: string; factor: number };

export const UNIT_GROUPS: { key: UnitGroupKey; units: UnitDef[] }[] = [
  {
    key: "flow",
    units: [
      { key: "m3h", symbol: "m³/h", factor: 1 },
      { key: "ls", symbol: "L/s", factor: 3.6 },
      { key: "lmin", symbol: "L/min", factor: 0.06 },
      { key: "usgpm", symbol: "US GPM", factor: 0.227124707 },
      { key: "ukgpm", symbol: "UK GPM", factor: 0.272765400 },
    ],
  },
  {
    key: "pressure",
    units: [
      { key: "bar", symbol: "bar", factor: 100 },
      { key: "psi", symbol: "psi", factor: 6.894757293 },
      { key: "kpa", symbol: "kPa", factor: 1 },
      { key: "mpa", symbol: "MPa", factor: 1000 },
      { key: "mwc", symbol: "m H₂O", factor: 9.80665 },
      { key: "ftwc", symbol: "ft H₂O", factor: 9.80665 * 0.3048 },
    ],
  },
  {
    key: "power",
    units: [
      { key: "kw", symbol: "kW", factor: 1 },
      { key: "hp", symbol: "HP", factor: 0.745699872 },
      { key: "ps", symbol: "PS", factor: 0.73549875 },
    ],
  },
];

/** Convert `value` from unit `from` to unit `to` (same group). */
export function convert(value: number, from: UnitDef, to: UnitDef): number {
  return (value * from.factor) / to.factor;
}

/** Up to 5 significant figures, no exponent for everyday magnitudes, no trailing zeros. */
export function fmtUnit(n: number): string {
  if (!Number.isFinite(n)) return "";
  if (n === 0) return "0";
  const a = Math.abs(n);
  if (a >= 1e9 || a < 1e-6) return n.toPrecision(4);
  const digits = Math.max(0, 4 - Math.floor(Math.log10(a)));
  return String(Number(n.toFixed(Math.min(digits, 8))));
}
