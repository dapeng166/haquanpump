import { NextResponse } from "next/server";
import { getProducts, getNews } from "@/lib/wordpress";

// Lightweight, self-contained search index for the whole site: the six main
// pages plus every product and news article. The client palette fetches this
// once and filters it locally, so there is no per-keystroke server round-trip
// and no third-party search service. Rebuilt at most every few minutes (ISR).
export const revalidate = 300;

export type SearchDoc = {
  type: "Product" | "News" | "Page";
  title: string;
  excerpt: string;
  href: string;
  meta?: string;
  /** Extra terms folded into matching but not shown. */
  keywords?: string;
};

const PAGES: SearchDoc[] = [
  { type: "Page", title: "Home", excerpt: "Industrial pump manufacturer since 2014.", href: "/", keywords: "haquan home overview company landing" },
  { type: "Page", title: "About Us", excerpt: "Our story, factory, capabilities and mission.", href: "/about", keywords: "about history factory mission team company profile" },
  { type: "Page", title: "Products", excerpt: "Browse the full range of industrial pumps.", href: "/products", keywords: "products catalogue catalog pumps range series filter" },
  { type: "Page", title: "News", excerpt: "Latest company news, articles and updates.", href: "/news", keywords: "news blog articles updates press" },
  { type: "Page", title: "Support", excerpt: "Technical documents, FAQ and after-sales service.", href: "/support", keywords: "support faq downloads documents help service warranty manual" },
  { type: "Page", title: "Contact", excerpt: "Request a quote or reach our engineers.", href: "/contact", keywords: "contact quote rfq inquiry email phone address map location" },
];

export async function GET() {
  const [products, news] = await Promise.all([getProducts(), getNews()]);

  const productDocs: SearchDoc[] = products.map((p) => ({
    type: "Product",
    title: p.name,
    excerpt: p.excerpt,
    href: `/products/${p.slug}`,
    meta: p.seriesName,
    keywords: [p.model, p.seriesName, ...(p.applications ?? []), p.seoKeywords ?? ""]
      .filter(Boolean)
      .join(" "),
  }));

  const newsDocs: SearchDoc[] = news.map((n) => ({
    type: "News",
    title: n.title,
    excerpt: n.excerpt,
    href: `/news/${n.slug}`,
    meta: n.category,
    keywords: [n.category, n.author].filter(Boolean).join(" "),
  }));

  return NextResponse.json({ docs: [...PAGES, ...productDocs, ...newsDocs] });
}
