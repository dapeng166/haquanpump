import { DESMI_ITEMS, type DesmiItem } from "@/lib/desmi";
import { DESMI_EN, type DesmiStrings } from "@/components/desmi/DesmiViews";
import { translateMany } from "./translate";
import type { Locale } from "./config";

const itemText = (i: DesmiItem) => [i.title, i.kind, i.summary, i.material, ...i.uses, ...i.features];

// Short spec labels written by hand, as for KSB: machine translation mangles
// them out of context. [flow, viscosity, temperature, differential pressure].
const SPEC_LABELS: Partial<Record<Locale, [string, string, string, string]>> = {
  es: ["Caudal máx.", "Viscosidad máx.", "Temperatura máx.", "Presión diferencial máx."],
  pt: ["Vazão máx.", "Viscosidade máx.", "Temperatura máx.", "Pressão diferencial máx."],
  fr: ["Débit max.", "Viscosité max.", "Température max.", "Pression différentielle max."],
  de: ["Max. Förderstrom", "Max. Viskosität", "Max. Temperatur", "Max. Differenzdruck"],
  ru: ["Макс. подача", "Макс. вязкость", "Макс. температура", "Макс. перепад давления"],
  ar: ["أقصى تدفق", "أقصى لزوجة", "أقصى درجة حرارة", "أقصى فرق ضغط"],
};

/**
 * DESMI page strings and series text for a locale in one batched translation
 * call. Names, codes and figures stay as they are; only the prose is translated.
 */
export async function localizeDesmi(locale: Locale) {
  const keys = Object.keys(DESMI_EN) as (keyof DesmiStrings)[];
  const out = await translateMany([...keys.map((k) => DESMI_EN[k]), ...DESMI_ITEMS.flatMap(itemText)], locale);
  let n = 0;
  const T = Object.fromEntries(keys.map((k) => [k, out[n++]])) as DesmiStrings;
  const spec = SPEC_LABELS[locale];
  if (spec) {
    [T.flowUpTo, T.viscosityUpTo, T.tempUpTo, T.pressureUpTo] = spec;
    [T.specFlow, T.specViscosity, T.specTemp, T.specPressure] = spec;
  }
  const items = DESMI_ITEMS.map((i) => ({
    ...i,
    title: out[n++],
    kind: out[n++],
    summary: out[n++],
    material: out[n++],
    uses: i.uses.map(() => out[n++]),
    features: i.features.map(() => out[n++]),
  }));
  return { T, items };
}
