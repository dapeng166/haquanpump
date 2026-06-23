// Central i18n configuration.
// We support six high-traffic B2B export languages. Arabic is RTL.

export const locales = ["en", "zh", "es", "de", "ru", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

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
};

export const LOCALE_COOKIE = "haquan_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function dirForLocale(locale: Locale): "ltr" | "rtl" {
  return localeMeta[locale].dir;
}
