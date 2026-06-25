import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Target, Eye, ShieldCheck, Wrench, Globe2, BadgeCheck } from "lucide-react";
import { company } from "@/lib/site";
import { milestones } from "@/lib/data/content";
import { img } from "@/lib/images";
import { getSitePage, acfStr } from "@/lib/wordpress";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About Us — Industrial Pump Manufacturer Since 2014",
  description:
    "Founded in 2014, Shanghai Haquan Pump Valve Manufacturing Co., Ltd. engineers and manufactures industrial pumps for global B2B clients across mining, municipal, marine and process industries.",
  alternates: { canonical: "/about" },
};

const differentiators = [
  { icon: Wrench, title: "Vertically Integrated", text: "Casting, machining, motor winding and assembly in-house — quality controlled end to end." },
  { icon: ShieldCheck, title: "Tested Before Shipment", text: "Every pump is hydrostatically and performance tested before it leaves our factory." },
  { icon: Globe2, title: "Export Expertise", text: "Complete export documentation, seaworthy packing and multilingual support for 60+ countries." },
  { icon: BadgeCheck, title: "Application-First", text: "We size to your duty point and medium rather than pushing a catalogue compromise." },
];

export default async function AboutPage() {
  // Story, mission and hero are editable via the `about` site_page record.
  const page = await getSitePage("about");
  const storyParas = acfStr(page, "story_text")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="About Haquan"
        title="A Decade of Engineering Reliable Fluid Solutions"
        intro={
          page?.subtitle ||
          "Since 2014, Shanghai Haquan has grown from a specialist pump workshop into a global industrial manufacturer trusted across the world's most demanding industries."
        }
        image={page?.heroImage || img.aboutFactory}
        breadcrumbs={[{ label: "About" }]}
      />

      {/* Brand story */}
      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <span className="eyebrow">Our Story</span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Built on Hydraulics, Driven by Reliability
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                {storyParas.length > 0 ? (
                  storyParas.map((para, i) => <p key={i}>{para}</p>)
                ) : (
                  <>
                    <p>
                      {company.name} was founded in {company.founded} in Fengxian District,
                      Shanghai, with a simple conviction: industrial buyers deserve pumps that
                      are engineered for their exact application — not generic units that fail
                      early in the field.
                    </p>
                    <p>
                      Today we manufacture more than 200 pump models across six core series —
                      sewage, grinder, self-priming, stainless submersible, AODD and pipeline
                      centrifugal — shipping to customers in over 60 countries. From mine
                      dewatering in the Andes to municipal lifting stations in Southeast Asia,
                      Haquan pumps keep critical processes flowing.
                    </p>
                    <p>
                      Our growth has been earned one duty point at a time: precise hydraulic
                      selection, robust materials, rigorous testing and after-sales support that
                      international buyers can rely on.
                    </p>
                  </>
                )}
              </div>
              <Link href="/products" className="btn-primary mt-8">
                Explore Our Pumps
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
            </Reveal>

            <Reveal index={1}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-slate-200">
                <Image
                  src={img.aboutTeam}
                  alt="Haquan engineers inspecting an industrial pump on the factory floor"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                <div className="glass-strong absolute bottom-5 left-5 right-5 rounded-2xl p-5">
                  <div className="font-display text-2xl font-bold text-slate-900">Since {company.founded}</div>
                  <div className="text-sm text-slate-500">Shanghai, China · Exporting worldwide</div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Mission & Vision */}
      <Section className="bg-slate-50">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="glass-card h-full p-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent-600 ring-1 ring-accent/20">
                  <Target className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-slate-900">Our Mission</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {acfStr(
                    page,
                    "mission_text",
                    "To engineer dependable, energy-efficient pumping solutions that keep the world's water, wastewater and process industries running — backed by honest engineering advice and responsive global support.",
                  )}
                </p>
              </div>
            </Reveal>
            <Reveal index={1}>
              <div className="glass-card h-full p-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent-600 ring-1 ring-accent/20">
                  <Eye className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-slate-900">Our Vision</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  To be the partner of choice for industrial buyers worldwide who value
                  technical precision over the lowest price — recognised for hydraulics that
                  last and service that earns repeat orders.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Differentiators */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="What Sets Us Apart"
            title="Why Buyers Standardise on Haquan"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((d, i) => (
              <Reveal key={d.title} index={i} className="h-full">
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

      {/* Timeline */}
      <Section className="bg-slate-50">
        <Container>
          <SectionHeading eyebrow="Our Journey" title="Milestones" />
          <ol className="relative mx-auto max-w-3xl border-l border-slate-200 pl-8">
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.year} index={i} className="mb-10 last:mb-0">
                <span className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-accent bg-white" />
                <div className="font-display text-xl font-bold text-accent-600">{m.year}</div>
                <p className="mt-1 leading-relaxed text-slate-600">{m.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container>
          <Reveal>
            <div className="glass-strong flex flex-col items-center justify-between gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-left">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                  Let's engineer the right pump for your process.
                </h2>
                <p className="mt-2 text-slate-600">
                  Share your duty point — we'll respond with a recommendation within 24 hours.
                </p>
              </div>
              <Link href="/contact" className="btn-primary shrink-0">
                Get a Quote
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
