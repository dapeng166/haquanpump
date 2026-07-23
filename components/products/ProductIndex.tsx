import Link from "next/link";
import type { Product, PumpSeries } from "@/lib/types";

/**
 * A server-rendered index of every product, grouped by series.
 *
 * The explorer above paginates on the client eight at a time, so a crawler only
 * ever sees the first page's links — with a 250+ item catalogue that leaves
 * almost every product discoverable through the XML sitemap alone, with no
 * internal links pointing at it. This list puts a real <a> on the page for each
 * one and groups them by series, which also states the catalogue's structure.
 *
 * It is collapsed by default with <details> to stay out of the way; the markup
 * is in the DOM either way, which is what crawlers read.
 */
export function ProductIndex({
  products,
  series,
  labels,
  basePath = "",
}: {
  products: Product[];
  series: PumpSeries[];
  labels: { heading: string; hint: string };
  basePath?: string;
}) {
  const grouped = series
    .map((s) => ({ series: s, items: products.filter((p) => p.seriesSlug === s.slug) }))
    .filter((g) => g.items.length > 0);

  // Anything whose series term is missing still needs a link from somewhere.
  const linked = new Set(grouped.flatMap((g) => g.items.map((p) => p.slug)));
  const ungrouped = products.filter((p) => !linked.has(p.slug));
  if (ungrouped.length) {
    grouped.push({
      series: { slug: "other", name: "Other", description: "" },
      items: ungrouped,
    });
  }

  if (!grouped.length) return null;

  return (
    <details className="mt-16 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
      <summary className="cursor-pointer list-none font-display text-lg font-bold text-slate-900">
        {labels.heading}
        <span className="ml-2 text-sm font-normal text-slate-500">({products.length})</span>
      </summary>
      <p className="mt-2 text-sm text-slate-500">{labels.hint}</p>

      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {grouped.map((g) => (
          <div key={g.series.slug}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              {g.series.name}
            </h2>
            <ul className="mt-3 space-y-1.5">
              {g.items.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`${basePath}/products/${p.slug}`}
                    className="text-sm leading-snug text-slate-600 underline-offset-2 hover:text-accent-600 hover:underline"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}
