"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Info } from "lucide-react";
import {
  FLOW_UNITS,
  type FlowUnit,
  toM3h,
  DN_SIZES,
  PIPE_MATERIALS,
  FITTINGS,
  type FittingKey,
  systemHead,
  fmt,
} from "@/lib/tools/hydraulics";
import { Field, NumberInput, Select } from "./FormBits";

const MARGIN = 0.1; // recommended safety margin on the calculated head

export function HeadCalculator() {
  const [flow, setFlow] = useState("40");
  const [unit, setUnit] = useState<FlowUnit>("m3h");
  const [staticHead, setStaticHead] = useState("8");
  const [pressure, setPressure] = useState("0");
  const [length, setLength] = useState("60");
  const [dn, setDn] = useState("100");
  const [material, setMaterial] = useState<string>("pe");
  const [fittings, setFittings] = useState<Record<FittingKey, string>>({
    elbow90: "4",
    elbow45: "0",
    gate: "1",
    check: "1",
    tee: "0",
  });

  const q = toM3h(Number(flow), unit);
  const d = Number(dn);
  const valid = q > 0 && d > 0 && Number(length) >= 0;
  const r = valid
    ? systemHead({
        q,
        staticHead: Number(staticHead) || 0,
        pressureBar: Number(pressure) || 0,
        lengthM: Number(length) || 0,
        dMm: d,
        roughnessMm: PIPE_MATERIALS.find((m) => m.value === material)?.roughness ?? 0.045,
        fittings: Object.fromEntries(
          Object.entries(fittings).map(([k, v]) => [k, Number(v) || 0]),
        ) as Record<FittingKey, number>,
      })
    : null;
  const recommended = r ? r.total * (1 + MARGIN) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form
        className="glass-card space-y-5 p-6 hover:shadow-sm lg:col-span-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="font-display text-lg font-bold text-slate-900">Your system</h2>
        <Field label="Flow rate" htmlFor="hc-flow">
          <div className="flex gap-2">
            <NumberInput id="hc-flow" value={flow} onChange={setFlow} min={0} step="any" />
            <Select
              aria-label="Flow unit"
              value={unit}
              onChange={(v) => setUnit(v as FlowUnit)}
              options={FLOW_UNITS}
              className="w-32 shrink-0"
            />
          </div>
        </Field>
        <Field
          label="Static height (m)"
          htmlFor="hc-static"
          hint="Vertical height from the lowest liquid level in the pit to the highest point of discharge."
        >
          <NumberInput id="hc-static" value={staticHead} onChange={setStaticHead} step="any" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Pipe length (m)" htmlFor="hc-length">
            <NumberInput id="hc-length" value={length} onChange={setLength} min={0} step="any" />
          </Field>
          <Field label="Pipe size" htmlFor="hc-dn">
            <Select
              id="hc-dn"
              value={dn}
              onChange={setDn}
              options={DN_SIZES.map((s) => ({ value: String(s), label: `DN${s}` }))}
            />
          </Field>
        </div>
        <Field label="Pipe material" htmlFor="hc-material">
          <Select
            id="hc-material"
            value={material}
            onChange={setMaterial}
            options={PIPE_MATERIALS.map((m) => ({ value: m.value, label: m.label }))}
          />
        </Field>
        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-slate-700">Fittings (quantity)</legend>
          <div className="grid grid-cols-2 gap-3">
            {FITTINGS.map((ft) => (
              <label key={ft.key} className="flex items-center justify-between gap-2 text-sm text-slate-600">
                <span>{ft.label}</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={fittings[ft.key]}
                  onChange={(e) => setFittings((f) => ({ ...f, [ft.key]: e.target.value }))}
                  className="w-16 rounded-lg border border-slate-300 px-2 py-1.5 text-right text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>
            ))}
          </div>
        </fieldset>
        <Field
          label="Pressure required at the outlet (bar)"
          htmlFor="hc-pressure"
          hint="Leave 0 when the pipe discharges freely into a tank, channel or manhole."
        >
          <NumberInput id="hc-pressure" value={pressure} onChange={setPressure} min={0} step="any" />
        </Field>
      </form>

      <div className="space-y-5 lg:col-span-7" aria-live="polite">
        {!r ? (
          <p className="glass-card p-6 text-slate-600 hover:shadow-sm">
            Enter the flow rate and pipe details to calculate the head.
          </p>
        ) : (
          <>
            <div className="glass-card p-6 hover:shadow-sm">
              <p className="text-sm text-slate-500">Recommended pump head (incl. 10% margin)</p>
              <p className="mt-1 font-display text-4xl font-bold text-accent-700">{fmt(recommended)} m</p>
              <p className="mt-1 text-sm text-slate-500">
                Calculated total dynamic head: {fmt(r.total)} m at {fmt(q)} m³/h
              </p>
              <dl className="mt-5 divide-y divide-slate-100 text-sm">
                <Row label="Static height" value={`${fmt(Number(staticHead) || 0)} m`} />
                {r.pressure > 0 ? <Row label="Outlet pressure" value={`${fmt(r.pressure)} m`} /> : null}
                <Row label="Pipe friction loss" value={`${fmt(r.friction)} m`} />
                <Row label="Fittings and exit loss" value={`${fmt(r.minor)} m`} />
                <Row label="Velocity in pipe" value={`${fmt(r.v)} m/s`} />
              </dl>
            </div>

            {r.v < 0.7 ? (
              <Warn>
                The velocity is below 0.7 m/s: solids in sewage may settle in the pipe. Consider a
                smaller pipe size.
              </Warn>
            ) : null}
            {r.v > 3 ? (
              <Warn>
                The velocity is above 3 m/s: friction losses and wear are high. Consider a larger pipe
                size.
              </Warn>
            ) : null}

            <SystemCurve q={q} base={(Number(staticHead) || 0) + r.pressure} k={r.k} />

            <div className="glass-strong flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Find pumps for {fmt(q)} m³/h at {fmt(recommended)} m with the pump selector.
              </p>
              <Link
                href={`/tools/pump-selector?flow=${encodeURIComponent(fmt(q).replace(/,/g, ""))}&head=${encodeURIComponent(
                  fmt(recommended).replace(/,/g, ""),
                )}`}
                className="btn-primary shrink-0"
              >
                Find a pump
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2">
      <dt className="text-slate-600">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function Warn({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/** System curve H = base + k·Q², from 0 to 1.5× the design flow. */
function SystemCurve({ q, base, k }: { q: number; base: number; k: number }) {
  const W = 560, H = 270, L = 48, B = 36, T = 28, R = 16;
  const qMax = q * 1.5;
  const hAt = (x: number) => base + k * x * x;
  const hMax = Math.max(hAt(qMax), 1) * 1.1;
  const sx = (x: number) => L + (x / qMax) * (W - L - R);
  const sy = (y: number) => H - B - (y / hMax) * (H - B - T);
  const pts = Array.from({ length: 41 }, (_, i) => (qMax * i) / 40)
    .map((x) => `${sx(x).toFixed(1)},${sy(hAt(x)).toFixed(1)}`)
    .join(" ");
  const ticks = (max: number) => [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);

  return (
    <figure className="glass-card p-6 hover:shadow-sm">
      <figcaption className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
        System curve
        <span className="font-normal text-slate-500">(head required at each flow)</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="System curve chart">
        {ticks(hMax).map((y) => (
          <g key={`y${y}`}>
            <line x1={L} x2={W - R} y1={sy(y)} y2={sy(y)} stroke="#e2e8f0" />
            <text x={L - 6} y={sy(y) + 4} textAnchor="end" fontSize="11" fill="#64748b">
              {fmt(y)}
            </text>
          </g>
        ))}
        {ticks(qMax).map((x) => (
          <text key={`x${x}`} x={sx(x)} y={H - B + 16} textAnchor="middle" fontSize="11" fill="#64748b">
            {fmt(x)}
          </text>
        ))}
        <text x={W - R} y={H - 4} textAnchor="end" fontSize="11" fill="#475569">Q (m³/h)</text>
        <text x={4} y={12} fontSize="11" fill="#475569">H (m)</text>
        <polyline points={pts} fill="none" stroke="#2563eb" strokeWidth="2.5" />
        <line x1={sx(q)} x2={sx(q)} y1={sy(0)} y2={sy(hAt(q))} stroke="#f59e0b" strokeDasharray="4 4" />
        <circle cx={sx(q)} cy={sy(hAt(q))} r="5" fill="#f59e0b" />
        <text x={sx(q) + 8} y={sy(hAt(q)) - 8} fontSize="12" fontWeight="600" fill="#b45309">
          {fmt(q)} m³/h · {fmt(hAt(q))} m
        </text>
      </svg>
      <p className="mt-3 flex gap-2 text-xs text-slate-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        The pump runs where its own curve crosses this line. Choose a pump whose curve passes
        through or just above the orange point.
      </p>
    </figure>
  );
}
