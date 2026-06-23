"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { defaultLocale, LOCALE_COOKIE, type Locale } from "./config";
import { dictionaries, enDictionary } from "./dictionaries";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Translate a dotted key path, e.g. t("nav.home"). Falls back to English. */
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function resolve(obj: unknown, path: string[]): string | undefined {
  let current: unknown = obj;
  for (const segment of path) {
    if (current && typeof current === "object" && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

export function I18nProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // English is the rendered source language; runtime translation + text
  // direction are handled by the Google-powered <LanguageSwitcher>. This
  // provider simply supplies the base UI strings via t().
  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const t = useCallback(
    (key: string) => {
      const path = key.split(".");
      return (
        resolve(dictionaries[locale], path) ??
        resolve(enDictionary, path) ??
        key
      );
    },
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within <I18nProvider>");
  }
  return ctx;
}
