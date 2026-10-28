"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { indexableLocales } from "@/lib/i18n/config";
import { Mail, Phone, MapPin, Linkedin, Facebook, ChevronDown } from "lucide-react";
import { company, mainNav } from "@/lib/site";
import { pumpSeries } from "@/lib/data/products";
import type { PumpSeries } from "@/lib/types";
import { seriesHref } from "@/lib/wilden";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { Logo } from "./Logo";
import { XIcon } from "@/components/ui/XIcon";
import { WhatsappIcon } from "@/components/ui/WhatsappIcon";

export function Footer({ series }: { series?: PumpSeries[] }) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  // Localized tool pages exist for the indexable locales; link to the one in the
  // visitor's language instead of always the English /tools.
  const pathname = usePathname() || "/";
  const pathLocale = indexableLocales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  const toolsHref = pathLocale ? `/${pathLocale}/tools` : "/tools";

  // Real product series from WordPress (those that actually have products),
  // falling back to the curated list when the CMS hasn't provided any.
  const cms = series ?? [];
  const withProducts = cms.filter((s) => (s.count ?? 0) > 0);
  const productSeries = withProducts.length ? withProducts : cms.length ? cms : pumpSeries;
  // Show the first few; the rest open on hover (desktop) or with the "+N" button
  // (touch). All links stay in the HTML so search engines still see them.
  const SHOWN = 8;
  const [seriesOpen, setSeriesOpen] = useState(false);
  const hiddenCount = Math.max(0, productSeries.length - SHOWN);

  const socials = [
    { href: company.social.linkedin, icon: Linkedin, label: "LinkedIn", brand: "#0A66C2" },
    { href: company.social.facebook, icon: Facebook, label: "Facebook", brand: "#1877F2" },
    { href: company.social.x, icon: XIcon, label: "X", brand: "#000000" },
    { href: company.social.whatsapp, icon: WhatsappIcon, label: "WhatsApp", brand: "#25D366" },
  ];

  return (
    <footer className="relative mt-12 bg-[#16305a] text-slate-300">
      <div className="container-px pt-16 pb-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Logo onDark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-300">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{ backgroundColor: s.brand }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90"
                >
                  <s.icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500">
              {t("footer.quickLinks")}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-300 transition-colors hover:text-amber-500"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={toolsHref} className="text-slate-300 transition-colors hover:text-amber-500">
                  Engineering Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500">
              {t("footer.ourProducts")}
            </h3>
            <ul className="group mt-5 space-y-3 text-sm">
              {productSeries.map((s, i) => (
                <li
                  key={s.slug}
                  className={i >= SHOWN && !seriesOpen ? "hidden lg:group-hover:list-item" : undefined}
                >
                  <Link
                    href={seriesHref(s.slug)}
                    className="text-slate-300 transition-colors hover:text-amber-500"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
              {hiddenCount > 0 && !seriesOpen && (
                <li className="lg:group-hover:hidden">
                  <button
                    type="button"
                    onClick={() => setSeriesOpen(true)}
                    aria-label={`Show ${hiddenCount} more product series`}
                    className="inline-flex items-center gap-1 font-semibold text-amber-500 transition-colors hover:text-amber-400"
                  >
                    +{hiddenCount}
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500">
              {t("footer.contactUs")}
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{company.address.full}</span>
              </li>
              <li>
                <a
                  href={`tel:${company.phoneHref}`}
                  className="flex gap-3 transition-colors hover:text-amber-500"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex gap-3 transition-colors hover:text-amber-500"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar — white base, echoing the light page content */}
      <div className="bg-white">
        <div className="container-px flex flex-col items-center justify-between gap-4 py-5 text-sm text-slate-500 sm:flex-row">
          <p>
            © {year} {company.name} {t("footer.rights")}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="transition-colors hover:text-accent-600">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms-of-use" className="transition-colors hover:text-accent-600">
              {t("footer.terms")}
            </Link>
            <Link href="/sitemap" className="transition-colors hover:text-accent-600">
              {t("footer.sitemap")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
