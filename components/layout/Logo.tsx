import Link from "next/link";
import { company } from "@/lib/site";

/** Inline SVG logo mark (impeller motif) + wordmark — no external asset. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${company.shortName} — home`}
    >
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-600 shadow-lg shadow-accent/30">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-charcoal-950"
          fill="none"
          aria-hidden
        >
          <path
            d="M12 12c0-4 1.5-7 4-8-1 3-1 5 0 8m-4 0c-4 0-7-1.5-8-4 3 1 5 1 8 0m0 0c0 4-1.5 7-4 8 1-3 1-5 0-8m0 0c4 0 7 1.5 8 4-3-1-5-1-8 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-white">
          HAQUAN
        </span>
        <span className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-accent-300">
          Pump &amp; Valve
        </span>
      </span>
    </Link>
  );
}
