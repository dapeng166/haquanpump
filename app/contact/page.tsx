import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, Phone, Clock, Linkedin, Youtube, Facebook, MessageCircle } from "lucide-react";
import { company } from "@/lib/site";
import { getSitePage, acfStr } from "@/lib/wordpress";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryForm } from "@/components/contact/InquiryForm";

export const metadata: Metadata = {
  title: "Contact Us — Request a Quote",
  description:
    "Contact Shanghai Haquan Pump Valve Manufacturing Co., Ltd. Request a quotation, ask our engineers, or visit us in Fengxian District, Shanghai. We respond within 24 hours.",
  alternates: { canonical: "/contact" },
};

const socials = [
  { href: company.social.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: company.social.youtube, icon: Youtube, label: "YouTube" },
  { href: company.social.facebook, icon: Facebook, label: "Facebook" },
  { href: company.social.whatsapp, icon: MessageCircle, label: "WhatsApp" },
];

export default async function ContactPage() {
  // Contact details are editable via the `contact` site_page record in WordPress.
  const page = await getSitePage("contact");
  const address = acfStr(page, "address_en", company.address.full);
  const phone = acfStr(page, "phone", company.phone);
  const email = acfStr(page, "email", company.email);
  const mapEmbed = acfStr(page, "map_embed_code");

  return (
    <Section className="pt-28 sm:pt-32">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2">
            {/* Contact details */}
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Contact Information
              </h2>
              <p className="mt-3 text-navy-100/65">
                Reach us directly, or send the inquiry form and we'll come back with a
                tailored recommendation and quotation.
              </p>

              <ul className="glass-card mt-8 space-y-5 p-7">
                <ContactRow icon={<MapPin className="h-5 w-5" />} title="Head Office">
                  {address}
                </ContactRow>
                <ContactRow icon={<Phone className="h-5 w-5" />} title="Phone / WhatsApp">
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-accent-300">
                    {phone}
                  </a>
                </ContactRow>
                <ContactRow icon={<Mail className="h-5 w-5" />} title="Email">
                  <a href={`mailto:${email}`} className="hover:text-accent-300">{email}</a>
                </ContactRow>
                <ContactRow icon={<Clock className="h-5 w-5" />} title="Business Hours">
                  Mon–Sat, 09:00–18:00 (GMT+8) · Online inquiries answered within 24h
                </ContactRow>
              </ul>

              <div className="mt-8">
                <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
                  Follow Us
                </div>
                <div className="flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-navy-100/70 transition-all hover:border-accent/50 hover:text-accent-300"
                    >
                      <s.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Embedded Google Map — CMS embed code if provided, else default. */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 [&_iframe]:block [&_iframe]:h-[280px] [&_iframe]:w-full">
                {mapEmbed ? (
                  <div dangerouslySetInnerHTML={{ __html: mapEmbed }} />
                ) : (
                  <iframe
                    title="Haquan Pump location — Fengxian District, Shanghai"
                    src={company.mapEmbed}
                    width="100%"
                    height="280"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="block grayscale-[0.3]"
                  />
                )}
              </div>
            </Reveal>

            {/* Form */}
            <Reveal index={1}>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Send an Inquiry
              </h2>
              <p className="mt-3 text-navy-100/65">
                Fields marked <span className="text-accent">*</span> are required.
              </p>
              <div className="glass-card mt-8 p-7 sm:p-9">
                <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-white/[0.03]" />}>
                  <InquiryForm />
                </Suspense>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
  );
}

function ContactRow({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-300 ring-1 ring-accent/20">
        {icon}
      </span>
      <div>
        <div className="font-semibold text-white">{title}</div>
        <div className="mt-1 text-sm leading-relaxed text-navy-100/65">{children}</div>
      </div>
    </li>
  );
}
