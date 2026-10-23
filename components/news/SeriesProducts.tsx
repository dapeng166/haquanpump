import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";

/**
 * "Products in this series" under a guide or case study that came from the
 * product catalogue, so a reader can go straight from the article to a pump.
 * Cards arrive already translated on localized routes.
 */
export function SeriesProducts({
  title,
  products,
  hrefBase = "",
  cardLabels,
}: {
  title: string;
  products: Product[];
  hrefBase?: string;
  cardLabels?: { flow: string; head: string; power: string; viewDetails: string };
}) {
  if (products.length === 0) return null;
  return (
    <section className="mt-12 border-t border-slate-200 pt-8">
      <h2 className="font-display text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} hrefBase={hrefBase} labels={cardLabels} />
        ))}
      </div>
    </section>
  );
}
