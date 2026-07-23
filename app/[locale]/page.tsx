import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles, Factory, Gauge, Globe2, Quote, PhoneCall, type LucideIcon } from "lucide-react";
import { company, industries } from "@/lib/site";
import { stats, advantages, testimonials } from "@/lib/data/content";
import { img } from "@/lib/images";
import { getProducts } from "@/lib/wordpress";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/products/ProductCard";
import { isIndexableLocale, dirForLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";
import { translateMany } from "@/lib/i18n/translate";
import { translateProductCard } from "@/lib/i18n/translateProduct";
import { cardLabels } from "@/lib/i18n/uiLabels";

type Params = Promise<{ locale: string }>;

// Localized home renders on demand (ISR); discovered via sitemap + hreflang.
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

// English source copy — translated at render time so every indexable locale
// works regardless of dictionary completeness (mirrors about/support/contact).
const EN = {
  metaTitle: "Sewage Pumps, WILDEN AODD, Submersible, Self-Priming & Centrifugal Pumps | Haquan",
  metaDesc:
    "Shanghai Haquan Pump Valve Manufacturing Co., Ltd. is a professional sewage pump manufacturer, engineering high-performance pumps for wastewater, food & beverage, irrigation, biopharmaceutical, municipal septic-tank and petrochemical industries — delivered to 60+ countries.",
  heroBadge: "Trusted Pump Manufacturer Since 2014",
  // Superlatives ("toughest", "most demanding") translate into 最… in Chinese,
  // which China's Advertising Law prohibits — keep the copy comparative-free.
  heroTitle: "Sewage Pumps Engineered for Demanding Industries",
  heroSubtitle:
    "Shanghai Haquan Pump Valve Manufacturing Co., Ltd. is a professional sewage pump manufacturer, engineering high-performance pumps for wastewater discharge, food & beverage, farmland irrigation, biopharmaceutical, municipal septic-tank treatment and petrochemical industries — delivered to 60+ countries.",
  getQuote: "Get a Quote",
  exploreProducts: "Explore Products",
  viewProducts: "View All Products",
  statExperience: "Years of Expertise",
  statCountries: "Countries Served",
  statModels: "Pump Models",
  statDelivered: "Units Delivered",
  whyEyebrow: "Why Haquan",
  advantagesTitle: "Why Global Buyers Choose Haquan",
  advantagesSubtitle:
    "A decade of engineering discipline, in-house manufacturing and export experience behind every pump we ship.",
  rangeEyebrow: "Product Range",
  productsTitle: "Our Pump Series",
  productsSubtitle:
    "We manufacture and supply WILDEN AODD diaphragm pumps, stainless-steel sewage pumps, ZW self-priming pumps, YW submersible sewage pumps, the QBY diaphragm series, irrigation & drainage mobile pump trucks, GNWQ cutter sewage pumps, IHG/IHW/IRG/IRW pipeline pumps, metering pumps, high-head sewage pumps, QDX submersible pumps and QD oil-filled submersible pumps.",
  testimonialsEyebrow: "Testimonials",
  testimonialsTitle: "Trusted by Industry Leaders",
  ctaTitle: "Ready to Solve Your Fluid Challenge?",
  ctaSubtitle:
    "Send us your duty point and application — our engineers will recommend the right pump and return a quotation within 24 hours.",
};

const iconCycle: LucideIcon[] = [Factory, Gauge, Globe2];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) return {};
  const [title, description] = await translateMany([EN.metaTitle, EN.metaDesc], locale);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${locale}`, languages: localeAlternates("/") },
  };
}

export default async function LocalizedHome({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();

  const products = await getProducts();
  const featured = products.filter((p) => p.featured);
  const preview = (featured.length >= 3 ? featured : products).slice(0, 6);

  // Translate every static string, the industry names, the advantages and the
  // testimonials in batched calls, plus the featured product cards.
  const enKeys = Object.keys(EN) as (keyof typeof EN)[];
  const [
    staticValues,
    industryT,
    advTitles,
    advDescs,
    testiQuotes,
    testiAuthors,
    testiRoles,
    previewCards,
  ] = await Promise.all([
    translateMany(enKeys.map((k) => EN[k]), locale),
    translateMany([...industries], locale),
    translateMany(advantages.map((a) => a.title), locale),
    translateMany(advantages.map((a) => a.description), locale),
    translateMany(testimonials.map((t) => t.quote), locale),
    translateMany(testimonials.map((t) => t.author), locale),
    translateMany(testimonials.map((t) => t.role), locale),
    Promise.all(preview.map((p) => translateProductCard(p, locale))),
  ]);
  const T = Object.fromEntries(enKeys.map((k, i) => [k, staticValues[i]])) as typeof EN;
  const statLabels = [T.statExperience, T.statCountries, T.statModels, T.statDelivered];
  const labels = cardLabels(locale);
  const marquee = [...industryT, ...industryT];

  return (
    <div dir={dirForLocale(locale)} lang={locale}>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={img.heroPrimary}
            alt="Sewage pump manufacturing facility with stainless steel pipework"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/80 to-white" />
          <div className="absolute inset-0 bg-radial-glow" />
          <div className="absolute inset-0 bg-grid opacity-40" />
        </div>

        <div className="container-px flex min-h-screen flex-col justify-center pb-20 pt-32">
          <div className="max-w-4xl">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {T.heroBadge}
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl">
              {T.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{T.heroSubtitle}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={`/${locale}/contact`} className="btn-primary">
                {T.getQuote}
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
              <Link href={`/${locale}/products`} className="btn-outline">
                {T.exploreProducts}
              </Link>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.labelKey} className="bg-slate-50 p-5 text-center sm:p-6">
                <dd className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">{s.value}</dd>
                <dt className="mt-1 text-xs uppercase tracking-wide text-slate-500 sm:text-sm">
                  {statLabels[i]}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Industries marquee */}
      <div className="border-y border-slate-200 bg-slate-50 py-6">
        <div className="mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
            {marquee.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex items-center gap-10 text-sm font-medium uppercase tracking-[0.2em] text-slate-400"
              >
                {name}
                <span className="h-1.5 w-1.5 rounded-full bg-accent/50" aria-hidden />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Advantages */}
      <Section>
        <Container>
          <SectionHeading eyebrow={T.whyEyebrow} title={T.advantagesTitle} subtitle={T.advantagesSubtitle} />
          <div className="grid gap-6 md:grid-cols-3">
            {advantages.map((adv, i) => {
              const Icon = iconCycle[i % iconCycle.length];
              return (
                <Reveal key={adv.title} index={i} className="h-full">
                  <div className="glass-card group h-full p-7">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent-600 ring-1 ring-accent/20 transition-colors group-hover:bg-accent group-hover:text-white">
                      <Icon className="h-7 w-7" aria-hidden />
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold text-slate-900">{advTitles[i]}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{advDescs[i]}</p>
                    <span className="mt-6 block h-px w-full bg-gradient-to-r from-accent/40 to-transparent" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Product preview */}
      <Section className="bg-slate-50">
        <Container>
          <SectionHeading eyebrow={T.rangeEyebrow} title={T.productsTitle} subtitle={T.productsSubtitle} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {previewCards.map((product, i) => (
              <Reveal key={product.slug} index={i % 3} className="h-full">
                <ProductCard product={product} priority={i < 3} hrefBase={`/${locale}`} labels={labels} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href={`/${locale}/products`} className="btn-outline">
              {T.viewProducts}
              <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
            </Link>
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section>
        <Container>
          <SectionHeading eyebrow={T.testimonialsEyebrow} title={T.testimonialsTitle} />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <Reveal key={`${item.author}-${i}`} index={i} className="h-full">
                <figure className="glass-card flex h-full flex-col p-7">
                  <Quote className="h-8 w-8 text-accent/60" aria-hidden />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                    “{testiQuotes[i]}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-slate-200 pt-4">
                    <div className="font-semibold text-slate-900">{testiAuthors[i]}</div>
                    <div className="text-sm text-slate-500">{testiRoles[i]}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-3xl border border-slate-200 px-6 py-16 text-center sm:px-12 sm:py-20">
              <Image src={img.ctaBackground} alt="" fill sizes="100vw" className="-z-10 object-cover" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-900/95 via-white/92 to-white/95" />
              <div className="absolute inset-0 -z-10 bg-radial-glow" />
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {T.ctaTitle}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                {T.ctaSubtitle}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href={`/${locale}/contact`} className="btn-primary">
                  {T.getQuote}
                  <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
                </Link>
                <a href={`tel:${company.phoneHref}`} className="btn-outline">
                  <PhoneCall className="h-4 w-4" aria-hidden />
                  {company.phone}
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
