"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Droplets, Gauge, Zap } from "lucide-react";
import type { Product } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/I18nProvider";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { t } = useTranslation();

  return (
    <article className="group glass-card flex h-full flex-col overflow-hidden p-0">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <Image
          src={product.image}
          alt={`${product.name} — ${product.seriesName} by Haquan`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 360px"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-slate-300 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur">
          {product.seriesName}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] font-display text-lg font-semibold text-slate-900 transition-colors group-hover:text-accent-600">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-slate-500">
          {product.excerpt}
        </p>

        {/* Key specs at a glance */}
        <dl className="mt-4 grid grid-cols-3 gap-2 border-y border-slate-200 py-3 text-center">
          <SpecMini icon={<Droplets className="h-3.5 w-3.5" />} label={t("specs.flow")} value={`${product.specs.flowRate}`} unit="m³/h" />
          <SpecMini icon={<Gauge className="h-3.5 w-3.5" />} label={t("specs.head")} value={`${product.specs.head}`} unit="m" />
          <SpecMini icon={<Zap className="h-3.5 w-3.5" />} label={t("specs.power")} value={`${product.specs.power}`} unit="kW" />
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 transition-colors hover:text-accent"
          >
            {t("cta.viewDetails")}
            <ArrowUpRight className="h-4 w-4 rtl-flip" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

function SpecMini({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1 text-accent-600">{icon}</div>
      <div className="mt-1 truncate text-xs font-semibold text-slate-900" title={`${value} ${unit}`}>
        {value}
      </div>
      <div className="text-[0.65rem] uppercase tracking-wide text-slate-400">
        {label} ({unit})
      </div>
    </div>
  );
}
