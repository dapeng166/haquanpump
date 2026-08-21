import { company } from "@/lib/site";

/**
 * Organization structured data (JSON-LD) for the whole site.
 *
 * Emitted once from the root layout so search engines and AI/LLM crawlers can
 * identify Haquan as a single, consistent entity — legal name, logo, contact,
 * address and verified social profiles (sameAs). This is a core "GEO" signal:
 * it helps generative engines recognise and cite the company accurately.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    alternateName: company.shortName,
    url: company.url,
    logo: `${company.url}/logo-hq-color.svg`,
    foundingDate: String(company.founded),
    email: company.email,
    telephone: company.phone,
    description: company.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${company.address.line1}, ${company.address.line2}`,
      addressLocality: company.address.city,
      postalCode: company.address.postcode,
      addressCountry: "CN",
    },
    sameAs: [
      company.social.linkedin,
      company.social.facebook,
      company.social.x,
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
