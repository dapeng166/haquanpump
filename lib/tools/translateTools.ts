import { dirForLocale, type IndexableLocale } from "@/lib/i18n/config";
import { translateMany } from "@/lib/i18n/translate";
import { TOOLS_EN, ltr, type ToolsStrings } from "./strings";
import { TOOL_OVERRIDES } from "./overrides";

// Spans that must come back verbatim: {placeholders}, formulas in <code>,
// figures with their unit (units stay untranslated, e.g. Russian would turn
// "5 m" into "5 м"), bare flow units, model codes (DN80, 80QW40-15-4, TDH) and
// the brand. Each is swapped for an opaque token the engine passes through
// (verified for es/pt/fr/de/ru/ar), then restored.
const KEEP = new RegExp(
  [
    String.raw`\{\w+\}`,
    String.raw`<code>[\s\S]*?</code>`,
    String.raw`\d+(?:\.\d+)?\s?(?:m³/h|m³/s|m/s|L/s|kW|mm|bar|°C|m(?![\w³/]))`,
    String.raw`m³/h|m³/s|m/s|L/s|GPM`,
    String.raw`\b(?=[A-Z0-9-]*[A-Z]{2})[A-Z0-9][A-Z0-9-]*[A-Z0-9]\b`,
    String.raw`\bHaquan\b`,
  ].join("|"),
  "g",
);

// Distinct from the WILDEN tokens in lib/i18n/translate.ts (ZXQ0QXZ–ZXQ2QXZ).
const token = (i: number) => `ZXQ${i + 10}QXZ`;

function protect(text: string): { text: string; kept: string[] } {
  const kept: string[] = [];
  const out = text.replace(KEEP, (m) => {
    kept.push(m);
    return token(kept.length - 1);
  });
  return { text: out, kept };
}

function restore(text: string, kept: string[], rtl: boolean): string {
  // Highest index first so ZXQ1xQXZ is never matched inside a longer token.
  let out = text;
  for (let i = kept.length - 1; i >= 0; i--) {
    // In right-to-left text a figure keeps its order ("5 m", not "m 5") only
    // inside a left-to-right isolate. Placeholders are isolated when filled.
    const k = kept[i];
    const span = rtl && !k.startsWith("{") && !k.startsWith("<") ? ltr(k) : k;
    out = out.split(token(i)).join(span);
  }
  return out;
}

type Leaf = { path: string; text: string };

function leaves(node: unknown, path: string, out: Leaf[]) {
  if (typeof node === "string") out.push({ path, text: node });
  else if (Array.isArray(node)) node.forEach((v, i) => leaves(v, `${path}.${i}`, out));
  else if (node && typeof node === "object")
    for (const [k, v] of Object.entries(node)) leaves(v, path ? `${path}.${k}` : k, out);
}

function rebuild<T>(node: T, path: string, values: Map<string, string>): T {
  if (typeof node === "string") return (values.get(path) ?? node) as T;
  if (Array.isArray(node)) return node.map((v, i) => rebuild(v, `${path}.${i}`, values)) as T;
  if (node && typeof node === "object")
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [k, rebuild(v, path ? `${path}.${k}` : k, values)]),
    ) as T;
  return node;
}

/**
 * All tool copy for a locale. Long sentences and the FAQ / how-it-works prose
 * are machine-translated (cached per string); short labels and titles, where
 * the engine picks the wrong sense of "head" or "duty", come from hand-checked
 * overrides. Falls back to English per string, like the rest of the site.
 */
export async function toolStrings(locale: IndexableLocale): Promise<ToolsStrings> {
  const overrides = TOOL_OVERRIDES[locale] ?? {};
  const all: Leaf[] = [];
  leaves(TOOLS_EN, "", all);
  if (process.env.NODE_ENV === "development") {
    const known = new Set(all.map((l) => l.path));
    for (const k of Object.keys(overrides))
      if (!known.has(k)) console.warn(`[tools i18n] unknown ${locale} override: ${k}`);
  }
  const todo = all.filter((l) => !(l.path in overrides));
  const isHtml = (l: Leaf) => l.path.endsWith(".howItWorks");
  const rtl = dirForLocale(locale) === "rtl";

  const run = async (items: Leaf[], format: "text" | "html") => {
    const prepared = items.map((l) => protect(l.text));
    const done = await translateMany(prepared.map((p) => p.text), locale, format);
    return items.map((l, i) => [l.path, restore(done[i], prepared[i].kept, rtl)] as const);
  };
  const [text, html] = await Promise.all([
    run(todo.filter((l) => !isHtml(l)), "text"),
    run(todo.filter(isHtml), "html"),
  ]);
  const values = new Map<string, string>([...text, ...html, ...Object.entries(overrides)]);
  return rebuild(TOOLS_EN, "", values);
}
