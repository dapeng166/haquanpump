// Small helpers to keep page titles and meta descriptions within the lengths
// Google actually displays (title ~60–70 chars, description ~155), so nothing
// important gets truncated in search results.

const BRAND_SUFFIX = " | Haquan Pump"; // appended by the layout title template
const TITLE_LIMIT = 60; // roughly what Google shows before it truncates

// Words that read as unfinished if a trim lands right after them.
const DANGLING = /\s+(?:for|and|with|the|of|to|in|on|at|by|from|a|an|or|&|vs|per)$/i;

/** Cut to `max` characters without splitting a word or ending mid-phrase. */
function trimWords(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  let base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  // Drop trailing punctuation, then any dangling connector words it exposed.
  base = base.replace(/[\s.,;:—–-]+$/, "");
  while (DANGLING.test(base)) base = base.replace(DANGLING, "");
  return base.replace(/[\s.,;:—–-]+$/, "");
}

/**
 * A page title value for Next's Metadata, kept inside Google's ~60-character
 * display width.
 *
 * Product names are written long on purpose — they are the page's H1 and carry
 * the full description — but a 120-character <title> just gets cut off in the
 * results, hiding the model number's supporting keywords. So the title falls
 * back through: full name + brand, full name alone, the lead clause before the
 * dash (which is where the model and primary keyword live), then a word-safe
 * trim of that clause.
 *
 * Returning a plain string lets the layout append the brand; `absolute` opts out.
 */
export function metaTitle(name: string): string | { absolute: string } {
  const clean = (name || "").replace(/\s+/g, " ").trim();
  if (!clean) return clean;

  if (clean.length + BRAND_SUFFIX.length <= TITLE_LIMIT) return clean;
  if (clean.length <= TITLE_LIMIT) return { absolute: clean };

  // Everything before the first dash separator: "50GNWQ15-20-3 Cutter Sewage
  // Pump – 15 m³/h, 20 m" keeps the model and the product type.
  const lead = clean.split(/\s+[–—]\s+|\s+-\s+/)[0].trim();
  const base = lead.length >= 20 ? lead : clean;

  if (base.length + BRAND_SUFFIX.length <= TITLE_LIMIT) return base;
  if (base.length <= TITLE_LIMIT) return { absolute: base };
  return { absolute: trimWords(base, TITLE_LIMIT) };
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
