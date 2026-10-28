"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  X,
  FileText,
  FileDown,
  HelpCircle,
  Package,
  Newspaper,
  CornerDownLeft,
} from "lucide-react";
import type { SearchDoc } from "@/app/api/search/route";
import { compact, seriesCode } from "@/lib/searchCodes";

const TYPE_META: Record<
  SearchDoc["type"],
  { icon: typeof Package; label: string }
> = {
  Product: { icon: Package, label: "Product" },
  Document: { icon: FileDown, label: "Document" },
  FAQ: { icon: HelpCircle, label: "FAQ" },
  News: { icon: Newspaper, label: "News & Guides" },
  Page: { icon: FileText, label: "Page" },
};

// Most results each type may take, so 500+ products can never crowd out the
// documents, FAQs and news that also match.
const TYPE_CAP: Record<SearchDoc["type"], number> = {
  Product: 6,
  Document: 5,
  FAQ: 3,
  News: 5,
  Page: 3,
};

/**
 * Site-wide search palette. A header icon opens a command-palette modal that
 * searches an index of every page, product, technical document, FAQ and news
 * article (loaded once from
 * /api/search and filtered locally). Cmd/Ctrl+K toggles it; arrow keys + Enter
 * navigate; Esc closes.
 */
export function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load the index every time the palette opens (fresh, no-store) so newly
  // published products/news are searchable without a full page reload.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/search", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setDocs(d.docs ?? []);
      })
      .catch(() => {
        if (!cancelled) setDocs((prev) => prev ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Global shortcut: Cmd/Ctrl+K toggles the palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus the input on open and lock body scroll; reset on close.
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 40);
      document.body.style.overflow = "hidden";
      return () => window.clearTimeout(id);
    }
    setQuery("");
    setActive(0);
    document.body.style.overflow = "";
  }, [open]);

  const results = useMemo(() => {
    if (!docs) return [];
    const q = query.trim().toLowerCase();
    // Empty query → surface the main pages as quick links.
    if (!q) return docs.filter((d) => d.type === "Page");
    const tokens = q.split(/\s+/).filter(Boolean);
    const scored = docs
      .map((d) => {
        const title = d.title.toLowerCase();
        const hay = `${title} ${d.excerpt} ${d.meta ?? ""} ${d.keywords ?? ""}`.toLowerCase();
        const hayCompact = compact(hay);
        let score = 0;
        for (const tk of tokens) {
          // Dashes/spaces ignored, so "200QW-300-15" matches "200QW300-15-22".
          const tkCompact = compact(tk);
          if (hay.includes(tk) || (tkCompact.length > 2 && hayCompact.includes(tkCompact))) {
            score += title.includes(tk) || compact(title).includes(tkCompact) ? 3 : 1;
            continue;
          }
          // A full model number ("50YW25-32-5.5") rarely appears verbatim, but
          // its series datasheet, manual and products should still come up.
          const code = /\d/.test(tk) ? seriesCode(tk) : null;
          if (code && d.codes?.includes(code)) {
            score += d.type === "Document" ? 2 : 0.5;
            continue;
          }
          return null;
        }
        return { d, score };
      })
      .filter((x): x is { d: SearchDoc; score: number } => x !== null)
      .sort((a, b) => b.score - a.score);
    const taken: Partial<Record<SearchDoc["type"], number>> = {};
    return scored
      .filter(({ d }) => {
        const n = taken[d.type] ?? 0;
        if (n >= TYPE_CAP[d.type]) return false;
        taken[d.type] = n + 1;
        return true;
      })
      .map((x) => x.d);
  }, [docs, query]);

  useEffect(() => setActive(0), [query]);

  // Some targets (the WILDEN part-number lookup) filter themselves by ?q=.
  const hrefFor = (d: SearchDoc) =>
    d.appendQuery && query.trim() ? `${d.href}?q=${encodeURIComponent(query.trim())}` : d.href;

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      // Documents are PDFs on the CMS: open them in a new tab.
      if (/^https?:\/\//.test(href)) window.open(href, "_blank", "noopener");
      else router.push(href);
    },
    [router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(hrefFor(results[active]));
    }
  };

  return (
    <>
      {/* Trigger — always visible, on every breakpoint. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        title="Search (Ctrl/⌘ K)"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-slate-200 transition-colors hover:border-amber-400/50 hover:text-amber-400"
      >
        <Search className="h-5 w-5" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6 sm:pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site search"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onKeyDown={onKeyDown}
              className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
            >
              {/* Input */}
              <div className="flex items-center gap-3 border-b border-slate-200 px-4">
                <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, news, pages…"
                  aria-label="Search query"
                  className="w-full bg-transparent py-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close search"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              {/* Results */}
              <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {docs === null ? (
                  <div className="px-3 py-10 text-center text-sm text-slate-400">
                    Loading…
                  </div>
                ) : results.length === 0 ? (
                  <div className="px-3 py-10 text-center text-sm text-slate-400">
                    No results for “{query.trim()}”.
                  </div>
                ) : (
                  <ul>
                    {results.map((d, i) => {
                      const Icon = TYPE_META[d.type].icon;
                      const selected = i === active;
                      return (
                        <li key={`${d.type}-${d.href}`}>
                          <button
                            type="button"
                            onMouseMove={() => setActive(i)}
                            onClick={() => go(hrefFor(d))}
                            className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                              selected ? "bg-accent/10" : "hover:bg-slate-50"
                            }`}
                          >
                            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-accent-600">
                              <Icon className="h-4 w-4" aria-hidden />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                <span className="truncate font-medium text-slate-900">
                                  {d.title}
                                </span>
                                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-slate-500">
                                  {TYPE_META[d.type].label}
                                </span>
                              </span>
                              <span className="mt-0.5 line-clamp-1 block text-sm text-slate-500">
                                {d.meta ? `${d.meta} — ` : ""}
                                {d.excerpt}
                              </span>
                            </span>
                            {selected && (
                              <CornerDownLeft
                                className="mt-1.5 h-4 w-4 shrink-0 text-slate-300"
                                aria-hidden
                              />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2 text-[0.7rem] text-slate-400">
                <span>Search across the whole site</span>
                <span className="hidden items-center gap-1 sm:flex">
                  <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-sans">
                    Esc
                  </kbd>
                  to close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
