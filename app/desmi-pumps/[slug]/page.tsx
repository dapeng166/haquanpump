import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DESMI_HUB_PATH, DESMI_ITEMS, desmiDetailDescription, desmiPath } from "@/lib/desmi";
import { localeAlternates } from "@/lib/i18n/alternates";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { DESMI_EN, DesmiDetailView } from "@/components/desmi/DesmiViews";

type Params = Promise<{ slug: string }>;

const find = (slug: string) => DESMI_ITEMS.find((i) => i.slug === slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return DESMI_ITEMS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const item = find((await params).slug);
  if (!item) return {};
  const description = desmiDetailDescription(item);
  return {
    title: item.title,
    description,
    alternates: { canonical: desmiPath(item), languages: localeAlternates(desmiPath(item)) },
    openGraph: {
      title: `${item.title} | Haquan Pump`,
      description,
      url: desmiPath(item),
      images: [{ url: item.image, width: 720, height: 540, alt: item.title }],
    },
  };
}

export default async function DesmiSeriesPage({ params }: { params: Params }) {
  const item = find((await params).slug);
  if (!item) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: DESMI_EN.crumb, path: DESMI_HUB_PATH },
          { name: item.name, path: desmiPath(item) },
        ]}
      />
      <DesmiDetailView T={DESMI_EN} item={item} items={DESMI_ITEMS} />
    </>
  );
}
