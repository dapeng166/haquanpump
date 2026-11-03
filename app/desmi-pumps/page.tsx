import type { Metadata } from "next";
import { DESMI_HUB_PATH, DESMI_ITEMS } from "@/lib/desmi";
import { localeAlternates } from "@/lib/i18n/alternates";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { DESMI_EN, DesmiHubView } from "@/components/desmi/DesmiViews";

export const metadata: Metadata = {
  title: DESMI_EN.metaTitle,
  description: DESMI_EN.metaDesc,
  alternates: { canonical: DESMI_HUB_PATH, languages: localeAlternates(DESMI_HUB_PATH) },
  openGraph: {
    title: `${DESMI_EN.metaTitle} | Haquan Pump`,
    description: DESMI_EN.metaDesc,
    url: DESMI_HUB_PATH,
    images: [{ url: DESMI_ITEMS[1].image, width: 720, height: 540, alt: `DESMI ${DESMI_ITEMS[1].name}` }],
  },
};

export default function DesmiHubPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: DESMI_EN.crumb, path: DESMI_HUB_PATH },
        ]}
      />
      <DesmiHubView T={DESMI_EN} items={DESMI_ITEMS} />
    </>
  );
}
