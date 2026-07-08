import type { Locale } from "./config";

/**
 * Server-side machine translation for the indexable per-locale pages.
 *
 *  - English is the source and is never translated.
 *  - Each unique (locale + source text) is translated once, then cached, so the
 *    same string is never re-sent.
 *  - It NEVER throws: on any network/quota error it falls back to the English
 *    source, so a page always renders.
 *
 * Engine: if GOOGLE_TRANSLATE_API_KEY is set, uses the official Google Cloud
 * Translation API (most reliable, supports html format). Otherwise it uses
 * Google's free translation endpoint — no key, no billing — which preserves
 * HTML tags and batches many strings per request. Adding a key later switches
 * engines with no other change.
 */

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const OFFICIAL = "https://translation.googleapis.com/language/translate/v2";
const FREE = "https://translate.googleapis.com/translate_a/t?client=gtx&sl=en";

type Format = "text" | "html";

// Permanent in-process cache — each unique string is translated at most once
// for the lifetime of the server process.
const cache = new Map<string, string>();
const keyFor = (locale: Locale, format: Format, text: string) =>
  `${locale}:${format}:${text}`;

// Official keyed API: array in, array out, honours the html format.
async function callOfficial(
  texts: string[],
  target: Locale,
  format: Format,
): Promise<string[]> {
  const res = await fetch(`${OFFICIAL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: texts, source: "en", target, format }),
  });
  if (!res.ok) throw new Error(`Official translate ${res.status}`);
  const json = (await res.json()) as {
    data?: { translations?: { translatedText: string }[] };
  };
  const out = json.data?.translations?.map((t) => t.translatedText);
  if (!out || out.length !== texts.length) throw new Error("Malformed response");
  return out;
}

// Free endpoint: batches multiple q params into one POST; returns one
// translation per input, in order. Preserves HTML tags.
async function callFree(texts: string[], target: Locale): Promise<string[]> {
  const body = texts.map((q) => "q=" + encodeURIComponent(q)).join("&");
  const res = await fetch(`${FREE}&tl=${target}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Free translate ${res.status}`);
  const data = (await res.json()) as unknown;
  // One input → a bare string; many inputs → an array of strings.
  const arr = Array.isArray(data) ? (data as string[]) : [data as string];
  if (arr.length !== texts.length) throw new Error("Length mismatch");
  return arr;
}

// Translate a batch in chunks (keeps each request modest for the free endpoint).
async function callEngine(
  texts: string[],
  target: Locale,
  format: Format,
): Promise<string[]> {
  const CHUNK = 40;
  const out: string[] = [];
  for (let i = 0; i < texts.length; i += CHUNK) {
    const slice = texts.slice(i, i + CHUNK);
    const done = API_KEY
      ? await callOfficial(slice, target, format)
      : await callFree(slice, target);
    out.push(...done);
  }
  return out;
}

/** Translate a single string. Falls back to the English source on any failure. */
export async function translate(
  text: string,
  target: Locale,
  format: Format = "text",
): Promise<string> {
  if (target === "en" || !text?.trim()) return text;
  const k = keyFor(target, format, text);
  const hit = cache.get(k);
  if (hit !== undefined) return hit;
  try {
    const [out] = await callEngine([text], target, format);
    cache.set(k, out);
    return out;
  } catch {
    return text;
  }
}

/**
 * Translate many strings, serving cached items from cache and sending only the
 * misses in one batched request. Order preserved; per-item English fallback.
 */
export async function translateMany(
  texts: string[],
  target: Locale,
  format: Format = "text",
): Promise<string[]> {
  if (target === "en") return texts;

  const results: (string | null)[] = texts.map((t) =>
    t?.trim() ? (cache.get(keyFor(target, format, t)) ?? null) : t,
  );
  const missing = results
    .map((r, i) => (r === null ? i : -1))
    .filter((i) => i >= 0);

  if (missing.length > 0) {
    try {
      const done = await callEngine(
        missing.map((i) => texts[i]),
        target,
        format,
      );
      done.forEach((translated, n) => {
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
