import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Download,
  Droplets,
  Gauge,
  Zap,
  Ruler,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/wordpress";
import { company } from "@/lib/site";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductCard } from "@/components/products/ProductCard";
import { ExpandableHtml } from "@/components/ui/ExpandableHtml";

// Pre-render known products; new WordPress products render on-demand (ISR).
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} — ${product.seriesName}`,
    description: product.excerpt,
    keywords: product.seoKeywords
      ? product.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : undefined,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | Haquan Pump`,
      description: product.excerpt,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  const specRows = [
    { icon: Droplets, label: "Flow Rate", value: product.specs.flowRate, unit: "m³/h" },
    { icon: Gauge, label: "Head", value: product.specs.head, unit: "m" },
    { icon: Zap, label: "Power", value: product.specs.power, unit: "kW" },
    { icon: Ruler, label: "Inlet / Outlet Diameter", value: product.specs.diameter, unit: "mm" },
    { icon: Layers, label: "Material", value: product.specs.material, unit: "" },
  ];

  // Product structured data for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.excerpt,
    sku: product.model,
    category: product.seriesName,
    brand: { "@type": "Brand", name: "Haquan" },
    manufacturer: { "@type": "Organization", name: company.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section className="pt-28">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-accent-600">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/products" className="hover:text-accent-600">Products</Link></li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/products?series=${product.seriesSlug}`} className="hover:text-accent-600">
                  {product.seriesName}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Gallery */}
            <Reveal>
              <ProductGallery images={product.gallery} alt={`${product.name} — ${product.seriesName}`} />
            </Reveal>

            {/* Summary + specs */}
            <Reveal index={1}>
              <span className="eyebrow">{product.seriesName}</span>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm font-medium text-accent-600">Model: {product.model}</p>
              <p className="mt-5 line-clamp-4 text-base leading-relaxed text-slate-600">{product.excerpt}</p>

              {/* Specification table */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-slate-900">
                  Specifications
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {specRows.map((row) => (
                      <tr key={row.label} className="border-b border-slate-100 last:border-0">
                        <th scope="row" className="w-1/2 px-5 py-3.5 text-left font-medium text-slate-500">
                          <span className="inline-flex items-center gap-2">
                            <row.icon className="h-4 w-4 text-accent-600" aria-hidden />
                            {row.label}
                          </span>
                        </th>
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          {row.value}
                          {row.unit ? <span className="ml-1 text-slate-500">{row.unit}</span> : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="btn-primary flex-1">
                  Inquire About This Product
                  <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
                </Link>
                <a
                  href={product.brochureUrl || "#"}
                  className="btn-outline flex-1"
                  {...(product.brochureUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Download Brochure (PDF)
                </a>
              </div>
            </Reveal>
          </div>

          {/* Description + applications */}
          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-slate-900">Product Overview</h2>
              {/* Capped height + Read more so long CMS descriptions don't stretch the page. */}
              <ExpandableHtml
                html={product.description}
                className="prose-invert mt-4 space-y-4 text-base leading-relaxed text-slate-600 [&_p]:mb-4"
              />
            </Reveal>
            <Reveal index={1}>
              <div className="glass-card p-6">
                <h3 className="font-display text-lg font-semibold text-slate-900">Typical Applications</h3>
                <ul className="mt-4 space-y-2.5">
                  {product.applications.map((a) => (
                    <li key={a} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-600" aria-hidden />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section className="bg-slate-50">
          <Container>
            <h2 className="mb-10 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Related Products
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
