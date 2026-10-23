import type { Metadata } from "next";
import { getNews } from "@/lib/wordpress";
import { img } from "@/lib/images";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Primitives";
import { NewsGrid } from "@/components/news/NewsGrid";
import { localeAlternates } from "@/lib/i18n/alternates";

export const metadata: Metadata = {
  title: "Pump News, Technical Guides & Case Studies",
  description:
    "Company news, technical guides and real order case studies from Haquan Pump — practical pump selection, installation, maintenance and troubleshooting advice for buyers worldwide.",
  alternates: { canonical: "/news", languages: localeAlternates("/news") },
};

export default async function NewsPage() {
  // Cards only need the summary fields; leave the article bodies out of the
  // client payload (the list holds every guide and case study).
  const posts = (await getNews()).map((p) => ({ ...p, content: "" }));

  return (
    <>
      <PageHero
        eyebrow="News & Guides"
        title="Pump News, Technical Guides & Case Studies"
        intro="Company news, technical guides on selection, installation, maintenance and troubleshooting, and real order cases from the Haquan engineering team."
        image={img.supportHero}
        breadcrumbs={[{ label: "News & Guides" }]}
      />
      <Section>
        <Container>
          <NewsGrid posts={posts} />
        </Container>
      </Section>
    </>
  );
}
