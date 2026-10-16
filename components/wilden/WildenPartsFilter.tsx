"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

export type PartsFilterLabels = {
  search: string;
  showing: string;
  of: string;
  noMatch: string;
  /** Lead-in for matches on the other lookup pages, e.g. "Also found on:". */
  alsoIn: string;
};

/** A dropdown filtering one column (by its 0-based cell index) to an exact value. */
export type FilterSelect = { col: number; all: string; options: string[] };

/**
 * Another lookup page: its part numbers, "|"-joined, so a code that lives on a
 * different page (another material or part category) can be pointed to.
 */
export type OtherPage = { label: string; href: string; parts: string };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9.|]/g, "");

/**
 * Filters the server-rendered table in place by toggling row visibility,
 * reading each row's cell text. The rows stay in the HTML (so every part
 * number is crawlable) and are never passed as props.
 */
export function WildenPartsFilter({
  tableId,
  total,
  searchCols,
  selects,
  others = [],
  labels,
}: {
  tableId: string;
  total: number;
  /** Cell indexes the search box matches against. */
  searchCols: number[];
  selects: FilterSelect[];
  others?: OtherPage[];
  labels: PartsFilterLabels;
}) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string[]>(() => selects.map(() => ""));
  const [shown, setShown] = useState(total);

  // Deep link from site search: /wilden-aodd-pumps/part-numbers?q=08-14814
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQ(initial);
  }, []);

  useEffect(() => {
    const needle = norm(q.trim());
    let n = 0;
    document.querySelectorAll<HTMLTableRowElement>(`#${tableId} tbody tr`).forEach((tr) => {
      const cell = (i: number) => tr.cells[i]?.textContent ?? "";
      const ok =
        (!needle || norm(searchCols.map(cell).join("|")).includes(needle)) &&
        selects.every((s, i) => !picked[i] || cell(s.col) === picked[i]);
      tr.hidden = !ok;
      if (ok) n++;
    });
    setShown(n);
  }, [q, picked, tableId, searchCols, selects]);

  // Part numbers matching the search on the other pages (shown only when the
  // search text looks like a code, i.e. has a digit).
  const elsewhere = useMemo(() => {
    const needle = norm(q.trim());
    if (needle.length < 3 || !/\d/.test(needle)) return [];
    return others
      .map((o) => ({ ...o, count: o.parts.split("|").filter((p) => norm(p).includes(needle)).length }))
      .filter((o) => o.count > 0);
  }, [q, others]);

  const select =
    "h-10 min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-accent-500 focus:outline-none";

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
        {selects.map((s, i) => (
          <select
            key={s.col}
            value={picked[i]}
            onChange={(e) => setPicked((p) => p.map((v, j) => (j === i ? e.target.value : v)))}
            className={select}
            aria-label={s.all}
          >
            <option value="">{s.all}</option>
            {s.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-500" aria-live="polite">
        {shown === 0 ? labels.noMatch : <>{labels.showing} <strong className="text-slate-900">{shown}</strong> {labels.of} {total}</>}
      </p>
      {elsewhere.length > 0 && (
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
          <span>{labels.alsoIn}</span>
          {elsewhere.map((o) => (
            <a
              key={o.href}
              href={`${o.href}?q=${encodeURIComponent(q.trim())}`}
              className="font-medium text-accent-600 hover:underline"
            >
              {o.label} ({o.count})
            </a>
          ))}
        </p>
      )}
    </div>
  );
}
