import { redirect, notFound } from "next/navigation";
import { isIndexableLocale } from "@/lib/i18n/config";

type Params = Promise<{ locale: string }>;

export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

// Pilot covers the products section; send the locale root to the localized
// products listing until a full localized home page is built.
export default async function LocalizedHome({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isIndexableLocale(locale)) notFound();
  redirect(`/${locale}/products`);
}
