"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { UNIT_GROUPS, convert, fmtUnit, type UnitGroupKey } from "@/lib/tools/units";
import type { ConvUi } from "@/lib/tools/strings";

// Starting value per group, in its first unit.
const START: Record<UnitGroupKey, string> = { flow: "1", pressure: "1", power: "1" };

type Source = { unit: string; text: string };

/** `t` is the UI copy (English, or translated on the server). */
export function UnitConverter({ t }: { t: ConvUi }) {
  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-slate-600">{t.hint}</p>
      <div className="grid gap-6 lg:grid-cols-3">
        {UNIT_GROUPS.map((g) => (
          <Group key={g.key} group={g} t={t} />
        ))}
      </div>
      <p className="text-center text-xs text-slate-500">{t.waterNote}</p>
    </div>
  );
}

function Group({ group, t }: { group: (typeof UNIT_GROUPS)[number]; t: ConvUi }) {
  const first = group.units[0];
  const [src, setSrc] = useState<Source>({ unit: first.key, text: START[group.key] });
  const from = group.units.find((u) => u.key === src.unit) ?? first;
  const value = Number(src.text.replace(",", "."));
  const ok = src.text.trim() !== "" && Number.isFinite(value);

  return (
    <section className="glass-card p-5 hover:shadow-sm sm:p-6" aria-labelledby={`uc-${group.key}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id={`uc-${group.key}`} className="font-display text-lg font-bold text-slate-900">
          {t.groups[group.key]}
        </h2>
        <button
          type="button"
          onClick={() => setSrc({ unit: first.key, text: START[group.key] })}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          {t.reset}
        </button>
      </div>
      <div className="space-y-3">
        {group.units.map((u) => {
          const id = `uc-${group.key}-${u.key}`;
          const shown = u.key === src.unit ? src.text : ok ? fmtUnit(convert(value, from, u)) : "";
          return (
            <div key={u.key}>
              <label htmlFor={id} className="mb-1 block text-xs text-slate-500">
                {t.units[u.key] ?? u.symbol}
              </label>
              {/* The number and its unit read left to right in every language. */}
              <div
                dir="ltr"
                className={`flex items-stretch overflow-hidden rounded-xl border bg-white shadow-sm transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 ${
                  u.key === src.unit ? "border-accent/60" : "border-slate-300"
                }`}
              >
                <input
                  id={id}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={shown}
                  onChange={(e) => setSrc({ unit: u.key, text: e.target.value })}
                  onFocus={(e) => e.currentTarget.select()}
                  className="w-full min-w-0 bg-transparent px-3.5 py-2.5 text-base text-slate-900 outline-none"
                />
                <span className="flex w-24 shrink-0 items-center justify-center border-l border-slate-200 bg-slate-50 px-2 text-sm font-medium text-slate-700">
                  {u.symbol}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
