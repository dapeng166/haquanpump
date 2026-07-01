import type { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  Building2,
  Package,
  Newspaper,
  LifeBuoy,
  Mail,
  Scale,
  Code2,
  ChevronRight,
} from "lucide-react";
import { getProducts, getProductSeries, getNews } from "@/lib/wordpress";
import { company } from "@/lib/site";
import { img } from "@/lib/images";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Human-readable sitemap for the Shanghai Haquan Pump website — find every page, product series and resource in one place.",
  alternates: { canonical: "/sitemap" },
};

type LinkItem = { label: string; href: string };

function LinkColumn({
  icon: Icon,
  title,
  links,
}: {
  icon: typeof Home;
  title: string;
  links: LinkItem[];
}) {
  return (
    <div className="glass-card h-full p-6">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent-600 ring-1 ring-accent/20">
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <h2 className="font-display text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-accent-600"
            >
              <ChevronRight
                className="h-3.5 w-3.5 rtl-flip text-slate-300 transition-colors group-hover:text-accent-600"
                aria-hidden
              />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function SitemapPage() {
  const [products, series, news] = await Promise.all([
    getProducts(),
    getProductSeries(),
    getNews(),
  ]);

  const mainPages: LinkItem[] = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "News", href: "/news" },
    { label: "Technical Support", href: "/support" },
    { label: "Contact", href: "/contact" },
  ];

  // Only series that actually have products (hide empty/seeded categories).
  const seriesLinks: LinkItem[] = series
    .filter((s) => (s.count ?? 0) > 0)
    .map((s) => ({
      label: s.name,
      href: `/products?series=${s.slug}`,
    }));

  const productLinks: LinkItem[] = products.map((p) => ({
    label: p.name,
    href: `/products/${p.slug}`,
  }));

  const newsLinks: LinkItem[] = news.slice(0, 8).map((n) => ({
    label: n.title,
    href: `/news/${n.slug}`,
  }));

  const legalLinks: LinkItem[] = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms-of-use" },
    { label: "Contact / Get a Quote", href: "/contact" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Sitemap"
        title="Everything on This Website"
        intro="A quick index of every page on the Haquan site. Looking for the machine-readable version for search engines? It lives at /sitemap.xml."
        image={img.supportHero}
        breadcrumbs={[{ label: "Sitemap" }]}
      />

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Reveal index={0}>
              <LinkColumn icon={Home} title="Main Pages" links={mainPages} />
            </Reveal>
            <Reveal index={1}>
              <LinkColumn icon={Package} title="Pump Series" links={seriesLinks} />
            </Reveal>
            <Reveal index={2}>
              <LinkColumn icon={Building2} title="Products" links={productLinks} />
            </Reveal>
            <Reveal index={0}>
              <LinkColumn icon={Newspaper} title="News & Insights" links={newsLinks} />
            </Reveal>
            <Reveal index={1}>
              <LinkColumn icon={Scale} title="Legal & Contact" links={legalLinks} />
            </Reveal>
            <Reveal index={2}>
              <div className="glass-card flex h-full flex-col p-6">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent-600 ring-1 ring-accent/20">
                    <Code2 className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <h2 className="font-display text-lg font-semibold text-slate-900">For Search Engines</h2>
                </div>
                <p className="mt-5 flex-1 text-sm leading-relaxed text-slate-500">
                  The XML sitemap and robots file help search engines crawl and index the
                  site. These are technical files, not meant for browsing.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent"
                  >
                    <ChevronRight className="h-3.5 w-3.5 rtl-flip" aria-hidden /> /sitemap.xml
                  </a>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent"
                  >
                    <ChevronRight className="h-3.5 w-3.5 rtl-flip" aria-hidden /> /robots.txt
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Quick contact strip */}
          <Reveal>
            <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center sm:flex-row sm:text-left">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="h-5 w-5 text-accent-600" aria-hidden />
                <span className="text-sm">
                  Can&apos;t find what you need? Email{" "}
                  <a href={`mailto:${company.email}`} className="text-accent-600 hover:text-accent">
                    {company.email}
                  </a>
                </span>
              </div>
              <Link href="/contact" className="btn-primary shrink-0">
                <LifeBuoy className="h-4 w-4" aria-hidden /> Get a Quote
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
