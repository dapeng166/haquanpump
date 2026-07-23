import type { Product } from "@/lib/types";
import { company } from "@/lib/site";

/** schema.org requires absolute URLs; CMS images already are, fallbacks may not be. */
function absolute(url: string): string {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `${company.url}${url.startsWith("/") ? "" : "/"}${url}`;
}

function property(name: string, value: string, unitText?: string) {
  const clean = (value || "").trim();
  if (!clean) return null;
  return { "@type": "PropertyValue", name, value: clean, ...(unitText ? { unitText } : {}) };
}

/**
 * Product structured data.
 *
 * The duty-point specs are the genuinely useful part for search engines — flow,
 * head, power and port size are what buyers actually search on — so they go in
 * as `additionalProperty` rather than being left buried in the page body.
 *
 * No `offers` block: prices are quote-only, and publishing a placeholder price
 * to unlock the price rich result would be false. Everything here is data the
 * page actually states.
 */
export function ProductJsonLd({
  product,
  path,
  locale,
}: {
  product: Product;
  path: string;
  locale?: string;
}) {
  const images = [product.image, ...(product.gallery ?? [])]
    .filter(Boolean)
    .map(absolute)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 6);

  const specs = [
    property("Flow rate", product.specs?.flowRate, "m³/h"),
    property("Head", product.specs?.head, "m"),
    property("Power", product.specs?.power, "kW"),
    property("Inlet / outlet diameter", product.specs?.diameter, "mm"),
  ].filter(Boolean);

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url: `${company.url}${path}`,
    ...(images.length ? { image: images } : {}),
    description: product.excerpt,
    ...(product.model ? { sku: product.model, mpn: product.model } : {}),
    category: product.seriesName,
    ...(product.specs?.material ? { material: product.specs.material } : {}),
    ...(product.applications?.length ? { keywords: product.applications.join(", ") } : {}),
    ...(specs.length ? { additionalProperty: specs } : {}),
    ...(locale ? { inLanguage: locale } : {}),
    brand: { "@type": "Brand", name: "Haquan" },
    manufacturer: {
      "@type": "Organization",
      name: company.name,
      url: company.url,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${company.address.line1}, ${company.address.line2}`,
        addressLocality: company.address.city,
        postalCode: company.address.postcode,
        addressCountry: "CN",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
