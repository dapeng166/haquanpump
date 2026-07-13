import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { getNewsBySlug, getAdjacentNews } from "@/lib/wordpress";
import { company } from "@/lib/site";
import { Container, Section } from "@/components/ui/Primitives";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ArticleNav } from "@/components/news/ArticleNav";
import { isIndexableLocale, dirForLocale, type Locale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { translateNewsPost } from "@/lib/i18n/translateNews";
import { translate, translateMany } from "@/lib/i18n/translate";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isIndexableLocale(locale)) return {};
  const post = await getNewsBySlug(slug);
  if (!post) return { title: "Article Not Found" };
  const [title, excerpt] = await translateMany([post.title, post.excerpt], locale);
  const path = `/news/${post.slug}`;
  return {
    title,
    description: excerpt,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: localeAlternates(path),
    },
    openGraph: {
      type: "article",
      title,
      description: excerpt,
      images: [{ url: post.image, alt: title }],
      publishedTime: post.date,
    },
  };
}

function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function LocalizedNewsArticlePage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug } = await params;
  if (!isIndexableLocale(locale)) notFound();

  const source = await getNewsBySlug(slug);
  if (!source) notFound();

  const post = await translateNewsPost(source, locale);
  const [
    backToNews,
    minRead,
    ctaTitle,
    ctaText,
    getQuote,
    homeLabel,
    newsLabel,
    prevLabel,
    nextLabel,
  ] = await translateMany(
    [
      "Back to News",
      "min read",
      "Need a pump for your application?",
      "Our engineers respond to technical inquiries within 24 hours.",
      "Get a Quote",
      "Home",
      "News",
      "Previous",
      "Next",
    ],
    locale,
  );

  // Only the neighbour's title is shown, so translate just that.
  const adjacent = await getAdjacentNews(source).then(async ({ prev, next }) => ({
    prev: prev ? { ...prev, title: await translate(prev.title, locale) } : null,
    next: next ? { ...next, title: await translate(next.title, locale) } : null,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    image: [post.image],
    datePublished: post.date,
    author: { "@type": "Organization", name: company.name },
    publisher: { "@type": "Organization", name: company.name },
    description: post.excerpt,
    inLanguage: locale,
  };

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: homeLabel, path: `/${locale}` },
          { name: newsLabel, path: `/${locale}/news` },
          { name: post.title, path: `/${locale}/news/${source.slug}` },
        ]}
      />
      <Section className="pt-28">
        <Container>
          <article className="mx-auto max-w-3xl">
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4 rtl-flip" aria-hidden /> {backToNews}
            </Link>

            <span className="mt-6 inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-600">
              {post.category}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden /> {formatDate(post.date, locale)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden /> {post.readingTime} {minRead}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" aria-hidden /> {post.author}
              </span>
            </div>

            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200">
              <Image src={post.image} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            </div>

            <div
              className="cms-content mt-10 space-y-5 text-lg leading-relaxed text-slate-600 [&_a]:text-accent-600 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_p]:mb-5"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <ArticleNav
              prev={adjacent.prev}
              next={adjacent.next}
              hrefBase={`/${locale}`}
              labels={{ previous: prevLabel, next: nextLabel }}
            />

            <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <h2 className="font-display text-xl font-bold text-slate-900">{ctaTitle}</h2>
              <p className="mt-2 text-slate-600">{ctaText}</p>
              <Link href={`/${locale}/products`} className="btn-primary mt-5">
                {getQuote}
              </Link>
            </div>
          </article>
        </Container>
      </Section>
    </div>
  );
}
