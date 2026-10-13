"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import {
  FLOW_UNITS,
  type FlowUnit,
  toM3h,
  estimatePower,
  suggestOutlet,
  fmt,
} from "@/lib/tools/hydraulics";
import {
  SERIES,
  type SeriesSpec,
  type Liquid,
  type Install,
  type Material,
  type Drive,
  LIQUID_LABELS,
  INSTALL_LABELS,
  MATERIAL_LABELS,
  DRIVE_LABELS,
} from "@/lib/tools/series";
import { seriesHref } from "@/lib/wilden";
import { matchProducts, type ToolProduct } from "@/lib/tools/catalogue";
import { Field, NumberInput, Select } from "./FormBits";
import { CatalogueMatches } from "./CatalogueMatches";
import { QuickInquiry } from "./QuickInquiry";

interface Match {
  s: SeriesSpec;
  score: number;
}

function code(s: SeriesSpec, dn: number, q: number, h: number, kw: number) {
  if (!s.code) return null;
  const n = (x: number) => String(Math.round(x * 10) / 10);
  return s.code
    .replace("{dn}", String(dn))
    .replace("{q}", n(q))
    .replace("{h}", n(h))
    .replace("{kw}", String(kw));
}

export function PumpSelector({ catalogue }: { catalogue: ToolProduct[] }) {
  const [flow, setFlow] = useState("40");
  const [unit, setUnit] = useState<FlowUnit>("m3h");
  const [head, setHead] = useState("15");
  const [liquid, setLiquid] = useState<Liquid>("sewage");
  const [install, setInstall] = useState<Install | "any">("any");
  const [lift, setLift] = useState("3");
  const [material, setMaterial] = useState<Material | "any">("any");
  const [drive, setDrive] = useState<Drive | "any">("any");

  // Prefill from the head calculator (?flow=&head=). Read after mount so the
  // page itself stays static.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const f = p.get("flow");
    const h = p.get("head");
    if (f && Number(f) > 0) setFlow(f);
    if (h && Number(h) > 0) setHead(h);
  }, []);

  const q = toM3h(Number(flow), unit);
  const h = Number(head);
  const valid = q > 0 && h > 0;
  const liftM = Number(lift) || 0;

  const { matches, notes, eligible } = useMemo(() => {
    const notes: string[] = [];
    const eligible = new Set<string>();
    if (!valid) return { matches: [] as Match[], notes, eligible };
    const out: Match[] = [];
    let liftBlocked = false;
    let rangeBlocked = false;
    for (const s of SERIES) {
      if (drive !== "any" && s.drive !== drive) continue;
      if (install !== "any" && s.install !== install) continue;
      if (material !== "any" && !s.materials.includes(material)) continue;
      if (!s.liquids.includes(liquid)) continue;
      if (s.maxLift !== undefined && (install === "dry" || install === "any") && s.install === "dry" && liftM > s.maxLift) {
        liftBlocked = true;
        continue;
      }
      // Suits the liquid and site; its catalogue products may still match even
      // when the series-level range below does not.
      eligible.add(s.slug);
      if (q < s.flow[0] || q > s.flow[1] || h < s.head[0] || h > s.head[1]) {
        rangeBlocked = true;
        continue;
      }
      let score = 0;
      if (s.best.includes(liquid)) score += 3;
      if (install === "any" && s.install === "submersible") score += 1;
      if (drive === "any" && s.drive === "electric") score += 1;
      out.push({ s, score });
    }
    out.sort((a, b) => b.score - a.score);
    if (liftBlocked)
      notes.push(
        `A suction lift of ${fmt(liftM)} m is more than self-priming pumps can manage (up to 5 m) without an external vacuum system. A submersible or vertical pump avoids suction lift altogether.`,
      );
    if (!out.length && rangeBlocked)
      notes.push(
        "No standard series covers this exact duty with the options chosen. Send us the figures: we can often build a custom model.",
      );
    return { matches: out.slice(0, 3), notes, eligible };
  }, [valid, q, h, liquid, install, material, drive, liftM]);

  // Products from series this tool doesn't know yet (newly added in WordPress)
  // are always allowed, so new lines show up without a code change.
  const known = useMemo(() => new Set(SERIES.map((s) => s.slug)), []);
  const products = useMemo(
    () =>
      valid ? matchProducts(catalogue, q, h, (slug) => eligible.has(slug) || !known.has(slug)) : [],
    [valid, catalogue, q, h, eligible, known],
  );

  const power = valid ? estimatePower(q, h) : null;
  const outlet = valid ? suggestOutlet(q) : null;
  const electric = matches.some((m) => m.s.drive === "electric");

  // Only the choices the visitor actually made ("Not sure / any" is left out).
  const quoteText = valid
    ? "Pump selector: " +
      [
        `${fmt(q)} m³/h at ${fmt(h)} m head`,
        LIQUID_LABELS[liquid],
        install !== "any" &&
          INSTALL_LABELS[install] + (install === "dry" ? `, suction lift ${fmt(liftM)} m` : ""),
        material !== "any" && `material: ${MATERIAL_LABELS[material]}`,
        drive !== "any" && `power: ${DRIVE_LABELS[drive]}`,
        matches[0] && `suggested series: ${matches[0].s.name}`,
      ]
        .filter(Boolean)
        .join("; ")
    : "";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Inputs */}
      <form
        className="glass-card space-y-5 p-6 hover:shadow-sm lg:col-span-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="font-display text-lg font-bold text-slate-900">Your duty point</h2>
        <Field label="Flow rate" htmlFor="ps-flow">
          <div className="flex gap-2">
            <NumberInput id="ps-flow" value={flow} onChange={setFlow} min={0} step="any" />
            <Select
              aria-label="Flow unit"
              value={unit}
              onChange={(v) => setUnit(v as FlowUnit)}
              options={FLOW_UNITS}
              className="w-32 shrink-0"
            />
          </div>
          {unit !== "m3h" && valid ? (
            <p className="mt-1 text-xs text-slate-500">= {fmt(q)} m³/h</p>
          ) : null}
        </Field>
        <Field
          label="Total head (m)"
          htmlFor="ps-head"
          hint={
            <>
              Not sure? Work it out with the{" "}
              <Link href="/tools/head-calculator" className="text-accent-600 underline">
                pump head calculator
              </Link>
              .
            </>
          }
        >
          <NumberInput id="ps-head" value={head} onChange={setHead} min={0} step="any" />
        </Field>
        <Field label="Liquid" htmlFor="ps-liquid">
          <Select
            id="ps-liquid"
            value={liquid}
            onChange={(v) => setLiquid(v as Liquid)}
            options={Object.entries(LIQUID_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </Field>
        <Field label="Installation" htmlFor="ps-install">
          <Select
            id="ps-install"
            value={install}
            onChange={(v) => setInstall(v as Install | "any")}
            options={Object.entries(INSTALL_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </Field>
        {install === "dry" ? (
          <Field label="Suction lift (m)" htmlFor="ps-lift" hint="Height from the lowest liquid level up to the pump inlet.">
            <NumberInput id="ps-lift" value={lift} onChange={setLift} min={0} step="any" />
          </Field>
        ) : null}
        <Field label="Material" htmlFor="ps-material">
          <Select
            id="ps-material"
            value={material}
            onChange={(v) => setMaterial(v as Material | "any")}
            options={Object.entries(MATERIAL_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </Field>
        <Field label="Power available" htmlFor="ps-drive">
          <Select
            id="ps-drive"
            value={drive}
            onChange={(v) => setDrive(v as Drive | "any")}
            options={Object.entries(DRIVE_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </Field>
      </form>

      {/* Results */}
      <div className="space-y-5 lg:col-span-7" aria-live="polite">
        {!valid ? (
          <p className="glass-card p-6 text-slate-600 hover:shadow-sm">
            Enter a flow rate and head to see suitable pumps.
          </p>
        ) : (
          <>
            {power && outlet && electric ? (
              <div className="glass-card p-6 hover:shadow-sm">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Estimate for {fmt(q)} m³/h at {fmt(h)} m
                </h2>
                <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Stat label="Hydraulic power" value={`${fmt(power.hydraulic)} kW`} />
                  <Stat label="Shaft power" value={`≈ ${fmt(power.shaft)} kW`} />
                  <Stat label="Motor" value={`≈ ${power.motor} kW`} strong />
                  <Stat
                    label="Outlet size"
                    value={
                      outlet.range[0] === outlet.range[1]
                        ? `DN${outlet.range[0]}`
                        : `DN${outlet.range[0]}–${outlet.range[1]}`
                    }
                    strong
                  />
                </dl>
                <p className="mt-4 flex gap-2 text-xs text-slate-500">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  Based on a typical pump efficiency of {Math.round(power.efficiency * 100)}% and a
                  15% motor margin. The motor of the final model may be one size larger.
                </p>
              </div>
            ) : null}

            {notes.map((n) => (
              <p key={n} className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {n}
              </p>
            ))}

            {matches.map(({ s }, i) => {
              const c = power && outlet && s.drive === "electric" ? code(s, outlet.best, q, h, power.motor) : null;
              return (
                <article key={s.slug} className="glass-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      {i === 0 ? (
                        <span className="mb-2 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent-700">
                          Best match
                        </span>
                      ) : null}
                      <h3 className="font-display text-lg font-bold text-slate-900">{s.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Series range: {fmt(s.flow[0])}–{fmt(s.flow[1])} m³/h, {fmt(s.head[0])}–{fmt(s.head[1])} m
                      </p>
                    </div>
                    {c ? (
                      <div className="rounded-xl bg-slate-50 px-4 py-2 text-right ring-1 ring-slate-200">
                        <p className="text-xs text-slate-500">Example model</p>
                        <p className="font-mono text-base font-bold text-slate-900">{c}</p>
                      </div>
                    ) : null}
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {s.points.map((pt) => (
                      <li key={pt} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" aria-hidden />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={seriesHref(s.slug)}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700"
                  >
                    View {s.name.split(" ")[0]} pumps
                    <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
                  </Link>
                </article>
              );
            })}

            {products.length ? <CatalogueMatches items={products} /> : null}

            {!matches.length && !products.length ? (
              <QuickInquiry product={quoteText} />
            ) : (
            <div className="glass-strong flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Send us these figures and our engineers will confirm the exact model, curve and price.
              </p>
              <Link href={`/contact?product=${encodeURIComponent(quoteText)}`} className="btn-primary shrink-0">
                Get a quote
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
            </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className={`mt-1 font-display text-lg ${strong ? "font-bold text-accent-700" : "font-semibold text-slate-900"}`}>
        {value}
      </dd>
    </div>
  );
}
