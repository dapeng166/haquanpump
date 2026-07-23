import Link from "next/link";
import { company } from "@/lib/site";

/**
 * The registered "HQ" monogram — a hand-drawn brush H flowing into a Q whose
 * tail streams off like water. Served from /public as SVG so the (fairly long)
 * outline is fetched and cached once instead of inlined into every page.
 *
 * Two colour cuts: the standard gradient for light surfaces, and a lifted-blue
 * cut for the navy header and footer — at full saturation the blue H sinks into
 * the navy and the mark reads as if its left half were missing.
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
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${company.shortName} — home`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={onDark ? "/logo-hq-color-dark.svg" : "/logo-hq-color.svg"}
        alt="HQ"
        className="h-9 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
      />

      <span className="flex flex-col leading-none">
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
