import type { IndexableLocale } from "@/lib/i18n/config";
import { translateMany } from "@/lib/i18n/translate";
import { getProducts } from "@/lib/wordpress";
import { flagArticles, toToolProducts, type ToolProduct } from "./catalogue";

/**
 * The pump selector's catalogue for a locale: product names translated (the
 * same strings the localized product listings translate, so mostly cached)
 * and article entries flagged before translation. Served once per locale from
 * /api/tools/catalogue/[locale] instead of being embedded in each page.
 */
export async function localizedCatalogue(locale: IndexableLocale): Promise<ToolProduct[]> {
  const list = flagArticles(toToolProducts(await getProducts()));
  const names = await translateMany(
    list.map((p) => p.name),
    locale,
  );
  return list.map((p, i) => ({ ...p, name: names[i] }));
}
