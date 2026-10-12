"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export type PartsFilterLabels = {
  search: string;
  allPorts: string;
  allSeries: string;
  allElastomers: string;
  showing: string;
  of: string;
  noMatch: string;
};

/**
 * Filters the server-rendered builds table in place by toggling row
 * visibility, reading each row's cell text. The rows stay in the HTML (so
 * every part number is crawlable) and nothing is passed as props.
 */
export function WildenPartsFilter({
  tableId,
  total,
  ports,
  series,
  elastomers,
  labels,
}: {
  tableId: string;
  total: number;
  ports: string[];
  series: string[];
  elastomers: string[];
  labels: PartsFilterLabels;
}) {
  const [q, setQ] = useState("");
  const [port, setPort] = useState("");
  const [ser, setSer] = useState("");
  const [elast, setElast] = useState("");
  const [shown, setShown] = useState(total);

  // Deep link from site search: /wilden-aodd-pumps/part-numbers?q=08-14814
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQ(initial);
  }, []);

  useEffect(() => {
    const needle = q.trim().toLowerCase().replace(/[^a-z0-9.]/g, "");
    let n = 0;
    document.querySelectorAll<HTMLTableRowElement>(`#${tableId} tbody tr`).forEach((tr) => {
      // Columns: part, model, build, port, series, construction, connection, elastomer.
      const cell = (i: number) => tr.cells[i]?.textContent ?? "";
      const hay = `${cell(0)}|${cell(1)}|${cell(2)}`.toLowerCase().replace(/[^a-z0-9.|]/g, "");
      const ok =
        (!needle || hay.includes(needle)) &&
        (!port || cell(3) === port) &&
        (!ser || cell(4) === ser) &&
        (!elast || cell(7) === elast);
      tr.hidden = !ok;
      if (ok) n++;
    });
    setShown(n);
  }, [q, port, ser, elast, tableId]);

  const select =
    "h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-accent-500 focus:outline-none";

  return (
    <div className="mb-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <label className="relative">
          <span className="sr-only">{labels.search}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={labels.search}
            className={`${select} w-full pl-9`}
          />
        </label>
        <select value={port} onChange={(e) => setPort(e.target.value)} className={select} aria-label={labels.allPorts}>
          <option value="">{labels.allPorts}</option>
          {ports.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={ser} onChange={(e) => setSer(e.target.value)} className={select} aria-label={labels.allSeries}>
          <option value="">{labels.allSeries}</option>
          {series.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={elast} onChange={(e) => setElast(e.target.value)} className={select} aria-label={labels.allElastomers}>
          <option value="">{labels.allElastomers}</option>
          {elastomers.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <p className="mt-3 text-sm text-slate-500" aria-live="polite">
        {shown === 0 ? labels.noMatch : <>{labels.showing} <strong className="text-slate-900">{shown}</strong> {labels.of} {total}</>}
      </p>
    </div>
  );
}
