import type { Metadata } from "next";
import { company } from "@/lib/site";
import { Container, Section } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for the Shanghai Haquan Pump Valve Manufacturing Co., Ltd. website — intellectual property, disclaimer and governing law.",
  alternates: { canonical: "/terms-of-use" },
};

// Rendered as semantic HTML/JSX (no Markdown processing), per requirements.
export default function TermsOfUsePage() {
  return (
    <Section className="pt-28">
      <Container>
        <article className="legal mx-auto max-w-3xl text-slate-600 [&_a]:text-accent-600 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_strong]:text-slate-900">
          <h2>Terms of Use</h2>
          <p>Last updated: 2026-01-01</p>

          <p>
            By accessing this website operated by {company.name}, you agree to be bound by these
            Terms of Use.
          </p>

          <p>
            <strong>Intellectual Property:</strong>
            <br />
            All content, logos, product images, and text on this site are the property of{" "}
            {company.name} and may not be reproduced without written permission.
          </p>

          <p>
            <strong>Disclaimer:</strong>
            <br />
            We make every effort to ensure accuracy; however, product specifications and images are
            for reference only and may be subject to change without notice. We shall not be liable
            for any indirect or consequential damages arising from the use of this website.
          </p>

          <p>
            <strong>Governing Law:</strong>
            <br />
            These terms shall be governed by and construed in accordance with the laws of the
            People&apos;s Republic of China.
          </p>

          <p>
            <strong>Contact:</strong>
            <br />
            <a href="mailto:sales@haquanpump.com">sales@haquanpump.com</a>
          </p>
        </article>
      </Container>
    </Section>
  );
}
