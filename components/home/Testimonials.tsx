"use client";

import { Quote } from "lucide-react";
import { testimonials as seedTestimonials } from "@/lib/data/content";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n/I18nProvider";

type Testimonial = { quote: string; author: string; role: string };

/** Editable via WordPress (home site_page → "Testimonial 1–3"); falls back to
 *  the curated quotes when none are provided. */
export function Testimonials({ items }: { items?: Testimonial[] }) {
  const { t } = useTranslation();
  const list = items && items.length > 0 ? items : seedTestimonials;

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title={t("sections.testimonialsTitle")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {list.map((item, i) => (
            <Reveal key={`${item.author}-${i}`} index={i} className="h-full">
              <figure className="glass-card flex h-full flex-col p-7">
                <Quote className="h-8 w-8 text-accent/60" aria-hidden />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-slate-200 pt-4">
                  <div className="font-semibold text-slate-900">{item.author}</div>
                  <div className="text-sm text-slate-500">{item.role}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
