"use client";

import { Quote } from "lucide-react";
import { testimonials } from "@/lib/data/content";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n/I18nProvider";

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title={t("sections.testimonialsTitle")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.author} index={i} className="h-full">
              <figure className="glass-card flex h-full flex-col p-7">
                <Quote className="h-8 w-8 text-accent/60" aria-hidden />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-navy-100/80">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <div className="font-semibold text-white">{item.author}</div>
                  <div className="text-sm text-navy-100/50">{item.role}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
