import type { Metadata } from "next";
import { getProducts, getSitePage, acfStr } from "@/lib/wordpress";
import { company, siteConfig } from "@/lib/site";
import { localeAlternates } from "@/lib/i18n/alternates";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { Advantages } from "@/components/home/Advantages";
import { ProductPreview } from "@/components/home/ProductPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCTA } from "@/components/home/FinalCTA";

// Statically cache the homepage and revalidate hourly. If a background
// revalidation fails (e.g. the CMS is briefly unreachable) Next keeps serving
// the last successful render, so the page never flips to the seed demo catalogue.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: siteConfig.defaultTitle,
  description: siteConfig.defaultDescription,
  alternates: { canonical: "/", languages: localeAlternates("/") },
};

// Structured data helps Google understand the manufacturer entity.
function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.url,
    foundingDate: String(company.founded),
    email: company.email,
    telephone: company.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${company.address.line1}, ${company.address.line2}`,
      addressLocality: company.address.city,
      postalCode: company.address.postcode,
      addressCountry: "CN",
    },
    sameAs: Object.values(company.social),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function HomePage() {
  const [products, page] = await Promise.all([getProducts(), getSitePage("home")]);
  const featured = products.filter((p) => p.featured);
  const preview = (featured.length >= 3 ? featured : products).slice(0, 9);

  // Editable-in-WordPress advantages (only used when all three are filled in).
  const cmsAdvantages = [1, 2, 3]
    .map((n) => ({
      title: acfStr(page, `advantage_${n}_title`),
      description: acfStr(page, `advantage_${n}_desc`),
    }))
    .filter((a) => a.title && a.description);

  // Editable testimonials (home site_page → "Testimonial 1–3"); shows whichever
  // are filled in, else the curated quotes.
  const cmsTestimonials = [1, 2, 3]
    .map((n) => ({
      quote: acfStr(page, `testimonial_${n}_quote`),
      author: acfStr(page, `testimonial_${n}_name`),
      role: acfStr(page, `testimonial_${n}_company`),
    }))
    .filter((tt) => tt.quote && tt.author);

  return (
    <>
      <OrganizationJsonLd />
      <Hero subtitle={page?.subtitle} heroImage={page?.heroImage} />
      <TrustBar text={acfStr(page, "trust_bar_text") || undefined} />
      <Advantages items={cmsAdvantages.length === 3 ? cmsAdvantages : undefined} />
      <ProductPreview products={preview} />
      <Testimonials items={cmsTestimonials.length > 0 ? cmsTestimonials : undefined} />
      <FinalCTA />
    </>
  );
}
