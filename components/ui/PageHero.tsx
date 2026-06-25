import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Container } from "./Primitives";

type Crumb = { label: string; href?: string };

/** Reusable banner for inner pages: background image, title, intro, breadcrumb. */
export function PageHero({
  title,
  intro,
  image,
  eyebrow,
  breadcrumbs = [],
}: {
  title: string;
  intro?: string;
  image: string;
  eyebrow?: string;
  breadcrumbs?: Crumb[];
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-slate-200">
      <div className="absolute inset-0 -z-10">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <Container className="pb-16 pt-28 sm:pb-20 sm:pt-32">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <li>
              <Link href="/" className="inline-flex items-center gap-1 hover:text-accent-600">
                <Home className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">Home</span>
              </Link>
            </li>
            {breadcrumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 rtl-flip text-slate-300" aria-hidden />
                {c.href ? (
                  <Link href={c.href} className="hover:text-accent-600">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-slate-900">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            {intro}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
