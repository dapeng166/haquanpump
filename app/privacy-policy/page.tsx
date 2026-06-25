import type { Metadata } from "next";
import { company } from "@/lib/site";
import { Container, Section } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Shanghai Haquan Pump Valve Manufacturing Co., Ltd. — how we collect, use and safeguard your information.",
  alternates: { canonical: "/privacy-policy" },
};

// Rendered as semantic HTML/JSX (no Markdown processing), per requirements.
export default function PrivacyPolicyPage() {
  return (
    <Section className="pt-28">
      <Container>
        <article className="legal mx-auto max-w-3xl text-slate-600 [&_a]:text-accent-600 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_strong]:text-slate-900">
          <h2>Privacy Policy</h2>
          <p>Last updated: 2026-01-01</p>

          <p>
            {company.name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to
            protecting your privacy. This Privacy Policy explains how we collect, use, and
            safeguard your information when you visit our website.
          </p>

          <p>
            <strong>Information We Collect:</strong>
            <br />
            We may collect your name, email address, phone number, company name, and any message
            you submit via our contact form, as well as non-personal data such as browser type and
            IP address via cookies.
          </p>

          <p>
            <strong>How We Use Your Information:</strong>
            <br />
            - To respond to inquiries and provide quotations
            <br />
            - To improve our website and customer service
            <br />
            - To comply with applicable laws
          </p>

          <p>
            <strong>Data Protection:</strong>
            <br />
            We do not sell or rent your personal information. Appropriate technical measures are in
            place to protect your data.
          </p>

          <p>
            <strong>Contact Us:</strong>
            <br />
            If you have questions about this Privacy Policy, please contact us at:
            <br />
            Email: <a href="mailto:sales@haquanpump.com">sales@haquanpump.com</a>
            <br />
            Tel: <a href="tel:+8615000577161">+86 150 0057 7161</a>
            <br />
            Address: No. 868, Jinqi Road, Fengxian District, Shanghai 201400, China
          </p>
        </article>
      </Container>
    </Section>
  );
}
