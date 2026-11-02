import type { Metadata } from "next";
import { KSB_HUB_PATH, KSB_PUMPS, KSB_VALVES } from "@/lib/ksb";
import { localeAlternates } from "@/lib/i18n/alternates";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { KSB_EN, KsbHubView } from "@/components/ksb/KsbViews";

export const metadata: Metadata = {
  title: KSB_EN.metaTitle,
  description: KSB_EN.metaDesc,
  alternates: { canonical: KSB_HUB_PATH, languages: localeAlternates(KSB_HUB_PATH) },
  openGraph: {
    title: `${KSB_EN.metaTitle} | Haquan Pump`,
    description: KSB_EN.metaDesc,
    url: KSB_HUB_PATH,
    images: [{ url: KSB_PUMPS[0].image, width: 720, height: 540, alt: `KSB ${KSB_PUMPS[0].name}` }],
  },
};

export default function KsbHubPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: KSB_EN.crumb, path: KSB_HUB_PATH },
        ]}
      />
      <KsbHubView T={KSB_EN} pumps={KSB_PUMPS} valves={KSB_VALVES} />
    </>
  );
}
