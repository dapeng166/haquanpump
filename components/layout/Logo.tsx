import Link from "next/link";
import { company } from "@/lib/site";

/**
 * The HQAN mark — two sweeping arcs over the letters HQAN, traced from the
 * artwork filed as the Class 7 trademark application (still under review, so
 * it carries ™, never ®). Keep the outline exactly as filed: recolour it, but
 * don't redraw, stretch or split it.
 *
 * Two colour cuts: navy for light surfaces, white for the navy header/footer.
 */
export function Logo({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex shrink-0 items-center gap-3 ${className}`}
      aria-label={`${company.shortName} — home`}
    >
      <span className="relative inline-flex shrink-0 items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={onDark ? "/logo-hqan-white.svg" : "/logo-hqan.svg"}
          alt="HQAN"
          className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
        />
        <span
          aria-hidden
          className={`-mt-0.5 ml-0.5 text-[0.55rem] font-semibold leading-none ${
            onDark ? "text-white/80" : "text-slate-500"
          }`}
        >
          ™
        </span>
      </span>

      {/* The mark alone on phones: with the name beside it the header
          pushes its buttons off a 375px screen. */}
      <span
        className={`hidden flex-col border-l pl-3 leading-none sm:flex ${
          onDark ? "border-white/25" : "border-slate-300"
        }`}
      >
        <span
          translate="no"
          className={`font-display text-lg font-bold uppercase tracking-tight ${
            onDark ? "text-white" : "text-slate-900"
          }`}
        >
          Haquan
        </span>
        <span className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-accent-600">
          Pump &amp; Valve
        </span>
      </span>
    </Link>
  );
}
