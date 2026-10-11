"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import type { Product, PumpSeries } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { paginationRange } from "@/lib/pagination";
import type { CardLabels } from "@/lib/i18n/uiLabels";

const PAGE_SIZE = 8; // products per page

export type ExplorerText = {
  filterHeading: string;
  allLabel?: string;
  showing: string;
  of: string;
  product: string;
  products: string;
  empty: string;
};

const EN_TEXT: ExplorerText = {
  filterHeading: "Pump Series",
  showing: "Showing",
  of: "of",
  product: "product",
  products: "products",
  empty: "No products to show yet.",
};

export function ProductsExplorer({
  products,
  series,
  initialSeries = "all",
  basePath = "/products",
  hrefBase = "",
  cardLabels,
  hideSpecs = false,
  text = EN_TEXT,
  linkChips = [],
}: {
  products: Product[];
  series: PumpSeries[];
  initialSeries?: string;
  /** Page the filter lives on; `?series=` is appended for the active filter. */
  basePath?: string;
  /** Locale prefix for card links, e.g. "/es". */
  hrefBase?: string;
  cardLabels?: CardLabels;
  /** Hide the flow/head/power row (meaningless for spare parts and articles). */
  hideSpecs?: boolean;
  text?: ExplorerText;
  /**
   * Series listed in the rail that live on their own page (e.g. Wilden) and are
   * not in `products`. They render as links; an old ?series=<slug> URL for one
   * of them is forwarded to its page.
   */
  linkChips?: { slug: string; name: string; count: number; href: string }[];
}) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  // Old links such as /products?series=wilden-aodd-pump (bookmarks, chat
  // messages, search results) now belong on that series' own page.
  useEffect(() => {
    const target = linkChips.find((c) => c.slug === searchParams.get("series"));
    if (target) window.location.replace(target.href);
  }, [searchParams, linkChips]);
  // Read the filter from the URL on first render too: the listing pages are
  // static (ISR) and render this client-side inside <Suspense>, so the server
  // never sees ?series= and initialSeries is just the fallback.
  const [active, setActive] = useState<string>(() => {
    const urlSeries = searchParams.get("series");
    return urlSeries && series.some((s) => s.slug === urlSeries) ? urlSeries : initialSeries;
  });
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  // Keep the active filter in sync with the REAL address bar (useSearchParams),
  // not the server-passed initialSeries. On browser back/forward — e.g. returning
  // from a product detail page — Next may restore /products from its client cache
  // with a stale initialSeries; reading the live URL instead guarantees the
  // filter always matches the series you were actually viewing.
  useEffect(() => {
    const urlSeries = searchParams.get("series");
    setActive(urlSeries && series.some((s) => s.slug === urlSeries) ? urlSeries : "all");
  }, [searchParams, series]);

  // Reset to the first page whenever the filter changes.
  useEffect(() => {
    setPage(1);
  }, [active]);

  const filtered = useMemo(
    () => (active === "all" ? products : products.filter((p) => p.seriesSlug === active)),
    [active, products],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const start = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, filtered.length);

  function goToPage(n: number) {
    const next = Math.min(Math.max(1, n), totalPages);
    setPage(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Derive counts from the actual product list so chips are always accurate,
  // and only show series that contain at least one product.
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) map[p.seriesSlug] = (map[p.seriesSlug] ?? 0) + 1;
    return map;
  }, [products]);

  const visibleSeries = series.filter((s) => (counts[s.slug] ?? 0) > 0);

  function select(slug: string) {
    setActive(slug); // instant client-side filter
    // Reflect the filter in the URL IMMEDIATELY via the native History API.
    // router.replace() here triggered an RSC refetch that took ~2-3s on
    // production, during which the address bar still read /products — so a quick
    // product click was recorded from the unfiltered URL and "back" lost the
    // series. pushState updates the URL synchronously (no server round-trip) and
    // still syncs with useSearchParams, so back/forward restores the series.
    const url = slug === "all" ? basePath : `${basePath}?series=${slug}`;
    window.history.pushState(null, "", url);
  }

  const chips = [
    { slug: "all", name: text.allLabel ?? t("common.allSeries"), count: products.length },
    ...visibleSeries.map((s) => ({ slug: s.slug, name: s.name, count: counts[s.slug] ?? 0 })),
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      {/* Sidebar / filter rail */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-accent-600" aria-hidden />
          {text.filterHeading}
        </div>
        <ul className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1 lg:[scrollbar-width:thin]">
          {chips.map((c) => {
            const isActive = active === c.slug;
            return (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => select(c.slug)}
                  aria-pressed={isActive}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-all ${
                    isActive
                      ? "border-accent/60 bg-accent/10 text-accent-600"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  <span>{c.name}</span>
                  {typeof c.count === "number" && (
                    <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-accent/20" : "bg-slate-100"}`}>
                      {c.count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
          {linkChips.map((c) => (
            <li key={c.slug}>
              <Link
                href={c.href}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:text-slate-900"
              >
                <span>{c.name}</span>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                  {c.count}
                  <ArrowUpRight className="h-3 w-3 rtl-flip" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Grid */}
      <div ref={topRef} className="scroll-mt-28">
        <p className="mb-6 text-sm text-slate-500">
          {filtered.length === 0 ? (
            text.empty
          ) : (
            <>
              {text.showing}{" "}
              <span className="font-semibold text-slate-900">
                {start}–{end}
              </span>{" "}
              {text.of} <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
              {filtered.length === 1 ? text.product : text.products}
            </>
          )}
        </p>
        <motion.div layout className="grid gap-6 sm:grid-cols-2">
          {paged.map((product) => (
            <motion.div
              key={product.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <ProductCard product={product} hrefBase={hrefBase} labels={cardLabels} hideSpecs={hideSpecs} />
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="mt-12 flex flex-wrap items-center justify-center gap-1.5"
            aria-label="Product pages"
          >
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-accent/50 hover:text-accent-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4 rtl-flip" aria-hidden />
            </button>
            {paginationRange(currentPage, totalPages).map((token, i) =>
              token === "ellipsis" ? (
                <span
                  key={`e${i}`}
                  className="inline-flex h-10 min-w-[2.5rem] items-center justify-center px-1 text-sm text-slate-400"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <button
                  key={token}
                  type="button"
                  onClick={() => goToPage(token)}
                  aria-current={token === currentPage ? "page" : undefined}
                  className={`inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${
                    token === currentPage
                      ? "border-accent/60 bg-accent/10 text-accent-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-accent/50 hover:text-accent-600"
                  }`}
                >
                  {token}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-accent/50 hover:text-accent-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4 rtl-flip" aria-hidden />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
