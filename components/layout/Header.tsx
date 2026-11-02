"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { brandNav, mainNav } from "@/lib/site";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SiteSearch } from "./SiteSearch";

export function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation and lock body scroll while open.
  useEffect(() => {
    setOpen(false);
    setBrandsOpen(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isBrand = (href: string) => brandNav.some((b) => b.href === href);
  const brandActive = brandNav.some((b) => isActive(b.href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-[#16305a] transition-all duration-300 ${
        scrolled ? "py-3 shadow-lg shadow-black/20" : "py-5"
      }`}
    >
      <div className="container-px flex items-center justify-between gap-4">
        <Logo onDark />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 min-[1150px]:flex">
          {mainNav.map((item) => isBrand(item.href) ? (
            item.href === brandNav[0].href && (
              <div
                key="brands"
                className="group relative"
                onMouseLeave={() => setBrandsOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setBrandsOpen((v) => !v)}
                  aria-expanded={brandsOpen}
                  aria-haspopup="true"
                  className={`relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium xl:px-3 2xl:px-4 transition-colors ${
                    brandActive ? "text-[#16305a]" : "text-slate-200 hover:text-amber-400"
                  }`}
                >
                  {brandActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-amber-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {t("nav.brands")}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" aria-hidden />
                </button>
                {/* Always in the HTML (shown on hover, focus or click) so the
                    brand links stay crawlable. */}
                <div
                  className={`absolute start-0 top-full z-50 pt-2 transition-all ${
                    brandsOpen
                      ? "visible opacity-100"
                      : "invisible opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
                  }`}
                >
                  <div className="w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-black/15">
                    {brandNav.map((b) => (
                      <Link
                        key={b.href}
                        href={b.href}
                        className={`block rounded-xl px-4 py-3 transition-colors hover:bg-amber-50 ${
                          isActive(b.href) ? "bg-amber-50" : ""
                        }`}
                      >
                        <span className="block text-sm font-semibold text-[#16305a]">{t(b.key)}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{t(b.desc)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium xl:px-3 2xl:px-4 transition-colors ${
                isActive(item.href)
                  ? "text-[#16305a]"
                  : "text-slate-200 hover:text-amber-400"
              }`}
            >
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-full bg-amber-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <SiteSearch />
          {/* Always visible (compact globe on phones) so translation is easy
              to find on mobile/iPad — not buried in the menu. */}
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="btn-primary hidden md:inline-flex"
          >
            {t("cta.getQuote")}
            <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white min-[1150px]:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden min-[1150px]:hidden"
          >
            <div className="container-px mt-3 flex flex-col gap-1 border-t border-white/10 bg-[#16305a] py-4">
              {mainNav.map((item) => isBrand(item.href) ? (
                item.href === brandNav[0].href && (
                  <div key="brands">
                    <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-amber-400">
                      {t("nav.brands")}
                    </p>
                    {brandNav.map((b) => (
                      <Link
                        key={b.href}
                        href={b.href}
                        className={`block rounded-lg px-4 py-2.5 ps-7 transition-colors ${
                          isActive(b.href)
                            ? "bg-amber-500/15 text-amber-400"
                            : "text-slate-200 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="block text-base font-medium">{t(b.key)}</span>
                        <span className="block text-xs text-slate-400">{t(b.desc)}</span>
                      </Link>
                    ))}
                  </div>
                )
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-amber-500/15 text-amber-400"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="mt-3 border-t border-white/10 pt-4">
                <Link href="/contact" className="btn-primary w-full">
                  {t("cta.getQuote")}
                  <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
