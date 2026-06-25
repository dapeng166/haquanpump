"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/products/ProductCard";
import { useTranslation } from "@/lib/i18n/I18nProvider";

export function ProductPreview({ products }: { products: Product[] }) {
  const { t } = useTranslation();

  return (
    <Section className="bg-slate-50">
      <Container>
        <SectionHeading
          eyebrow="Product Range"
          title={t("sections.productsTitle")}
          subtitle={t("sections.productsSubtitle")}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.slug} index={i % 3} className="h-full">
              <ProductCard product={product} priority={i < 3} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="/products" className="btn-outline">
            {t("cta.viewProducts")}
            <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
