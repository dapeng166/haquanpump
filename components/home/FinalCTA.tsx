"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { img } from "@/lib/images";
import { company } from "@/lib/site";
import { Container } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n/I18nProvider";

export function FinalCTA() {
  const { t } = useTranslation();

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl border border-slate-200 px-6 py-16 text-center sm:px-12 sm:py-20">
            <Image
              src={img.ctaBackground}
              alt=""
              fill
              sizes="100vw"
              className="-z-10 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-900/95 via-white/92 to-white/95" />
            <div className="absolute inset-0 -z-10 bg-radial-glow" />

            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {t("sections.ctaTitle")}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {t("sections.ctaSubtitle")}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                {t("cta.getQuote")}
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
              <a href={`tel:${company.phoneHref}`} className="btn-outline">
                <PhoneCall className="h-4 w-4" aria-hidden />
                {company.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
