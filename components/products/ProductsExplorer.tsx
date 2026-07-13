"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import type { Product, PumpSeries } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { paginationRange } from "@/lib/pagination";

const PAGE_SIZE = 8; // products per page

export function ProductsExplorer({
  products,
  series,
  initialSeries = "all",
}: {
  products: Product[];
  series: PumpSeries[];
  initialSeries?: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [active, setActive] = useState<string>(initialSeries);
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  // Keep the active filter in sync with the URL so browser back/forward (e.g.
  // returning from a product detail page) restores the series you were viewing.
  useEffect(() => {
    setActive(initialSeries);
  }, [initialSeries]);

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
    // Reflect the filter in the URL via the Next router (not raw history) so the
    // entry is tracked — otherwise "back" from a product loses the series.
    const url = slug === "all" ? "/products" : `/products?series=${slug}`;
    router.replace(url, { scroll: false });
  }

  const chips = [
    { slug: "all", name: t("common.allSeries"), count: products.length },
    ...visibleSeries.map((s) => ({ slug: s.slug, name: s.name, count: counts[s.slug] ?? 0 })),
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      {/* Sidebar / filter rail */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-accent-600" aria-hidden />
          Pump Series
        </div>
        <ul className="flex flex-wrap gap-2 lg:flex-col">
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
        </ul>
      </aside>

      {/* Grid */}
      <div ref={topRef} className="scroll-mt-28">
        <p className="mb-6 text-sm text-slate-500">
          {filtered.length === 0 ? (
            "No products to show yet."
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {start}–{end}
              </span>{" "}
              of <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "product" : "products"}
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
              <ProductCard product={product} />
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
