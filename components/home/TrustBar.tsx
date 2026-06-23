"use client";

import { industries } from "@/lib/site";

// Edge-faded marquee of served industries — reinforces breadth at a glance.
// An optional CMS `text` line renders above the marquee when provided.
export function TrustBar({ text }: { text?: string }) {
  const items = [...industries, ...industries]; // duplicate for seamless loop

  return (
    <div className="border-y border-white/10 bg-charcoal-900/50 py-6">
      {text ? (
        <p className="container-px mb-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-navy-100/60">
          {text}
        </p>
      ) : null}
      <div className="mask-fade-x overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
          {items.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="flex items-center gap-10 text-sm font-medium uppercase tracking-[0.2em] text-navy-100/40"
            >
              {name}
              <span className="h-1.5 w-1.5 rounded-full bg-accent/50" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
