"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Renders trusted HTML but caps it to a fixed height when collapsed, with a
 * fade-out and a Read more / Show less toggle. Long CMS descriptions no longer
 * stretch the page; short ones show in full with no button.
 */
export function ExpandableHtml({
  html,
  className = "",
  collapsedHeight = 360,
}: {
  html: string;
  className?: string;
  collapsedHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setOverflows(ref.current.scrollHeight > collapsedHeight + 24);
    }
  }, [html, collapsedHeight]);

  const collapsed = !expanded && overflows;

  return (
    <div>
      <div className="relative">
        <div
          ref={ref}
          className={className}
          style={collapsed ? { maxHeight: collapsedHeight, overflow: "hidden" } : undefined}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {collapsed && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-charcoal-950 to-transparent" />
        )}
      </div>
      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-300 transition-colors hover:text-accent"
        >
          {expanded ? "Show less" : "Read more"}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      )}
    </div>
  );
}
