"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import type { Product, PumpSeries } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { useTranslation } from "@/lib/i18n/I18nProvider";

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
  const [active, setActive] = useState<string>(initialSeries);

  const filtered = useMemo(
    () => (active === "all" ? products : products.filter((p) => p.seriesSlug === active)),
    [active, products],
  );

  // Derive counts from the actual product list so chips are always accurate,
  // and only show series that contain at least one product.
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) map[p.seriesSlug] = (map[p.seriesSlug] ?? 0) + 1;
    return map;
  }, [products]);

  const visibleSeries = series.filter((s) => (counts[s.slug] ?? 0) > 0);

  function select(slug: string) {
    setActive(slug);
    // Reflect the filter in the URL without a navigation/scroll jump.
    const url = slug === "all" ? "/products" : `/products?series=${slug}`;
    window.history.replaceState(null, "", url);
  }

  const chips = [
    { slug: "all", name: t("common.allSeries"), count: products.length },
    ...visibleSeries.map((s) => ({ slug: s.slug, name: s.name, count: counts[s.slug] ?? 0 })),
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      {/* Sidebar / filter rail */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
          <SlidersHorizontal className="h-4 w-4 text-accent-300" aria-hidden />
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
                      ? "border-accent/60 bg-accent/10 text-accent-300"
                      : "border-white/10 bg-white/[0.02] text-navy-100/70 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <span>{c.name}</span>
                  {typeof c.count === "number" && (
                    <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-accent/20" : "bg-white/5"}`}>
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
      <div>
        <p className="mb-6 text-sm text-navy-100/50">
          Showing <span className="font-semibold text-white">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "product" : "products"}
        </p>
        <motion.div layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
