import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/wordpress";
import { toToolProducts } from "@/lib/tools/catalogue";
import { PumpSelector } from "@/components/tools/PumpSelector";
import { ToolPage, TOOLS_PATH, type Faq } from "@/components/tools/ToolPage";

const PATH = `${TOOLS_PATH}/pump-selector`;
const DESCRIPTION =
  "Free sewage pump selector: enter flow rate, head, liquid and installation to get suitable pump types, an estimated motor power, outlet size and an example model.";

export const metadata: Metadata = {
  title: "Sewage Pump Selector — Find the Right Pump by Flow & Head",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
};

const faqs: Faq[] = [
  {
    q: "What information do I need to select a sewage pump?",
    a: "The two essential figures are the flow rate (m³/h, L/s or GPM) and the total head (m). It also helps to know the liquid (clean water, sewage with solids, sewage with fibres, or a chemical or viscous liquid), how the pump will be installed (in the pit, above the pit or beside it), the preferred material and the power supply.",
  },
  {
    q: "Should I choose a submersible, vertical or self-priming sewage pump?",
    a: "A submersible pump sits in the pit, needs no priming and has no suction lift, so it is the most common choice for sewage. A vertical submerged pump keeps the motor dry above the pit, which makes maintenance easier. A self-priming pump is installed above the liquid; it is easy to service but can only lift liquid up to about 5 m on suction.",
  },
  {
    q: "When do I need a cutter (grinder) pump?",
    a: "Choose a cutter pump when the sewage contains rags, wet wipes, long fibres, hair or plastics. The cutter at the inlet shreds these solids so they cannot wrap around the impeller and block the pump.",
  },
  {
    q: "How is the motor power estimated?",
    a: "The selector calculates the hydraulic power (ρ·g·Q·H), divides it by a typical pump efficiency for the flow rate, adds a 15% margin and rounds up to the next standard motor size. The motor of the final model can be one size larger, which our engineers confirm with the actual pump curve.",
  },
  {
    q: "Is the example model number a real Haquan model?",
    a: "It follows the Haquan model code: outlet size (mm), series, flow (m³/h), head (m) and motor power (kW). For example, 80QW40-15-4 means a DN80 QW submersible sewage pump for 40 m³/h at 15 m with a 4 kW motor. Send us your figures and we confirm the exact model and its performance curve.",
  },
];

// Static (ISR) like the catalogue; refreshed on every WordPress product publish
// via /api/revalidate, so new pumps are matched straight away.
export default async function PumpSelectorPage() {
  const catalogue = toToolProducts(await getProducts());
  return (
    <ToolPage
      path={PATH}
      name="Pump Selector"
      title="Sewage Pump Selector"
      intro="Enter your flow rate, head and site conditions to see which pump types fit, with an estimated motor power, outlet size and an example model number."
      description={DESCRIPTION}
      tool={<PumpSelector catalogue={catalogue} />}
      faqs={faqs}
      howItWorks={
        <>
          <h2>How the pump selector works</h2>
          <p>
            The selector compares your duty point with the flow and head range of each Haquan pump
            series, then filters by liquid, installation, material and power supply. Series that are the
            first choice for your liquid are listed first: for example, a cutter pump ranks highest for
            sewage with rags and fibres.
          </p>
          <h3>Motor power estimate</h3>
          <p>
            Hydraulic power is <code>P = ρ · g · Q · H</code>, with Q in m³/s and H in metres. Dividing by
            the pump efficiency gives the shaft power. Small non-clog sewage pumps run at around 30%
            efficiency and large ones at 65 to 70%, so the selector uses a conservative figure for your flow
            and adds a 15% margin before rounding up to a standard motor size.
          </p>
          <h3>Outlet size</h3>
          <p>
            The suggested outlet keeps the discharge velocity between about 1.5 and 3.5 m/s. Sewage pumps
            start at DN50 so that solids can pass through.
          </p>
          <h3>Self-priming pumps and suction lift</h3>
          <p>
            A self-priming pump installed above the liquid can lift it up to about 5 m. Higher suction
            lifts need an external vacuum system; without one, choose a submersible or vertical pump
            instead.
          </p>
          <p>
            Don&apos;t know your head yet? Calculate it from your pipe length, fittings and static height
            with the <Link href={`${TOOLS_PATH}/head-calculator`}>pump head calculator</Link>.
          </p>
        </>
      }
    />
  );
}
