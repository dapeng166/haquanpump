"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { img } from "@/lib/images";
import { stats } from "@/lib/data/content";
import { useTranslation } from "@/lib/i18n/I18nProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.12 },
  }),
};

export function Hero({
  subtitle,
  heroImage,
}: {
  subtitle?: string;
  heroImage?: string | null;
}) {
  const { t } = useTranslation();

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image + overlays */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroImage || img.heroPrimary}
          alt="Sewage pump manufacturing facility with stainless steel pipework"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/80 to-white" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      <div className="container-px flex min-h-screen flex-col justify-center pb-20 pt-32">
        <div className="max-w-4xl">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
          >
            {subtitle || t("hero.subtitle")}
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link href="/contact" className="btn-primary">
              {t("cta.getQuote")}
              <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
            </Link>
            <Link href="/products" className="btn-outline">
              {t("cta.exploreProducts")}
            </Link>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.dl
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.labelKey} className="bg-slate-50 p-5 text-center sm:p-6">
              <dd className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                {s.value}
              </dd>
              <dt className="mt-1 text-xs uppercase tracking-wide text-slate-500 sm:text-sm">
                {t(s.labelKey)}
              </dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
