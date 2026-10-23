import { ShieldCheck, PackageCheck, FileText, Clock, Factory, ClipboardCheck } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

/** English source strings; localized routes translate these before rendering.
 *  Every line is a commitment the owner confirmed (2026-10-23) — don't add
 *  claims here without that. */
export const EN_AFTER_SALES = {
  eyebrow: "Quality & After-Sales",
  title: "What You Can Count On After You Order",
  subtitle: "Plain commitments, so you know exactly what comes with a Haquan pump.",
  warrantyTitle: "12-Month Warranty",
  warrantyText:
    "12 months from the shipping date, for our own pumps and genuine Wilden pumps alike, with lifetime maintenance support and wearing parts supplied at factory price.",
  sparesTitle: "Spare Parts in Stock",
  sparesText:
    "Common spare parts are kept in our warehouse and ship within 2 working days of your order, genuine Wilden parts included.",
  docsTitle: "Test Reports on Request",
  docsText: "Need a test report or an installation diagram for your pump? Ask and we will provide it.",
  replyTitle: "Reply Within 24 Hours",
  replyText: "Every question gets an answer within 24 hours, from pump selection to installation and troubleshooting.",
  factoryTitle: "Built in Our Own Factory",
  factoryText:
    "Making pumps since 2014 to Chinese national (GB) standards, with machining, assembly and test running done in-house.",
  certTitle: "Certification Requirements",
  certText:
    "If your project needs a specific certification, tell us when you inquire and we will tell you plainly whether we can meet it.",
};

export type AfterSalesLabels = typeof EN_AFTER_SALES;

export function AfterSalesSection({ T = EN_AFTER_SALES }: { T?: AfterSalesLabels }) {
  const items = [
    { icon: ShieldCheck, title: T.warrantyTitle, text: T.warrantyText },
    { icon: PackageCheck, title: T.sparesTitle, text: T.sparesText },
    { icon: FileText, title: T.docsTitle, text: T.docsText },
    { icon: Clock, title: T.replyTitle, text: T.replyText },
    { icon: Factory, title: T.factoryTitle, text: T.factoryText },
    { icon: ClipboardCheck, title: T.certTitle, text: T.certText },
  ];
  return (
    <Section id="after-sales" className="scroll-mt-24">
      <Container>
        <SectionHeading eyebrow={T.eyebrow} title={T.title} subtitle={T.subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d, i) => (
            <Reveal key={d.title} index={i % 3} className="h-full">
              <div className="glass-card h-full p-6">
                <d.icon className="h-8 w-8 text-accent-600" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{d.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
