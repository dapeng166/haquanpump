import Image from "next/image";
import Link from "next/link";
import type { ToolProduct } from "@/lib/tools/catalogue";
import { fmt } from "@/lib/tools/hydraulics";

const range = ([a, b]: [number, number]) => (a === b ? fmt(a) : `${fmt(a)}–${fmt(b)}`);

/** Products from the WordPress catalogue that fit the duty point. */
export function CatalogueMatches({
  items,
}: {
  items: { product: ToolProduct; kind: "close" | "covers" }[];
}) {
  return (
    <section className="glass-card p-6 hover:shadow-sm">
      <h2 className="font-display text-lg font-bold text-slate-900">Matching pumps in our catalogue</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map(({ product: p, kind }) => (
          <li key={p.slug}>
            <Link
              href={`/products/${p.slug}`}
              className="group flex gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-accent/50 hover:bg-slate-50"
            >
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {p.image ? (
                  <Image src={p.image} alt="" fill sizes="64px" className="object-contain" />
                ) : null}
              </span>
              <span className="min-w-0">
                <span className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-accent-700">
                  {p.name}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  {range(p.flow)} m³/h · {range(p.head)} m
                </span>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    kind === "close" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {kind === "close" ? "Close to your duty" : "Range covers your duty"}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
