import { KSB_PUMPS, KSB_VALVES, type KsbItem } from "@/lib/ksb";
import { KSB_EN, type KsbStrings } from "@/components/ksb/KsbViews";
import { translateMany } from "./translate";
import type { Locale } from "./config";

const itemText = (i: KsbItem) => [i.title, i.kind, i.summary, ...i.uses, ...i.features];

// Short spec labels written by hand: machine translation turns "head" into a
// body part and "Flow up to" into a verb. [flow, head, temperature, pressure].
const SPEC_LABELS: Partial<Record<Locale, [string, string, string, string]>> = {
  es: ["Caudal máx.", "Altura máx.", "Temperatura máx.", "Presión máx."],
  pt: ["Vazão máx.", "Altura manométrica máx.", "Temperatura máx.", "Pressão máx."],
  fr: ["Débit max.", "Hauteur max.", "Température max.", "Pression max."],
  de: ["Max. Förderstrom", "Max. Förderhöhe", "Max. Temperatur", "Max. Druck"],
  ru: ["Макс. подача", "Макс. напор", "Макс. температура", "Макс. давление"],
  ar: ["أقصى تدفق", "أقصى ارتفاع ضخ", "أقصى درجة حرارة", "أقصى ضغط"],
};

/**
 * KSB page strings and item text for a locale in one batched translation call.
 * Names, codes and figures stay as they are; only the prose is translated.
 */
export async function localizeKsb(locale: Locale) {
  const keys = Object.keys(KSB_EN) as (keyof KsbStrings)[];
  const all = [...KSB_PUMPS, ...KSB_VALVES];
  const out = await translateMany([...keys.map((k) => KSB_EN[k]), ...all.flatMap(itemText)], locale);
  let n = 0;
  const T = Object.fromEntries(keys.map((k) => [k, out[n++]])) as KsbStrings;
  const spec = SPEC_LABELS[locale];
  if (spec) {
    [T.flowUpTo, T.headUpTo, T.tempUpTo, T.pressureUpTo] = spec;
    [T.specFlow, T.specHead, T.specTemp, T.specPressure] = spec;
  }
  const items = all.map((i) => ({
    ...i,
    title: out[n++],
    kind: out[n++],
    summary: out[n++],
    uses: i.uses.map(() => out[n++]),
    features: i.features.map(() => out[n++]),
  }));
  return { T, items, pumps: items.slice(0, KSB_PUMPS.length), valves: items.slice(KSB_PUMPS.length) };
}
