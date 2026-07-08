import type { Locale } from "./config";
import { dictionaries, enDictionary } from "./dictionaries";

/**
 * Product-card UI labels for a locale, taken from the built-in dictionaries
 * (no machine-translation call needed). Falls back to English per field.
 */
export type CardLabels = {
  flow: string;
  head: string;
  power: string;
  viewDetails: string;
};

export function cardLabels(locale: Locale): CardLabels {
  const d = dictionaries[locale];
  const specs = d?.specs ?? {};
  const cta = d?.cta ?? {};
  return {
    flow: specs.flow ?? enDictionary.specs.flow,
    head: specs.head ?? enDictionary.specs.head,
    power: specs.power ?? enDictionary.specs.power,
    viewDetails: cta.viewDetails ?? enDictionary.cta.viewDetails,
  };
}
