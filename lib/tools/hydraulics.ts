// Pure hydraulic helpers shared by the pump selector and the head calculator.
// Everything here is plain engineering arithmetic (water at ~20 °C), so the
// tools run entirely in the visitor's browser — no server work, no CMS calls.

export const G = 9.81; // m/s²
export const RHO = 1000; // kg/m³, water / dilute sewage
export const NU = 1.0e-6; // m²/s, kinematic viscosity of water at 20 °C

export type FlowUnit = "m3h" | "ls" | "gpm";

export const FLOW_UNITS: { value: FlowUnit; label: string }[] = [
  { value: "m3h", label: "m³/h" },
  { value: "ls", label: "L/s" },
  { value: "gpm", label: "US GPM" },
];

/** Convert a flow in the given unit to m³/h. */
export function toM3h(value: number, unit: FlowUnit): number {
  if (unit === "ls") return value * 3.6;
  if (unit === "gpm") return value * 0.2271247;
  return value;
}

/** Standard nominal pipe / pump outlet sizes (mm). */
export const DN_SIZES = [25, 32, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500];

/** Standard IEC motor ratings (kW). */
export const MOTOR_KW = [
  0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132,
  160, 185, 200, 250, 280, 315,
];

/** Mean velocity (m/s) of `q` m³/h in a pipe of inner diameter `dMm` mm. */
export function velocity(q: number, dMm: number): number {
  const a = Math.PI * (dMm / 1000) ** 2 / 4;
  return q / 3600 / a;
}

/** Hydraulic (water) power in kW for `q` m³/h against `h` m. */
export function hydraulicKw(q: number, h: number): number {
  return (RHO * G * (q / 3600) * h) / 1000;
}

/**
 * Typical overall efficiency of a non-clog sewage pump by flow. Small pumps
 * with free-passage impellers are far less efficient than large ones; these
 * figures are deliberately conservative so the motor estimate is not undersized.
 */
export function typicalEfficiency(q: number): number {
  if (q < 15) return 0.3;
  if (q < 40) return 0.45;
  if (q < 150) return 0.55;
  if (q < 400) return 0.65;
  return 0.72;
}

export interface PowerEstimate {
  hydraulic: number; // kW
  efficiency: number; // 0–1
  shaft: number; // kW
  motor: number; // kW, next standard rating with ~15 % margin
}

export function estimatePower(q: number, h: number): PowerEstimate {
  const hydraulic = hydraulicKw(q, h);
  const efficiency = typicalEfficiency(q);
  const shaft = hydraulic / efficiency;
  const needed = shaft * 1.15;
  const motor = MOTOR_KW.find((k) => k >= needed) ?? MOTOR_KW[MOTOR_KW.length - 1];
  return { hydraulic, efficiency, shaft, motor };
}

/**
 * Outlet sizes that keep the discharge velocity in the 1.5–3.5 m/s band our
 * pump outlets are sized for, and the single size closest to ~2.5 m/s for the
 * example model code. Sewage pumps are not built below DN50 (solids passage),
 * so `minDn` defaults to 50.
 */
export function suggestOutlet(q: number, minDn = 50): { range: number[]; best: number } {
  const sizes = DN_SIZES.filter((d) => d >= minDn);
  let range = sizes.filter((d) => {
    const v = velocity(q, d);
    return v >= 1.5 && v <= 3.5;
  });
  if (!range.length) range = [sizes.find((d) => velocity(q, d) <= 3.5) ?? sizes[sizes.length - 1]];
  const best = range.reduce((a, b) =>
    Math.abs(velocity(q, a) - 2.5) <= Math.abs(velocity(q, b) - 2.5) ? a : b,
  );
  return { range: [range[0], range[range.length - 1]], best };
}

/** Swamee–Jain explicit approximation of the Colebrook friction factor. */
export function frictionFactor(re: number, roughnessMm: number, dMm: number): number {
  if (re < 2300) return 64 / Math.max(re, 1);
  const rel = roughnessMm / dMm;
  return 0.25 / Math.log10(rel / 3.7 + 5.74 / re ** 0.9) ** 2;
}

export const PIPE_MATERIALS = [
  { value: "pe", label: "PVC / HDPE (plastic)", roughness: 0.0015 },
  { value: "steel", label: "Steel, new", roughness: 0.045 },
  { value: "galv", label: "Galvanised steel", roughness: 0.15 },
  { value: "ci", label: "Cast / ductile iron", roughness: 0.26 },
  { value: "old", label: "Old or corroded steel", roughness: 1.0 },
] as const;

/** Resistance coefficients (K) for common fittings. */
export const FITTINGS = [
  { key: "elbow90", label: "90° elbows", k: 0.9 },
  { key: "elbow45", label: "45° elbows", k: 0.4 },
  { key: "gate", label: "Gate valves (open)", k: 0.2 },
  { key: "check", label: "Swing check valves", k: 2.0 },
  { key: "tee", label: "Tees (flow through branch)", k: 1.8 },
] as const;

export type FittingKey = (typeof FITTINGS)[number]["key"];

export interface HeadInput {
  q: number; // m³/h
  staticHead: number; // m, lowest liquid level to discharge point
  pressureBar: number; // extra pressure required at the outlet, bar (gauge)
  lengthM: number; // discharge pipe length
  dMm: number; // inner diameter
  roughnessMm: number;
  fittings: Record<FittingKey, number>;
}

export interface HeadResult {
  v: number;
  re: number;
  f: number;
  friction: number; // m
  minor: number; // m
  pressure: number; // m
  total: number; // m
  /** Loss coefficient so that dynamic losses = k·Q² (Q in m³/h), for the system curve. */
  k: number;
}

export function systemHead(i: HeadInput): HeadResult {
  const v = velocity(i.q, i.dMm);
  const re = (v * (i.dMm / 1000)) / NU;
  const f = frictionFactor(re, i.roughnessMm, i.dMm);
  const vHead = v ** 2 / (2 * G);
  const friction = f * (i.lengthM / (i.dMm / 1000)) * vHead;
  // Sum of fitting K values plus 1.0 for the exit loss at a free outlet.
  const kSum = FITTINGS.reduce((s, ft) => s + ft.k * (i.fittings[ft.key] || 0), 0) + 1.0;
  const minor = kSum * vHead;
  const pressure = (i.pressureBar * 1e5) / (RHO * G);
  const total = i.staticHead + pressure + friction + minor;
  const k = i.q > 0 ? (friction + minor) / i.q ** 2 : 0;
  return { v, re, f, friction, minor, pressure, total, k };
}

/** Round for display: 2 decimals below 10, 1 below 100, else whole. */
export function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const a = Math.abs(n);
  const d = a < 10 ? 2 : a < 100 ? 1 : 0;
  return n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: 0 });
}
