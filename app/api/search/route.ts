import { NextResponse } from "next/server";
import { getProducts, getNews, getDocuments, getSitePage } from "@/lib/wordpress";
import { supportFaqs } from "@/lib/supportFaqs";
import { seriesCodes } from "@/lib/searchCodes";

// Lightweight, self-contained search index for the whole site: the main pages,
// every product, news article, technical document and Support FAQ. The client
// palette fetches this each time it opens and filters locally, so there is no
// per-keystroke server round-trip and no third-party search service. Refreshed
// on publish via /api/revalidate, with a daily timed fallback.
export const revalidate = 86400;

export type SearchDoc = {
  type: "Product" | "Document" | "FAQ" | "News" | "Page";
  title: string;
  excerpt: string;
  /** Site path, or an absolute URL (documents open the PDF in a new tab). */
  href: string;
  meta?: string;
  /** Extra terms folded into matching but not shown. */
  keywords?: string;
  /** Pump series codes (e.g. "yw") so a full model number finds its datasheet. */
  codes?: string[];
};

const PAGES: SearchDoc[] = [
  { type: "Page", title: "Home", excerpt: "Sewage pump manufacturer since 2014.", href: "/", keywords: "haquan home overview company landing" },
  { type: "Page", title: "About Us", excerpt: "Our story, factory, capabilities and mission.", href: "/about", keywords: "about history factory mission team company profile" },
  { type: "Page", title: "Products", excerpt: "Browse the full range of sewage and process pumps.", href: "/products", keywords: "products catalogue catalog pumps range series filter" },
  { type: "Page", title: "WILDEN AODD Pumps", excerpt: "Genuine, original WILDEN pumps and spare parts.", href: "/wilden-aodd-pumps", keywords: "wilden aodd diaphragm spare parts pro-flo shift turbo-flo" },
  { type: "Page", title: "News", excerpt: "Latest company news, articles and updates.", href: "/news", keywords: "news blog articles updates press" },
  { type: "Page", title: "Support", excerpt: "Technical documents, FAQ and after-sales service.", href: "/support", keywords: "support faq downloads documents help service warranty manual datasheet" },
  { type: "Page", title: "Contact", excerpt: "Request a quote or reach our engineers.", href: "/contact", keywords: "contact quote rfq inquiry email phone address map location" },
];

const plainText = (html: string) =>
  html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();

export async function GET() {
  const [products, news, documents, supportPage] = await Promise.all([
    getProducts(),
    getNews(),
    getDocuments(),
    getSitePage("support"),
  ]);

  const productDocs: SearchDoc[] = products.map((p) => ({
    type: "Product",
    title: p.name,
    excerpt: p.excerpt,
    href: `/products/${p.slug}`,
    meta: p.seriesName,
    keywords: [p.model, p.seriesName, ...(p.applications ?? []), p.seoKeywords ?? ""]
      .filter(Boolean)
      .join(" "),
    codes: seriesCodes(`${p.name} ${p.model} ${p.seriesName}`),
  }));

  const documentDocs: SearchDoc[] = documents.map((d) => ({
    type: "Document",
    title: d.title,
    excerpt: `${d.type} (PDF download)`,
    href: d.url,
    meta: "Technical Support",
    keywords: `${d.type} datasheet manual parameters specification pdf download ${decodeURIComponent(d.url.split("/").pop() ?? "")}`,
    codes: seriesCodes(d.title),
  }));

  const faqDocs: SearchDoc[] = supportFaqs(supportPage).map((f) => ({
    type: "FAQ",
    title: f.q,
    excerpt: f.a,
    href: "/support#faq",
    meta: "FAQ",
  }));

  const newsDocs: SearchDoc[] = news.map((n) => ({
    type: "News",
    title: n.title,
    excerpt: n.excerpt,
    href: `/news/${n.slug}`,
    meta: n.category,
    // Article body too, so a term mentioned only inside a post still finds it.
    // Capped to keep the index small (it is fetched each time search opens).
    keywords: [n.category, n.author, plainText(n.content).slice(0, 4000)].filter(Boolean).join(" "),
    codes: seriesCodes(`${n.title} ${plainText(n.content)}`),
  }));

  return NextResponse.json({
    docs: [...PAGES, ...productDocs, ...documentDocs, ...faqDocs, ...newsDocs],
  });
}
