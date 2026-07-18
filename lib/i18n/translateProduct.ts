import type { Product } from "@/lib/types";
import type { Locale } from "./config";
import { translateHtml, translateMany } from "./translate";
import {
  EN_PRODUCT_LABELS,
  type ProductDetailLabels,
} from "@/components/products/ProductDetailView";

/**
 * Return a copy of a product with its human-readable fields translated into
 * `locale`. Numeric specs and the model code are left untouched. Falls back to
 * the English source per field on any failure (via the translate helpers).
 */
export async function translateProduct(
  product: Product,
  locale: Locale,
): Promise<Product> {
  if (locale === "en") return product;

  const [name, excerpt, seriesName, material] = await translateMany(
    [product.name, product.excerpt, product.seriesName, product.specs.material],
    locale,
  );
  const description = await translateHtml(product.description, locale);
  const applications = await translateMany(product.applications, locale);

  return {
    ...product,
    name,
    excerpt,
    seriesName,
    description,
    applications,
    specs: { ...product.specs, material },
  };
}

/**
 * Lightweight translation for product cards / listings: only the fields a card
 * shows (name, excerpt, series) — not the full HTML description. Much cheaper
 * than translateProduct when rendering many products at once.
 */
export async function translateProductCard(
  product: Product,
  locale: Locale,
): Promise<Product> {
  if (locale === "en") return product;
  const [name, excerpt, seriesName] = await translateMany(
    [product.name, product.excerpt, product.seriesName],
    locale,
  );
  return { ...product, name, excerpt, seriesName };
}

/** Translate the product-page UI labels into `locale`. */
export async function translateProductLabels(
  locale: Locale,
): Promise<ProductDetailLabels> {
  if (locale === "en") return EN_PRODUCT_LABELS;
  const keys = Object.keys(EN_PRODUCT_LABELS) as (keyof ProductDetailLabels)[];
  const translated = await translateMany(
    keys.map((k) => EN_PRODUCT_LABELS[k]),
    locale,
  );
  return Object.fromEntries(
    keys.map((k, i) => [k, translated[i]]),
  ) as ProductDetailLabels;
}
