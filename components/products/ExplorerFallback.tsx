import type { Product } from "@/lib/types";
import type { CardLabels } from "@/lib/i18n/uiLabels";
import { ProductCard } from "./ProductCard";

/**
 * Server-rendered stand-in for <ProductsExplorer> inside <Suspense>. The
 * explorer reads ?series= with useSearchParams, so on a static page it renders
 * on the client; this keeps the first page of cards in the HTML for crawlers
 * and no-JS visitors, laid out like the explorer to avoid a layout jump.
 */
export function ExplorerFallback({
  products,
  hrefBase = "",
  cardLabels,
  hideSpecs = false,
}: {
  products: Product[];
  hrefBase?: string;
  cardLabels?: CardLabels;
  hideSpecs?: boolean;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside aria-hidden />
      <div className="grid gap-6 sm:grid-cols-2">
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.slug} product={p} hrefBase={hrefBase} labels={cardLabels} hideSpecs={hideSpecs} />
        ))}
      </div>
    </div>
  );
}
