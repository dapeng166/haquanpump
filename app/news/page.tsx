import type { Metadata } from "next";
import { getNews } from "@/lib/wordpress";
import { img } from "@/lib/images";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Primitives";
import { NewsGrid } from "@/components/news/NewsGrid";

export const metadata: Metadata = {
  title: "News & Engineering Insights",
  description:
    "Product launches, technical guides and company news from Shanghai Haquan Pump — practical pump-selection advice and updates for industrial buyers worldwide.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const posts = await getNews();

  return (
    <>
      <PageHero
        eyebrow="Newsroom"
        title="News & Engineering Insights"
        intro="Product launches, practical pump-selection guides and company updates from the Haquan engineering team."
        image={img.supportHero}
        breadcrumbs={[{ label: "News" }]}
      />
      <Section>
        <Container>
          <NewsGrid posts={posts} />
        </Container>
      </Section>
    </>
  );
}
