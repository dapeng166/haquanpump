import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { getNews, getNewsBySlug } from "@/lib/wordpress";
import { company } from "@/lib/site";
import { Container, Section } from "@/components/ui/Primitives";

export async function generateStaticParams() {
  const posts = await getNews();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image, alt: post.title }],
      publishedTime: post.date,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    image: [post.image],
    datePublished: post.date,
    author: { "@type": "Organization", name: company.name },
    publisher: { "@type": "Organization", name: company.name },
    description: post.excerpt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section className="pt-28">
        <Container>
          <article className="mx-auto max-w-3xl">
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4 rtl-flip" aria-hidden /> Back to News
            </Link>

            <span className="mt-6 inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-600">
              {post.category}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden /> {formatDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden /> {post.readingTime} min read
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

            <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <h2 className="font-display text-xl font-bold text-slate-900">
                Need a pump for your application?
              </h2>
              <p className="mt-2 text-slate-600">
                Our engineers respond to technical inquiries within 24 hours.
              </p>
              <Link href="/contact" className="btn-primary mt-5">
                Get a Quote
              </Link>
            </div>
          </article>
        </Container>
      </Section>
    </>
  );
}
