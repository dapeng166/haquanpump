"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Youtube, Facebook, MessageCircle } from "lucide-react";
import { company, mainNav } from "@/lib/site";
import { pumpSeries } from "@/lib/data/products";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const socials = [
    { href: company.social.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: company.social.youtube, icon: Youtube, label: "YouTube" },
    { href: company.social.facebook, icon: Facebook, label: "Facebook" },
    { href: company.social.whatsapp, icon: MessageCircle, label: "WhatsApp" },
  ];

  return (
    <footer className="relative mt-12 border-t border-white/10 bg-charcoal-950">
      <div className="container-px py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-100/60">
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-navy-100/70 transition-all hover:border-accent/50 hover:text-accent-300"
                >
                  <s.icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.quickLinks")}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-navy-100/60 transition-colors hover:text-accent-300"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.ourProducts")}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {pumpSeries.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/products?series=${s.slug}`}
                    className="text-navy-100/60 transition-colors hover:text-accent-300"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.contactUs")}
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-navy-100/60">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
                <span>{company.address.full}</span>
              </li>
              <li>
                <a
                  href={`tel:${company.phoneHref}`}
                  className="flex gap-3 transition-colors hover:text-accent-300"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex gap-3 transition-colors hover:text-accent-300"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-sm text-navy-100/50 sm:flex-row">
          <p>
            © {year} {company.name} {t("footer.rights")}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="transition-colors hover:text-accent-300">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms-of-use" className="transition-colors hover:text-accent-300">
              {t("footer.terms")}
            </Link>
            <Link href="/sitemap" className="transition-colors hover:text-accent-300">
              {t("footer.sitemap")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
