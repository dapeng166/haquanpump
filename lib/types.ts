// Shared domain types used by both the WordPress layer and seed data.

export interface PumpSeries {
  slug: string;
  name: string;
  description: string;
  /** Number of products in this series (for the filter chips). */
  count?: number;
}

export interface ProductSpecs {
  flowRate: string; // m³/h
  head: string; // m
  power: string; // kW
  diameter: string; // mm, inlet / outlet
  material: string;
}

export interface Product {
  slug: string;
  name: string;
  model: string;
  seriesSlug: string;
  seriesName: string;
  excerpt: string;
  /** May contain trusted HTML coming from WordPress. */
  description: string;
  image: string;
  gallery: string[];
  specs: ProductSpecs;
  applications: string[];
  brochureUrl?: string;
  featured?: boolean;
  /** Comma-separated SEO keywords (from the CMS), used in <meta keywords>. */
  seoKeywords?: string;
  /** Set when this `pump` entry is really a guide or case study (WP category);
   *  it then lives under /news and its /products URL redirects there. */
  kind?: "guide" | "case";
}

// Content for a single front-end page, sourced from the `site_page` CPT.
export interface SitePage {
  category: string; // home | about | support | contact
  title: string;
  subtitle: string;
  heroImage: string | null;
  ctaText: string;
  ctaLink: string;
  /** Raw ACF object for page-specific fields (advantages, faqs, etc.). */
  acf: Record<string, unknown>;
}

export interface NewsPost {
  slug: string;
  title: string;
  excerpt: string;
  /** May contain trusted HTML coming from WordPress. */
  content: string;
  image: string;
  date: string; // ISO
  author: string;
  category: string;
  readingTime: number; // minutes
  /** Section filter on the News & Guides page. */
  group?: "news" | "guide" | "case";
  /** Pump series a guide belongs to (guides that come from `pump` entries). */
  seriesSlug?: string;
  seriesName?: string;
}

// A downloadable technical document (Support page), from the `document` CPT.
export interface TechDocument {
  title: string;
  url: string;
  type: string;
}
