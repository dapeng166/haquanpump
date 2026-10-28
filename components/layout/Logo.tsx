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
      <span className="inline-flex flex-col items-center transition-transform duration-300 group-hover:scale-105">
        <span className="relative inline-flex items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={onDark ? "/logo-hqan-white.svg" : "/logo-hqan.svg"}
            alt="HQAN"
            className="h-8 w-auto"
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
        <span
          translate="no"
          className={`mt-1 text-[0.55rem] font-semibold uppercase leading-none tracking-[0.28em] ${
            onDark ? "text-blue-300" : "text-accent-600"
          }`}
        >
          Pump &amp; Valve
        </span>
      </span>
    </Link>
  );
}
