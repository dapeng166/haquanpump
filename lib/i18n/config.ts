// Central i18n configuration.
// We support six high-traffic B2B export languages. Arabic is RTL.

export const locales = ["en", "zh", "es", "de", "ru", "ar", "fr", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Locales that get their own server-rendered, indexable URLs (e.g. /es/…).
// Starts as a pilot subset; add more here to roll out further languages.
export const indexableLocales = ["es", "ar", "fr", "ru", "pt", "de"] as const satisfies readonly Locale[];

export type IndexableLocale = (typeof indexableLocales)[number];

export function isIndexableLocale(value: string): value is IndexableLocale {
  return (indexableLocales as readonly string[]).includes(value);
}

// Locale names are shown in English in the switcher (per layout brief),
// with the native label as a secondary hint.
export const localeMeta: Record<
  Locale,
  { englishName: string; nativeName: string; flag: string; dir: "ltr" | "rtl" }
> = {
  en: { englishName: "English", nativeName: "English", flag: "us", dir: "ltr" },
  zh: { englishName: "Chinese", nativeName: "中文", flag: "cn", dir: "ltr" },
  es: { englishName: "Spanish", nativeName: "Español", flag: "es", dir: "ltr" },
  de: { englishName: "German", nativeName: "Deutsch", flag: "de", dir: "ltr" },
  ru: { englishName: "Russian", nativeName: "Русский", flag: "ru", dir: "ltr" },
  ar: { englishName: "Arabic", nativeName: "العربية", flag: "sa", dir: "rtl" },
  fr: { englishName: "French", nativeName: "Français", flag: "fr", dir: "ltr" },
  pt: { englishName: "Portuguese", nativeName: "Português", flag: "br", dir: "ltr" },
};

export const LOCALE_COOKIE = "haquan_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function dirForLocale(locale: Locale): "ltr" | "rtl" {
  return localeMeta[locale].dir;
}
