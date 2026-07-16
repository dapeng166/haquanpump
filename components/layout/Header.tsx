"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { mainNav } from "@/lib/site";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SiteSearch } from "./SiteSearch";

export function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation and lock body scroll while open.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-[#16305a] transition-all duration-300 ${
        scrolled ? "py-3 shadow-lg shadow-black/20" : "py-5"
      }`}
    >
      <div className="container-px flex items-center justify-between gap-4">
        <Logo onDark />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-[#16305a]"
                  : "text-slate-200 hover:text-amber-300"
              }`}
            >
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-full bg-amber-400"
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white lg:hidden"
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
            className="overflow-hidden lg:hidden"
          >
            <div className="container-px mt-3 flex flex-col gap-1 border-t border-white/10 bg-[#16305a] py-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-amber-400/15 text-amber-300"
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
