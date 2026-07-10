"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { NewsPost } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n/I18nProvider";

const PER_PAGE = 6;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function NewsGrid({
  posts,
  hrefBase = "",
  labels,
}: {
  posts: NewsPost[];
  /** Locale URL prefix, e.g. "/es". Empty for the English (root) routes. */
  hrefBase?: string;
  /** Pre-translated labels for localized routes. Falls back to t(). */
  labels?: { readMore: string; previous: string; next: string };
}) {
  const { t } = useTranslation();
  const L = labels ?? {
    readMore: t("cta.readMore"),
    previous: t("common.previous"),
    next: t("common.next"),
  };
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const visible = posts.slice(start, start + PER_PAGE);

  function go(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((post, i) => (
          <Reveal as="div" key={post.slug} index={i % 3} className="h-full">
            <article className="group glass-card flex h-full flex-col overflow-hidden p-0">
              <Link href={`${hrefBase}/news/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-slate-300 bg-white/70 px-3 py-1 text-xs font-medium text-accent-600 backdrop-blur">
                  {post.category}
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" aria-hidden /> {formatDate(post.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden /> {post.readingTime} min
                  </span>
                </div>
                <h2 className="mt-3 line-clamp-2 min-h-[3.5rem] font-display text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-accent-600">
                  <Link href={`${hrefBase}/news/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-2 line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-slate-500">
                  {post.excerpt}
                </p>
                <Link
                  href={`${hrefBase}/news/${post.slug}`}
                  className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-accent-600 hover:text-accent"
                >
                  {L.readMore}
                  <ArrowUpRight className="h-4 w-4 rtl-flip" aria-hidden />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Pagination">
          <button
            type="button"
            onClick={() => go(Math.max(1, page - 1))}
            disabled={page === 1}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-accent/50 hover:text-slate-900 disabled:opacity-40"
            aria-label={L.previous}
          >
            <ChevronLeft className="h-4 w-4 rtl-flip" aria-hidden />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => go(n)}
              aria-current={n === page}
              className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${
                n === page
                  ? "border-accent bg-accent/10 text-accent-600"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => go(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-accent/50 hover:text-slate-900 disabled:opacity-40"
            aria-label={L.next}
          >
            <ChevronRight className="h-4 w-4 rtl-flip" aria-hidden />
          </button>
        </nav>
      )}
    </div>
  );
}
