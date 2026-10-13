import type { Product } from "@/lib/types";
import { WILDEN_SERIES } from "@/lib/wilden";

/**
 * A product reduced to what the pump selector matches on. Flow and head are
 * [min, max]; `exact` products had a single figure (one model), the rest a
 * range (a series or an application article).
 */
export interface ToolProduct {
  slug: string;
  name: string;
  image: string;
  seriesSlug: string;
  seriesName: string;
  flow: [number, number];
  head: [number, number];
  exact: boolean;
}

/**
 * Parse a CMS spec field into [min, max]. Handles the ways figures are typed
 * in WordPress: "40", "8–800", "7 – 950", "2 ~ 2000", "0 – 50 / 70",
 * "up to 50", "20 m (working range 8–20 m)". Returns null when there is no
 * usable number ("model-dependent", "—") or the unit is not metric.
 */
export function parseRange(raw: string): [number, number] | null {
  // Zero-width spaces sneak in from copy-paste; text in brackets is usually a
  // conversion to other units, so only the part before "(" is trusted.
  let s = (raw || "").replace(/[​-‍﻿]/g, "").split("(")[0];
  if (/l\/min|lpm|gpm|psi|bar\b/i.test(s)) return null;
  // Drop model codes such as "QBYS-10" so their digits are not read as figures.
  s = s.replace(/\b[A-Za-z]{2,}-?\d+(\.\d+)?\b/g, " ");
  const nums = (s.match(/\d+(?:\.\d+)?/g) || []).map(Number).filter((n) => Number.isFinite(n));
  if (!nums.length) return null;
  if (nums.length === 1) return /up\s*to/i.test(s) ? [0, nums[0]] : [nums[0], nums[0]];
  return [Math.min(...nums), Math.max(...nums)];
}

export function toToolProducts(products: Product[]): ToolProduct[] {
  const out: ToolProduct[] = [];
  for (const p of products) {
    if (p.seriesSlug === WILDEN_SERIES) continue;
    const flow = parseRange(p.specs.flowRate);
    const head = parseRange(p.specs.head);
    if (!flow || !head || flow[1] <= 0 || head[1] <= 0) continue;
    out.push({
      slug: p.slug,
      name: p.name,
      image: p.image,
      seriesSlug: p.seriesSlug,
      seriesName: p.seriesName,
      flow,
      head,
      exact: flow[0] === flow[1] && head[0] === head[1],
    });
  }
  return out;
}

const ARTICLE =
  /troubleshoot|problems|how to|how the|guide|maintenance|install|commission|explained|\bvs\.?\b|\bwhy\b|\bwhat\b|tips|checklist|read a|selection/i;

/**
 * Catalogue entries for a duty point: single-model products close to it first
 * (a pump runs along its curve, so a model rated a little off the duty point
 * still fits), then at most one range entry per series that covers it, so a
 * series with dozens of application articles cannot flood the list.
 */
export function matchProducts(
  list: ToolProduct[],
  q: number,
  h: number,
  allowSeries: (slug: string) => boolean,
  limit = 6,
): { product: ToolProduct; kind: "close" | "covers" }[] {
  const ok = list.filter((p) => allowSeries(p.seriesSlug));
  const dist = (p: ToolProduct) => Math.abs(Math.log(p.flow[0] / q)) + Math.abs(Math.log(p.head[0] / h));
  const close = ok
    .filter(
      (p) =>
        p.exact &&
        p.flow[0] >= q * 0.7 &&
        p.flow[0] <= q * 1.5 &&
        p.head[0] >= h * 0.85 &&
        p.head[0] <= h * 1.35,
    )
    .sort((a, b) => dist(a) - dist(b))
    .slice(0, 4);
  const width = (p: ToolProduct) =>
    Math.log((p.flow[1] + 1) / (p.flow[0] + 1)) + Math.log((p.head[1] + 1) / (p.head[0] + 1));
  const seen = new Set<string>();
  const covers = ok
    .filter((p) => !p.exact && q >= p.flow[0] && q <= p.flow[1] && h >= p.head[0] && h <= p.head[1])
    // Range entries are often guides ("…Troubleshooting", "How to…"); list pumps only.
    .filter((p) => !ARTICLE.test(p.name))
    .sort((a, b) => width(a) - width(b))
    .filter((p) => (seen.has(p.seriesSlug) ? false : (seen.add(p.seriesSlug), true)));
  return [
    ...close.map((product) => ({ product, kind: "close" as const })),
    ...covers.map((product) => ({ product, kind: "covers" as const })),
  ].slice(0, limit);
}
