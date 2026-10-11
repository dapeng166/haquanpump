// Helpers for matching pump model numbers in site search. Shared by the search
// index (server) and the search palette (client), so keep it dependency-free.

/** Series codes that appear in Haquan model numbers (50YW25-32-5.5 → "yw"). */
const SERIES = new Set([
  "yw", "qw", "wq", "gnwq", "wqk", "zw", "zwl", "zx", "qby", "qbys",
  "isg", "isw", "ihg", "ihw", "irg", "irw", "qdx", "qd", "xps", "ps",
]);

/**
 * The series code inside a model-number-like token, e.g. "50YW25-32-5.5" → "yw",
 * "200QW-300-15" → "qw", "ZWL80" → "zwl". Null when the token isn't a model of
 * a known series.
 */
export function seriesCode(token: string): string | null {
  const m = token.toLowerCase().match(/^\d*([a-z]{2,4})(?=[\d-]|$)/);
  return m && SERIES.has(m[1]) ? m[1] : null;
}

/** Every known series code mentioned in a piece of text. */
export function seriesCodes(text: string): string[] {
  const out = new Set<string>();
  for (const word of text.split(/[^A-Za-z0-9-]+/)) {
    for (const part of [word, ...word.split("-")]) {
      const code = seriesCode(part);
      if (code) out.add(code);
    }
  }
  return [...out];
}

/** Lowercase with dashes, spaces and slashes removed: "200QW-300-15" → "200qw30015". */
export const compact = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
