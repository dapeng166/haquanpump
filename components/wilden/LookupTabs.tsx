import Link from "next/link";

/**
 * Tabs linking the pages of a split lookup (one page per material or part
 * category). Plain links, so each page stays a separate, light static page.
 */
export function LookupTabs({
  label,
  tabs,
}: {
  label: string;
  tabs: { href: string; label: string; count: number; current: boolean }[];
}) {
  return (
    <nav aria-label={label} className="mb-6">
      <ul className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              aria-current={t.current ? "page" : undefined}
              className={
                t.current
                  ? "inline-flex items-center gap-1.5 rounded-full bg-accent-600 px-4 py-2 text-sm font-semibold text-white"
                  : "inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-accent-500 hover:text-accent-600"
              }
            >
              {t.label}
              <span className={t.current ? "text-white/80" : "text-slate-400"}>{t.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
