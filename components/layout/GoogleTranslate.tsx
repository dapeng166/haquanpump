"use client";

import Script from "next/script";
import { useEffect } from "react";

// Boots the Google Website Translator engine once, globally. Its default UI is
// hidden via CSS (see globals.css); our own <LanguageSwitcher> drives it through
// the hidden `.goog-te-combo` <select> it creates. This gives full-page,
// real-time translation into ~100 languages without per-string dictionaries.

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; autoDisplay?: boolean },
          container: string,
        ) => void;
      };
    };
  }
}

export function GoogleTranslateLoader() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return;
      // No `includedLanguages` → the combo contains every supported language,
      // so any code our switcher selects is available.
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element",
      );
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" aria-hidden="true" />
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
