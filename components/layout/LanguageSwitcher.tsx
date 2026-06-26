"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Search } from "lucide-react";

// Each entry: Google Translate language code, English + native name, flag, RTL.
type Lang = { code: string; name: string; native: string; flag: string; rtl?: boolean };

const LANGUAGES: Lang[] = [
  { code: "en", name: "English", native: "English", flag: "us" },
  { code: "zh-CN", name: "Chinese (Simplified)", native: "简体中文", flag: "cn" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "繁體中文", flag: "tw" },
  { code: "es", name: "Spanish", native: "Español", flag: "es" },
  { code: "fr", name: "French", native: "Français", flag: "fr" },
  { code: "de", name: "German", native: "Deutsch", flag: "de" },
  { code: "ru", name: "Russian", native: "Русский", flag: "ru" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "sa", rtl: true },
  { code: "pt", name: "Portuguese", native: "Português", flag: "br" },
  { code: "it", name: "Italian", native: "Italiano", flag: "it" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "jp" },
  { code: "ko", name: "Korean", native: "한국어", flag: "kr" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "in" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "bd" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", flag: "id" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu", flag: "my" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", flag: "vn" },
  { code: "th", name: "Thai", native: "ไทย", flag: "th" },
  { code: "tr", name: "Turkish", native: "Türkçe", flag: "tr" },
  { code: "nl", name: "Dutch", native: "Nederlands", flag: "nl" },
  { code: "pl", name: "Polish", native: "Polski", flag: "pl" },
  { code: "uk", name: "Ukrainian", native: "Українська", flag: "ua" },
  { code: "fa", name: "Persian", native: "فارسی", flag: "ir", rtl: true },
  { code: "he", name: "Hebrew", native: "עברית", flag: "il", rtl: true },
  { code: "ur", name: "Urdu", native: "اردو", flag: "pk", rtl: true },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "in" },
  { code: "tl", name: "Filipino", native: "Filipino", flag: "ph" },
  { code: "sw", name: "Swahili", native: "Kiswahili", flag: "ke" },
  { code: "el", name: "Greek", native: "Ελληνικά", flag: "gr" },
  { code: "cs", name: "Czech", native: "Čeština", flag: "cz" },
  { code: "ro", name: "Romanian", native: "Română", flag: "ro" },
  { code: "hu", name: "Hungarian", native: "Magyar", flag: "hu" },
  { code: "sv", name: "Swedish", native: "Svenska", flag: "se" },
  { code: "da", name: "Danish", native: "Dansk", flag: "dk" },
  { code: "fi", name: "Finnish", native: "Suomi", flag: "fi" },
  { code: "no", name: "Norwegian", native: "Norsk", flag: "no" },
  { code: "sk", name: "Slovak", native: "Slovenčina", flag: "sk" },
  { code: "bg", name: "Bulgarian", native: "Български", flag: "bg" },
  { code: "sr", name: "Serbian", native: "Српски", flag: "rs" },
  { code: "hr", name: "Croatian", native: "Hrvatski", flag: "hr" },
  { code: "af", name: "Afrikaans", native: "Afrikaans", flag: "za" },
];

const RTL = new Set(LANGUAGES.filter((l) => l.rtl).map((l) => l.code));
const byCode = new Map(LANGUAGES.map((l) => [l.code, l] as const));

/** Drive the hidden Google combo to translate the whole page in real time. */
function applyTranslation(code: string) {
  if (typeof document === "undefined") return;
  document.documentElement.dir = RTL.has(code) ? "rtl" : "ltr";

  let attempts = 0;
  const tick = () => {
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
    } else if (attempts++ < 60) {
      // Wait for the translate widget to finish booting (up to ~9s).
      window.setTimeout(tick, 150);
    }
  };
  tick();
}

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>("en");
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore the active language from the cookie Google sets ( /en/<code> ).
  useEffect(() => {
    const m = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
    if (m) {
      const code = decodeURIComponent(m[1]);
      if (byCode.has(code)) {
        setCurrent(code);
        document.documentElement.dir = RTL.has(code) ? "rtl" : "ltr";
      }
    }
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery("");
  }, [open]);

  function select(code: string) {
    setCurrent(code);
    setOpen(false);
    applyTranslation(code);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.native.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q),
    );
  }, [query]);

  const active = byCode.get(current) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative" translate="no">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-accent/50 hover:text-slate-900"
      >
        <Globe className="h-4 w-4 text-accent-600" aria-hidden />
        {!compact && <span className="hidden sm:inline">{active.name}</span>}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="glass-strong absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl shadow-2xl shadow-black/40">
          {/* Search */}
          <div className="border-b border-slate-200 p-2">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5">
              <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search languages…"
                className="w-full bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <ul role="listbox" className="max-h-72 overflow-y-auto py-1">
            {filtered.map((lang) => {
              const isActive = lang.code === current;
              return (
                <li key={lang.code} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => select(lang.code)}
                    className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-slate-100 ${
                      isActive ? "text-slate-900" : "text-slate-700"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://flagcdn.com/24x18/${lang.flag}.png`}
                      alt=""
                      width={24}
                      height={18}
                      className="h-[18px] w-6 rounded-sm object-cover"
                      loading="lazy"
                    />
                    <span className="flex-1">
                      {lang.name}
                      <span className="ml-1.5 text-xs text-slate-400">{lang.native}</span>
                    </span>
                    {isActive && <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />}
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-3.5 py-3 text-sm text-slate-400">No match.</li>
            )}
          </ul>

          <div className="border-t border-slate-200 px-3.5 py-2 text-[0.65rem] text-slate-400">
            Real-time translation by Google
          </div>
        </div>
      )}
    </div>
  );
}
