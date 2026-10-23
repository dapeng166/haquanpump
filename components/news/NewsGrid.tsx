"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { NewsPost } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { paginationRange } from "@/lib/pagination";
import { SERIES_SHORT, GENERAL_SERIES } from "@/lib/newsSeries";

const PER_PAGE = 9;

type Group = "all" | "news" | "guide" | "case";
const GROUPS: Group[] = ["all", "news", "guide", "case"];

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
  seriesLabels,
}: {
  posts: NewsPost[];
  /** Translated short series names (localized routes); defaults to SERIES_SHORT. */
  seriesLabels?: Record<string, string>;
  /** Locale URL prefix, e.g. "/es". Empty for the English (root) routes. */
  hrefBase?: string;
  /** Pre-translated labels for localized routes. Falls back to t(). */
  labels?: {
    readMore: string;
    previous: string;
    next: string;
    all: string;
    company: string;
    guides: string;
    cases: string;
    allSeries: string;
    general: string;
  };
}) {
  const { t } = useTranslation();
  const L = labels ?? {
    readMore: t("cta.readMore"),
    previous: t("common.previous"),
    next: t("common.next"),
    all: t("newsFilter.all"),
    company: t("newsFilter.company"),
    guides: t("newsFilter.guides"),
    cases: t("newsFilter.cases"),
    allSeries: t("newsFilter.allSeries"),
    general: t("newsFilter.general"),
  };
  const seriesOf = (p: NewsPost) => p.seriesSlug ?? GENERAL_SERIES;
  const seriesName = (slug: string) =>
    slug === GENERAL_SERIES
      ? L.general
      : (seriesLabels?.[slug] ?? SERIES_SHORT[slug] ?? posts.find((p) => p.seriesSlug === slug)?.seriesName ?? slug);
  const groupLabel: Record<Group, string> = { all: L.all, news: L.company, guide: L.guides, case: L.cases };
  const [page, setPage] = useState(1);
  const [group, setGroup] = useState<Group>("all");
  // Second-level filter, only under Technical Guides: one chip per pump series.
  const [series, setSeries] = useState("all");
  const inGroup = (p: NewsPost, g: Group) => g === "all" || (p.group ?? "news") === g;
  const guides = posts.filter((p) => inGroup(p, "guide"));
  const seriesCounts = new Map<string, number>();
  for (const p of guides) seriesCounts.set(seriesOf(p), (seriesCounts.get(seriesOf(p)) ?? 0) + 1);
  // Biggest series first, the catch-all "General" chip last.
  const seriesList = [...seriesCounts.entries()]
    .sort((a, b) => (a[0] === GENERAL_SERIES ? 1 : b[0] === GENERAL_SERIES ? -1 : b[1] - a[1]))
    .map(([slug, count]) => ({ slug, count }));
  const activeSeries = group === "guide" && seriesCounts.has(series) ? series : "all";
  const filtered = posts.filter(
    (p) => inGroup(p, group) && (activeSeries === "all" || seriesOf(p) === activeSeries),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const start = (Math.min(page, totalPages) - 1) * PER_PAGE;
  const visible = filtered.slice(start, start + PER_PAGE);

  // The page number lives in the URL (?page=) so "back" from an article
  // returns to the page you were on instead of page 1. Read from
  // window.location (not useSearchParams) so the server-rendered HTML keeps
  // page 1's cards without needing a Suspense fallback.
  useEffect(() => {
    function syncFromUrl() {
      const q = new URLSearchParams(window.location.search);
      const cat = q.get("cat") as Group | null;
      setGroup(cat && GROUPS.includes(cat) ? cat : "all");
      setSeries(q.get("series") ?? "all");
      setPage(Math.max(1, parseInt(q.get("page") ?? "1", 10) || 1));
    }
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  function writeUrl(g: Group, n: number, sr = "all") {
    const url = new URL(window.location.href);
    if (g !== "all") url.searchParams.set("cat", g);
    else url.searchParams.delete("cat");
    if (g === "guide" && sr !== "all") url.searchParams.set("series", sr);
    else url.searchParams.delete("series");
    if (n > 1) url.searchParams.set("page", String(n));
    else url.searchParams.delete("page");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }

  function choose(g: Group) {
    setGroup(g);
    setSeries("all");
    setPage(1);
    writeUrl(g, 1);
  }

  function chooseSeries(sr: string) {
    setSeries(sr);
    setPage(1);
    writeUrl("guide", 1, sr);
  }

  function go(next: number) {
    setPage(next);
    // replaceState: paging shouldn't add history entries, but the URL must hold
    // the page (and filter) so returning from an article lands back here.
    writeUrl(group, next, activeSeries);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div role="tablist" aria-label="Filter" className="flex flex-wrap justify-center gap-3">
        {GROUPS.map((g) => {
          const count = posts.filter((p) => inGroup(p, g)).length;
          if (g !== "all" && count === 0) return null;
          const on = g === group;
          return (
            <button
              key={g}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => choose(g)}
              // Hover scales the whole chip (transform), so neighbours never shift.
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-base transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:border-accent/60 hover:bg-accent/5 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 motion-reduce:transition-none motion-reduce:hover:transform-none ${
                on
                  ? "border-accent bg-accent/10 font-semibold text-accent-600"
                  : "border-slate-200 font-medium text-slate-700"
              }`}
            >
              {groupLabel[g]}
              <span className="text-sm font-normal text-slate-400">{count}</span>
            </button>
          );
        })}
      </div>
      {group === "guide" && seriesList.length > 1 && (
        <div role="tablist" aria-label="Pump series" className="mt-5 flex flex-wrap justify-center gap-2">
          {[{ slug: "all", count: guides.length }, ...seriesList].map(({ slug, count }) => {
            const on = slug === activeSeries;
            return (
              <button
                key={slug}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => chooseSeries(slug)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition duration-200 ease-out hover:scale-105 hover:border-accent/60 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 motion-reduce:transition-none motion-reduce:hover:transform-none ${
                  on
                    ? "border-accent bg-accent/10 font-semibold text-accent-600"
                    : "border-slate-200 bg-white font-medium text-slate-600"
                }`}
              >
                {slug === "all" ? L.allSeries : seriesName(slug)}
                <span className="text-xs font-normal text-slate-400">{count}</span>
              </button>
            );
          })}
        </div>
      )}
      <div className="mb-10" />
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
                  className={`${post.seriesSlug ? "bg-white object-contain" : "object-cover"} transition-transform duration-700 group-hover:scale-105`}
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
          {paginationRange(page, totalPages).map((token, i) =>
            token === "ellipsis" ? (
              <span
                key={`e${i}`}
                className="inline-flex h-10 min-w-10 items-center justify-center px-1 text-sm text-slate-400"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={token}
                type="button"
                onClick={() => go(token)}
                aria-current={token === page}
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${
                  token === page
                    ? "border-accent bg-accent/10 text-accent-600"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {token}
              </button>
            ),
          )}
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
