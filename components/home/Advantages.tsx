"use client";

import { Factory, Gauge, Globe2, type LucideIcon } from "lucide-react";
import { advantages } from "@/lib/data/content";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n/I18nProvider";

const icons: Record<string, LucideIcon> = { Factory, Gauge, Globe2 };
const iconCycle: LucideIcon[] = [Factory, Gauge, Globe2];

type Advantage = { icon?: string; title: string; description: string };

export function Advantages({ items }: { items?: Advantage[] }) {
  const { t } = useTranslation();
  // Use CMS-provided advantages when present, otherwise the built-in defaults.
  const list: Advantage[] = items && items.length > 0 ? items : advantages;

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Why Haquan"
          title={t("sections.advantagesTitle")}
          subtitle={t("sections.advantagesSubtitle")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {list.map((adv, i) => {
            const Icon = (adv.icon && icons[adv.icon]) || iconCycle[i % iconCycle.length];
            return (
              <Reveal key={adv.title} index={i}>
                <div className="glass-card group h-full p-7">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent-300 ring-1 ring-accent/20 transition-colors group-hover:bg-accent group-hover:text-charcoal-950">
                    <Icon className="h-7 w-7" aria-hidden />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-white">
                    {adv.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-100/65">
                    {adv.description}
                  </p>
                  <span className="mt-6 block h-px w-full bg-gradient-to-r from-accent/40 to-transparent" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
