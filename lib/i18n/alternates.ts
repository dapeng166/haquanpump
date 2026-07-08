import { indexableLocales } from "./config";

/**
 * Build the `alternates.languages` map for a page so Next.js emits reciprocal
 * `<link rel="alternate" hreflang="…">` tags. English lives at the root path
 * and is also the `x-default`; each indexable locale lives under its prefix.
 *
 * @param path root-relative English path, e.g. "/products/wqk-…" or "/products"
 */
export function localeAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {
    "x-default": path,
    en: path,
  };
  for (const locale of indexableLocales) {
    languages[locale] = `/${locale}${path}`;
  }
  return languages;
}
