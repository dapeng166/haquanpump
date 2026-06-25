import Link from "next/link";
import { company } from "@/lib/site";

/**
 * Flowing "HQ" monogram — a blue H of ribbon-like strokes beside a red→amber Q
 * whose tail sweeps off like moving water. Inline SVG, crisp at any size.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${company.shortName} — home`}
    >
      <svg
        viewBox="0 0 66 40"
        className="h-9 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
        fill="none"
        role="img"
        aria-label="HQ"
      >
        <defs>
          <linearGradient id="hq-blue" x1="6" y1="4" x2="24" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="hq-warm" x1="34" y1="8" x2="64" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EF4444" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* H — ribbon strokes + a waved crossbar for flow */}
          <g stroke="url(#hq-blue)" strokeWidth="6">
            <path d="M8 5 C5.6 15 5.6 25 8 35" />
            <path d="M22 5 C24.4 15 24.4 25 22 35" />
            <path d="M7.5 20 C12.5 16 17.5 24 22.5 20" />
          </g>
          {/* Q — swirl ring + a tail that streams off like water */}
          <circle cx="44" cy="20" r="11.5" stroke="url(#hq-warm)" strokeWidth="6" />
          <path d="M49.5 25 C53.5 29 56.5 32 62 37.5" stroke="url(#hq-warm)" strokeWidth="6" />
        </g>
      </svg>

      <span className="flex flex-col leading-none">
        <span
          translate="no"
          className="font-display text-lg font-bold uppercase tracking-tight text-slate-900"
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
