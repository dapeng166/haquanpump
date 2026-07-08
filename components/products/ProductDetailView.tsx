import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Gauge,
  Zap,
  Ruler,
  Layers,
  CheckCircle2,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductCard } from "@/components/products/ProductCard";
import { ExpandableHtml } from "@/components/ui/ExpandableHtml";

/** All UI strings the product page needs, so a locale route can supply
 *  translated copy while the English route passes the source strings. */
export type ProductDetailLabels = {
  home: string;
  products: string;
  model: string;
  specifications: string;
  flowRate: string;
  head: string;
  power: string;
  diameter: string;
  material: string;
  overview: string;
  applications: string;
  related: string;
  inquire: string;
};

/** English source strings; localized routes translate these before rendering. */
export const EN_PRODUCT_LABELS: ProductDetailLabels = {
  home: "Home",
  products: "Products",
  model: "Model:",
  specifications: "Specifications",
  flowRate: "Flow Rate",
  head: "Head",
  power: "Power",
  diameter: "Inlet / Outlet Diameter",
  material: "Material",
  overview: "Product Overview",
  applications: "Typical Applications",
  related: "Related Products",
  inquire: "Inquire About This Product",
};

/**
 * Shared product-detail view rendered by both the English route (`/products/…`)
 * and the localized routes (`/[locale]/products/…`). All translatable content
 * arrives already resolved via `product` + `labels`; `hrefBase` prefixes every
 * internal link with the locale (empty for English).
 */
export function ProductDetailView({
  product,
  related,
  labels,
  hrefBase = "",
  cardLabels,
}: {
  product: Product;
  related: Product[];
  labels: ProductDetailLabels;
  hrefBase?: string;
  /** Pre-translated labels for the related-product cards (localized routes). */
  cardLabels?: { flow: string; head: string; power: string; viewDetails: string };
}) {
  const specRows = [
    { icon: Droplets, label: labels.flowRate, value: product.specs.flowRate, unit: "m³/h" },
    { icon: Gauge, label: labels.head, value: product.specs.head, unit: "m" },
    { icon: Zap, label: labels.power, value: product.specs.power, unit: "kW" },
    { icon: Ruler, label: labels.diameter, value: product.specs.diameter, unit: "mm" },
    { icon: Layers, label: labels.material, value: product.specs.material, unit: "" },
  ];

  return (
    <>
      <Section className="pt-28">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href={`${hrefBase}/`} className="hover:text-accent-600">{labels.home}</Link></li>
              <li aria-hidden>/</li>
              <li><Link href={`${hrefBase}/products`} className="hover:text-accent-600">{labels.products}</Link></li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`${hrefBase}/products?series=${product.seriesSlug}`} className="hover:text-accent-600">
                  {product.seriesName}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Gallery */}
            <Reveal>
              <ProductGallery images={product.gallery} alt={`${product.name} — ${product.seriesName}`} />
            </Reveal>

            {/* Summary + specs */}
            <Reveal index={1}>
              <span className="eyebrow">{product.seriesName}</span>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm font-medium text-accent-600">{labels.model} {product.model}</p>
              <p className="mt-5 line-clamp-4 text-base leading-relaxed text-slate-600">{product.excerpt}</p>

              {/* Specification table */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-slate-900">
                  {labels.specifications}
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {specRows.map((row) => (
                      <tr key={row.label} className="border-b border-slate-100 last:border-0">
                        <th scope="row" className="w-1/2 px-5 py-3.5 text-left font-medium text-slate-500">
                          <span className="inline-flex items-center gap-2">
                            <row.icon className="h-4 w-4 text-accent-600" aria-hidden />
                            {row.label}
                          </span>
                        </th>
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          {row.value}
                          {row.unit ? <span className="ml-1 text-slate-500">{row.unit}</span> : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CTA — single route straight to contact */}
              <div className="mt-8">
                <Link
                  href={`${hrefBase}/contact?product=${encodeURIComponent(product.name)}`}
                  className="btn-primary w-full sm:w-auto"
                >
                  {labels.inquire}
                  <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Description + applications */}
          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-slate-900">{labels.overview}</h2>
              {/* Capped height + Read more so long CMS descriptions don't stretch the page. */}
              <ExpandableHtml
                html={product.description}
                className="prose-invert mt-4 space-y-4 text-base leading-relaxed text-slate-600 [&_p]:mb-4"
              />
            </Reveal>
            <Reveal index={1}>
              <div className="glass-card p-6">
                <h3 className="font-display text-lg font-semibold text-slate-900">{labels.applications}</h3>
                <ul className="mt-4 space-y-2.5">
                  {product.applications.map((a) => (
                    <li key={a} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-600" aria-hidden />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section className="bg-slate-50">
          <Container>
            <h2 className="mb-10 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              {labels.related}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} hrefBase={hrefBase} labels={cardLabels} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
