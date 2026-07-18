// Small helpers to keep page titles and meta descriptions within the lengths
// Google actually displays (title ~60–70 chars, description ~155), so nothing
// important gets truncated in search results.

const BRAND_SUFFIX = " | Haquan Pump"; // appended by the layout title template

/**
 * A page title value for Next's Metadata. The layout template adds
 * "| Haquan Pump", so if that would push the title past ~68 characters we
 * return an `absolute` title (no suffix) instead of letting it overflow.
 */
export function metaTitle(name: string): string | { absolute: string } {
  const clean = (name || "").trim();
  return clean.length + BRAND_SUFFIX.length > 68 ? { absolute: clean } : clean;
}

/**
 * Trim a meta description to `max` characters at a word boundary and add an
 * ellipsis, so auto-generated excerpts don't get cut mid-word by search engines.
 */
export function metaDescription(text: string, max = 155): string {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return base.replace(/[\s.,;:—-]+$/, "") + "…";
}
