import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KSB_HUB_PATH, KSB_ITEMS, isKsbValve, ksbDetailDescription, ksbPath } from "@/lib/ksb";
import { localeAlternates } from "@/lib/i18n/alternates";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { KSB_EN, KsbDetailView } from "@/components/ksb/KsbViews";

type Params = Promise<{ slug: string }>;

const find = (slug: string) => KSB_ITEMS.find((i) => i.slug === slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return KSB_ITEMS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const item = find((await params).slug);
  if (!item) return {};
  const description = ksbDetailDescription(item);
  return {
    title: item.title,
    description,
    alternates: { canonical: ksbPath(item), languages: localeAlternates(ksbPath(item)) },
    openGraph: {
      title: `${item.title} | Haquan Pump`,
      description,
      url: ksbPath(item),
      images: [{ url: item.image, width: 720, height: 540, alt: item.title }],
    },
  };
}

export default async function KsbSeriesPage({ params }: { params: Params }) {
  const item = find((await params).slug);
  if (!item) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: KSB_EN.crumb, path: KSB_HUB_PATH },
          { name: item.name, path: ksbPath(item) },
        ]}
      />
      <KsbDetailView T={KSB_EN} item={item} items={KSB_ITEMS} valve={isKsbValve(item)} />
    </>
  );
}
