import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, Phone, Clock, Linkedin, Facebook } from "lucide-react";
import QRCode from "qrcode";
import { company } from "@/lib/site";
import { getSitePage, acfStr } from "@/lib/wordpress";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsappIcon } from "@/components/ui/WhatsappIcon";
import { XIcon } from "@/components/ui/XIcon";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { localeAlternates } from "@/lib/i18n/alternates";

export const metadata: Metadata = {
  title: "Contact Us — Request a Quote",
  description:
    "Contact Shanghai Haquan Pump Valve Manufacturing Co., Ltd. Request a quotation, ask our engineers, or visit us in Fengxian District, Shanghai. We respond within 24 hours.",
  alternates: { canonical: "/contact", languages: localeAlternates("/contact") },
};

const socials = [
  { href: company.social.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: company.social.facebook, icon: Facebook, label: "Facebook" },
  { href: company.social.x, icon: XIcon, label: "X" },
  { href: company.social.whatsapp, icon: WhatsappIcon, label: "WhatsApp" },
];

export default async function ContactPage() {
  // Contact details are editable via the `contact` site_page record in WordPress.
  const page = await getSitePage("contact");
  const address = acfStr(page, "address_en", company.address.full);
  const phone = acfStr(page, "phone", company.phone);
  const email = acfStr(page, "email", company.email);
  const mapEmbed = acfStr(page, "map_embed_code");

  // WhatsApp click-to-chat QR — encodes the wa.me link, so scanning it opens a
  // chat with us. Generated server-side (no external image, works in China).
  const whatsappLink = company.social.whatsapp;
  const whatsappQr = await QRCode.toString(whatsappLink, {
    type: "svg",
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  return (
    <Section className="pt-28 sm:pt-32">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2">
            {/* Contact details */}
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                Contact Information
              </h2>
              <p className="mt-3 text-slate-600">
                Reach us directly, or send the inquiry form and we'll come back with a
                tailored recommendation and quotation.
              </p>

              <ul className="glass-card mt-8 space-y-5 p-7">
                <ContactRow icon={<MapPin className="h-5 w-5" />} title="Head Office">
                  {address}
                </ContactRow>
                <ContactRow icon={<Phone className="h-5 w-5" />} title="Phone / WhatsApp">
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-accent-600">
                    {phone}
                  </a>
                </ContactRow>
                <ContactRow icon={<Mail className="h-5 w-5" />} title="Email">
                  <a href={`mailto:${email}`} className="hover:text-accent-600">{email}</a>
                </ContactRow>
                <ContactRow icon={<Clock className="h-5 w-5" />} title="Business Hours">
                  Mon–Sat, 09:00–18:00 (GMT+8) · Online inquiries answered within 24h
                </ContactRow>
              </ul>

              <div className="mt-8">
                <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900">
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
                      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:border-accent/50 hover:text-accent-600"
                    >
                      <s.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp — scan the code (desktop) or tap to chat (mobile) */}
              <div className="glass-card mt-8 flex items-center gap-5 p-6">
                <div
                  className="h-28 w-28 shrink-0 rounded-xl border border-slate-200 bg-white p-2 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: whatsappQr }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <WhatsappIcon className="h-5 w-5 text-[#25D366]" /> WhatsApp
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Scan the code, or tap to chat — we reply quickly.
                  </p>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1da851]"
                  >
                    <WhatsappIcon className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal index={1}>
              <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                Send an Inquiry
              </h2>
              <p className="mt-3 text-slate-600">
                Fields marked <span className="text-accent">*</span> are required.
              </p>
              <div className="glass-card mt-8 p-7 sm:p-9">
                <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-slate-50" />}>
                  <InquiryForm />
                </Suspense>
              </div>
            </Reveal>
          </div>

          {/* Full-width map below both columns */}
          <Reveal className="mt-12">
            <div className="overflow-hidden rounded-2xl border border-slate-200 [&_iframe]:block [&_iframe]:h-[360px] [&_iframe]:w-full sm:[&_iframe]:h-[440px]">
              {mapEmbed ? (
                <div dangerouslySetInnerHTML={{ __html: mapEmbed }} />
              ) : (
                <iframe
                  title="Haquan Pump location — Fengxian District, Shanghai"
                  src={company.mapEmbed}
                  width="100%"
                  height="440"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block grayscale-[0.3]"
                />
              )}
            </div>
          </Reveal>
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
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-600 ring-1 ring-accent/20">
        {icon}
      </span>
      <div>
        <div className="font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-sm leading-relaxed text-slate-600">{children}</div>
      </div>
    </li>
  );
}
