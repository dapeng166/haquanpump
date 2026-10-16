"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Info, ShieldCheck } from "lucide-react";
import {
  WILDEN_LIQUIDS,
  WILDEN_PORTS,
  PORT_MM,
  GPM_TO_LPM,
  BAR_TO_PSI,
  fToC,
  band,
  elastomerGroup,
  selectWilden,
  suggestFor,
  type WildenLiquid,
  type WildenMatch,
  type Connection,
  type Construction,
} from "@/lib/tools/wilden";
import { WILDEN_HUB_PATH, WILDEN_PUMP_MATERIALS, pumpLookupPath } from "@/lib/wilden";
import { fmt } from "@/lib/tools/hydraulics";
import { fill, ltr, type WildenUi } from "@/lib/tools/strings";
import { Field, NumberInput, Select } from "./FormBits";
import { QuickInquiry } from "./QuickInquiry";

type FlowUnit = "lmin" | "m3h" | "gpm";
const FLOW_UNITS: { value: FlowUnit; label: string }[] = [
  { value: "lmin", label: "L/min" },
  { value: "m3h", label: "m³/h" },
  { value: "gpm", label: "US GPM" },
];
const toLpm = (v: number, u: FlowUnit) => (u === "m3h" ? (v * 1000) / 60 : u === "gpm" ? v * GPM_TO_LPM : v);

const LIQUID_EN: Record<WildenLiquid, string> = {
  water: "water/wastewater",
  oils: "oils & fuels",
  solvents: "solvents",
  chemicals: "acids/alkalis",
  slurry: "slurries & solids",
  food: "food/hygienic",
};

const BAND_STYLE = {
  comfort: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  high: "bg-amber-50 text-amber-800 ring-amber-200",
  limit: "bg-red-50 text-red-700 ring-red-200",
  unknown: "bg-slate-100 text-slate-700 ring-slate-200",
} as const;

const lookupHref = (hrefBase: string, material: string, q: string) => {
  const slug = WILDEN_PUMP_MATERIALS.find((m) => m.material === material)?.slug ?? "";
  return `${hrefBase}${pumpLookupPath(slug)}?q=${encodeURIComponent(q)}`;
};

