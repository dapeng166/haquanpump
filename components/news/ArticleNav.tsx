import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { NewsPost } from "@/lib/types";

/**
 * Previous/Next navigation for news articles — two keyword-anchored internal
 * links per page. Shared by the English (`/news/…`) and localized
 * (`/[locale]/news/…`) routes; `hrefBase` prefixes the locale, and `labels`
 * arrive already translated.
 */
export function ArticleNav({
  prev = null,
  next = null,
  hrefBase = "",
  labels,
}: {
  prev?: NewsPost | null;
  next?: NewsPost | null;
  hrefBase?: string;
  labels: { previous: string; next: string };
}) {
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="Article navigation"
      className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8"
    >
      {prev ? (
        <Link
          href={`${hrefBase}/news/${prev.slug}`}
          className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-accent/50 hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5 shrink-0 text-slate-400 rtl-flip transition-colors group-hover:text-accent-600" aria-hidden />
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              {labels.previous}
            </span>
            <span className="block truncate font-medium text-slate-900 group-hover:text-accent-600">
              {prev.title}
            </span>
          </span>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={`${hrefBase}/news/${next.slug}`}
          className="group flex items-center justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 text-right transition-colors hover:border-accent/50 hover:bg-slate-50"
        >
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              {labels.next}
            </span>
            <span className="block truncate font-medium text-slate-900 group-hover:text-accent-600">
              {next.title}
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 rtl-flip transition-colors group-hover:text-accent-600" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
