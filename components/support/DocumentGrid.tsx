"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export type SupportDoc = { url: string; title: string; type: string };

const PER_PAGE = 8;

/**
 * Client-side paginated grid of downloadable technical documents.
 * All documents are fetched on the server and passed in; this component just
 * shows PER_PAGE at a time with prev/next controls so a long list stays tidy.
 */
export function DocumentGrid({ documents }: { documents: SupportDoc[] }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(documents.length / PER_PAGE);
  const start = page * PER_PAGE;
  const visible = documents.slice(start, start + PER_PAGE);

  return (
    <div>
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {visible.map((d, i) => (
          <Reveal key={d.url} index={i % 2} className="h-full">
            <a
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-accent/40 hover:bg-slate-100"
            >
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-600 ring-1 ring-accent/20">
                <FileText className="h-6 w-6" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block font-medium text-slate-900">{d.title}</span>
                <span className="text-xs text-slate-400">{d.type} · PDF</span>
              </span>
              <Download className="h-5 w-5 text-slate-400 transition-colors group-hover:text-accent-600" aria-hidden />
            </a>
          </Reveal>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-accent/40 hover:text-accent-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5 rtl-flip" aria-hidden />
          </button>
          <span className="min-w-[4rem] text-center text-sm font-medium text-slate-500">
            {page + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page === pageCount - 1}
            aria-label="Next page"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-accent/40 hover:text-accent-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5 rtl-flip" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