/** `t` is the UI copy (English, or translated on the server); `hrefBase` the locale prefix. */
export function WildenSelector({ t, hrefBase = "" }: { t: WildenUi; hrefBase?: string }) {
  const [flow, setFlow] = useState("200");
  const [unit, setUnit] = useState<FlowUnit>("lmin");
  const [port, setPort] = useState<string>("any");
  const [liquid, setLiquid] = useState<WildenLiquid>("water");
  const [temp, setTemp] = useState("20");
  const [connection, setConnection] = useState<Connection | "any">("any");
  const [construction, setConstruction] = useState<Construction | "any">("any");
  const [air, setAir] = useState("6");
  const [airUnit, setAirUnit] = useState<"bar" | "psi">("bar");

  const lpm = toLpm(Number(flow), unit);
  const airBar = airUnit === "psi" ? Number(air) / BAR_TO_PSI : Number(air);
  const tempC = temp.trim() === "" ? 20 : Number(temp);
  const valid = lpm > 0 && airBar > 0 && Number.isFinite(tempC);

  const matches = useMemo(
    () => (valid ? selectWilden({ lpm, port, liquid, tempC, connection, construction, airBar }) : []),
    [valid, lpm, port, liquid, tempC, connection, construction, airBar],
  );
  const suggestion = suggestFor(liquid);
  const flowText = `${fmt(lpm)} L/min`;
  // The inquiry's product field always goes to the sales team in English.
  const duty = `${flowText} (${fmt((lpm * 60) / 1000)} m³/h), ${LIQUID_EN[liquid]}, ${fmt(tempC)} °C, air ${fmt(airBar)} bar${
    port !== "any" ? `, port ${port}` : ""
  }${connection !== "any" ? `, ${connection.toLowerCase()}` : ""}${construction !== "any" ? `, ${construction.toLowerCase()}` : ""}`;

  const options = (o: Record<string, string>) => Object.entries(o).map(([value, label]) => ({ value, label }));

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form className="glass-card space-y-5 p-6 hover:shadow-sm lg:col-span-5" onSubmit={(e) => e.preventDefault()}>
        <h2 className="font-display text-lg font-bold text-slate-900">{t.application}</h2>
        <Field label={t.flowRate} htmlFor="ws-flow">
          <div className="flex gap-2">
            <NumberInput id="ws-flow" value={flow} onChange={setFlow} min={0} step="any" />
            <Select
              aria-label={t.flowUnit}
              value={unit}
              onChange={(v) => setUnit(v as FlowUnit)}
              options={FLOW_UNITS}
              className="w-32 shrink-0"
            />
          </div>
          {unit !== "lmin" && lpm > 0 ? (
            <p className="mt-1 text-xs text-slate-500">{ltr(`= ${flowText}`)}</p>
          ) : null}
        </Field>
        <Field label={t.liquid} htmlFor="ws-liquid">
          <Select
            id="ws-liquid"
            value={liquid}
            onChange={(v) => setLiquid(v as WildenLiquid)}
            options={WILDEN_LIQUIDS.map((l) => ({ value: l, label: t.liquids[l] }))}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t.temperature} htmlFor="ws-temp">
            <NumberInput id="ws-temp" value={temp} onChange={setTemp} step="any" />
          </Field>
          <Field label={t.port} htmlFor="ws-port">
            <Select
              id="ws-port"
              value={port}
              onChange={setPort}
              options={[
                { value: "any", label: t.portAny },
                ...WILDEN_PORTS.map((p) => ({ value: p, label: `${p} (${PORT_MM[p]} mm)` })),
              ]}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t.connection} htmlFor="ws-conn">
            <Select
              id="ws-conn"
              value={connection}
              onChange={(v) => setConnection(v as Connection | "any")}
              options={options(t.connections)}
            />
          </Field>
          <Field label={t.construction} htmlFor="ws-cons">
            <Select
              id="ws-cons"
              value={construction}
              onChange={(v) => setConstruction(v as Construction | "any")}
              options={options(t.constructions)}
            />
          </Field>
        </div>
        <p className="-mt-3 text-xs text-slate-500">{t.constructionHint}</p>
        <Field label={t.airPressure} htmlFor="ws-air">
          <div className="flex gap-2">
            <NumberInput id="ws-air" value={air} onChange={setAir} min={0} step="any" />
            <Select
              aria-label={t.airUnit}
              value={airUnit}
              onChange={(v) => {
                const u = v as "bar" | "psi";
                if (u !== airUnit && Number(air) > 0)
                  setAir(String(Math.round((u === "psi" ? Number(air) * BAR_TO_PSI : Number(air) / BAR_TO_PSI) * 10) / 10));
                setAirUnit(u);
              }}
              options={[
                { value: "bar", label: "bar" },
                { value: "psi", label: "psi" },
              ]}
              className="w-24 shrink-0"
            />
          </div>
        </Field>
      </form>

      <div className="min-w-0 space-y-5 lg:col-span-7" aria-live="polite">
        {!valid ? (
          <p className="glass-card p-6 text-slate-600 hover:shadow-sm">{t.empty}</p>
        ) : (
          <>
            <div className="glass-card p-6 hover:shadow-sm">
              <h2 className="font-display text-lg font-bold text-slate-900">
                {t.suggestTitle}: {t.liquids[liquid]}
              </h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-slate-500">{t.bodyLabel}</dt>
                  <dd className="mt-1 font-display text-base font-bold text-accent-700">
                    {suggestion.materials.map((m) => t.materials[m] ?? m).join(" · ")}
                  </dd>
                  <dd className="mt-1 text-sm text-slate-600">{t.reasons[liquid].body}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{t.diaphragmLabel}</dt>
                  <dd className="mt-1 font-display text-base font-bold text-accent-700">
                    {suggestion.elastomers.join(" · ")}
                  </dd>
                  <dd className="mt-1 text-sm text-slate-600">{t.reasons[liquid].diaphragm}</dd>
                </div>
              </dl>
              <p className="mt-4 flex gap-2 text-xs text-slate-500">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {t.compatNote}
              </p>
            </div>

            <p className="flex gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{t.curveNote}</span>
            </p>

            {matches.length ? (
              <>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  {fill(t.shortlistTitle, { q: ltr(flowText) })}
                </h2>
                {matches.map((m, i) => (
                  <MatchCard key={`${m.model}|${m.series}|${m.material}|${m.construction}|${m.connection}`} m={m} best={i === 0} lpm={lpm} duty={duty} t={t} hrefBase={hrefBase} />
                ))}
              </>
            ) : (
              <QuickInquiry
                product={`WILDEN pump selector: ${duty}`}
                message={`${t.inquiry.recommend} ${flowText}, ${t.liquids[liquid]}, ${fmt(tempC)} °C, ${fmt(airBar)} bar`}
                t={t.inquiry}
              />
            )}
            {!matches.length ? (
              <p className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{t.noMatch}</span>
              </p>
            ) : (
              <div className="glass-strong flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">{t.quoteText}</p>
                <Link
                  href={`${hrefBase}/contact?product=${encodeURIComponent(`WILDEN pump selector: ${duty}`)}`}
                  className="btn-primary shrink-0"
                >
                  {t.getQuote}
                  <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
                </Link>
              </div>
            )}
            <Link
              href={`${hrefBase}${WILDEN_HUB_PATH}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700"
            >
              {t.hubLink}
              <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function MatchCard({
  m,
  best,
  lpm,
  duty,
  t,
  hrefBase,
}: {
  m: WildenMatch;
  best: boolean;
  lpm: number;
  duty: string;
  t: WildenUi;
  hrefBase: string;
}) {
  const b = band(m.load);
  const bandText = { comfort: t.bandComfort, high: t.bandHigh, limit: t.bandLimit, unknown: t.bandUnknown }[b];
  const top = m.options[0];
  const maxLpm = m.maxGpm * GPM_TO_LPM;
  const tempRange =
    top.maxTempF > 0
      ? `${Math.round(fToC(top.minTempF))} … ${Math.round(fToC(top.maxTempF))} °C`
      : "—";
  const [cq, cp, cair, cnm3] = m.curve;
  const conn = `${t.connections[m.connection] ?? m.connection}${m.standard && m.standard !== m.connection ? ` (${m.standard})` : ""}`;
  // Example parts: the suggested diaphragm first, then other suitable ones.
  const examples = m.options.slice(0, 3);

  return (
    <article className="glass-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {best ? (
            <span className="mb-2 me-2 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent-700">
              {t.bestMatch}
            </span>
          ) : null}
          <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${BAND_STYLE[b]}`}>
            {bandText}
          </span>
          {/* Model and series are Latin names: one left-to-right run in every language. */}
          <h3 className="font-display text-lg font-bold text-slate-900">
            <bdi dir="ltr">
              WILDEN {m.model}
              <span className="font-normal text-slate-500"> · {m.series}</span>
            </bdi>
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {ltr(`${m.port} (${PORT_MM[m.port]} mm)`)} · {t.materials[m.material] ?? m.material} ·{" "}
            {t.constructions[m.construction] ?? m.construction} · {conn}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat
          label={t.statMaxFlow}
          value={m.maxGpm ? `${fmt(maxLpm)} L/min` : "—"}
          sub={m.maxGpm ? `${fmt((maxLpm * 60) / 1000)} m³/h · ${fmt(m.maxGpm)} GPM` : undefined}
        />
        <Stat
          label={t.statLoad}
          value={`${fmt(lpm)} L/min`}
          sub={m.load ? fill(t.loadOf, { p: ltr(`≈ ${Math.round(m.load * 100)}%`) }) : undefined}
          rawSub
        />
        <Stat
          label={t.statAir}
          value={m.maxAirPsi ? `${fmt(m.maxAirPsi / BAR_TO_PSI)} bar` : "—"}
          sub={m.maxAirPsi ? `${m.maxAirPsi} psi` : undefined}
        />
        <Stat label={t.statSolids} value={m.solidsIn ? `${fmt(m.solidsIn * 25.4)} mm` : "—"} />
        <Stat label={t.statLift} value={m.liftFt ? `${fmt(m.liftFt * 0.3048)} m` : "—"} />
        <Stat label={t.statTemp} value={tempRange} sub={top.elastomer} />
      </dl>

      {cq ? (
        <p className="mt-4 text-xs text-slate-500">
          {fill(t.curveExample, {
            q: ltr(`${fmt(cq)} L/min`),
            p: ltr(`${fmt(cp)} bar`),
            air: ltr(`${fmt(cair)} bar`),
            nm3: ltr(`${fmt(cnm3)} Nm³/h`),
          })}
        </p>
      ) : null}
      {m.needsRegulator ? (
        <p className="mt-3 flex gap-2 text-xs text-amber-800">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          {t.regulator}
        </p>
      ) : null}

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.diaphragms}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {m.options.map((o, i) => (
            <li
              key={o.elastomer}
              title={t.elastomerNotes[elastomerGroup(o.elastomer) ?? ""] ?? undefined}
              className={`rounded-full px-2.5 py-1 text-xs ring-1 ${
                i === 0 ? "bg-accent/10 font-semibold text-accent-700 ring-accent/30" : "bg-white text-slate-700 ring-slate-200"
              }`}
            >
              {o.elastomer}
              {i === 0 ? ` · ${t.suggested}` : ""}
            </li>
          ))}
        </ul>
        {t.elastomerNotes[elastomerGroup(top.elastomer) ?? ""] ? (
          <p className="mt-2 text-sm text-slate-600">
            <strong className="text-slate-900">{top.elastomer}:</strong>{" "}
            {t.elastomerNotes[elastomerGroup(top.elastomer) ?? ""]}
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.examples}</p>
        <ul className="mt-2 divide-y divide-slate-100 text-sm">
          {examples.map((o) => (
            <li key={o.part} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2">
              <span className="min-w-0">
                <Link
                  href={lookupHref(hrefBase, m.material, o.part)}
                  className="font-mono font-semibold text-accent-700 underline decoration-accent/30 underline-offset-2 hover:text-accent-800"
                  dir="ltr"
                >
                  {o.part}
                </Link>
                <span className="text-slate-500">
                  {" "}
                  · {o.elastomer}
                  {o.builds > 1 ? ` · ${fill(t.builds, { n: o.builds })}` : ""}
                </span>
              </span>
              <Link
                href={`${hrefBase}/contact?product=${encodeURIComponent(
                  `WILDEN ${o.part} (${m.model}, ${m.material}, ${m.construction}, ${m.connection}, ${o.elastomer}). Selector duty: ${duty}`,
                )}`}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-600"
              >
                {t.quote}
                <ArrowRight className="h-3.5 w-3.5 rtl-flip" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={lookupHref(hrefBase, m.material, m.model)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700"
        >
          {fill(t.allBuilds, { model: ltr(m.model) })}
          <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

function Stat({ label, value, sub, rawSub }: { label: string; value: string; sub?: string; rawSub?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 font-display text-base font-semibold text-slate-900">{ltr(value)}</dd>
      {sub ? <dd className="text-xs text-slate-500">{rawSub ? sub : ltr(sub)}</dd> : null}
    </div>
  );
}
