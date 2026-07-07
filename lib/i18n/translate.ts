import type { Locale } from "./config";

/**
 * Server-side machine translation for the indexable per-locale pages.
 *
 * Design goals:
 *  - English is the source and is never translated (returned as-is).
 *  - Each unique (locale + source text) is translated at most once and then
 *    cached, so ongoing Google Translate usage stays inside the free monthly
 *    tier (500k chars) — new content costs pennies, existing content is free.
 *  - It NEVER throws: on a missing API key, network error or quota problem it
 *    falls back to the English source, so a page always renders.
 *
 * Uses the Google Cloud Translation API (v2, simple API-key auth). Set the key
 * in `.env.local` as GOOGLE_TRANSLATE_API_KEY (kept out of the public repo).
 */

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const ENDPOINT = "https://translation.googleapis.com/language/translate/v2";

type Format = "text" | "html";

// Permanent in-process cache. Next.js's fetch data-cache also persists the raw
// API responses across requests; this Map avoids re-work within a render pass.
const cache = new Map<string, string>();

const keyFor = (locale: Locale, format: Format, text: string) =>
  `${locale}:${format}:${text}`;

async function callGoogle(
  texts: string[],
  target: Locale,
  format: Format,
): Promise<string[]> {
  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: texts, source: "en", target, format }),
    // Cache the raw translation response for 30 days (content rarely changes).
    next: { revalidate: 60 * 60 * 24 * 30 },
  });
  if (!res.ok) throw new Error(`Google Translate ${res.status}`);
  const json = (await res.json()) as {
    data?: { translations?: { translatedText: string }[] };
  };
  const out = json.data?.translations?.map((t) => t.translatedText);
  if (!out || out.length !== texts.length) throw new Error("Malformed response");
  return out;
}

/** Translate a single string. Falls back to the English source on any failure. */
export async function translate(
  text: string,
  target: Locale,
  format: Format = "text",
): Promise<string> {
  if (target === "en" || !API_KEY || !text?.trim()) return text;
  const k = keyFor(target, format, text);
  const hit = cache.get(k);
  if (hit !== undefined) return hit;
  try {
    const [out] = await callGoogle([text], target, format);
    cache.set(k, out);
    return out;
  } catch {
    return text;
  }
}

/**
 * Translate many strings in as few API calls as possible: already-cached items
 * are served from cache, and only the misses are sent in one batched request.
 * Order is preserved; any failure falls back to the English source per item.
 */
export async function translateMany(
  texts: string[],
  target: Locale,
  format: Format = "text",
): Promise<string[]> {
  if (target === "en" || !API_KEY) return texts;

  const results: (string | null)[] = texts.map((t) =>
    t?.trim() ? (cache.get(keyFor(target, format, t)) ?? null) : t,
  );

  const missing = results
    .map((r, i) => (r === null ? i : -1))
    .filter((i) => i >= 0);

  if (missing.length > 0) {
    try {
      const out = await callGoogle(
        missing.map((i) => texts[i]),
        target,
        format,
      );
      out.forEach((translated, n) => {
        const i = missing[n];
        cache.set(keyFor(target, format, texts[i]), translated);
        results[i] = translated;
      });
    } catch {
      missing.forEach((i) => (results[i] = texts[i]));
    }
  }

  return results.map((r, i) => r ?? texts[i]);
}

/** Whether translation is configured (an API key is present). */
export const translationEnabled = Boolean(API_KEY);
