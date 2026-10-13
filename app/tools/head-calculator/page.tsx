import type { Metadata } from "next";
import Link from "next/link";
import { HeadCalculator } from "@/components/tools/HeadCalculator";
import { ToolPage, TOOLS_PATH, type Faq } from "@/components/tools/ToolPage";

const PATH = `${TOOLS_PATH}/head-calculator`;
const DESCRIPTION =
  "Free pump head calculator: work out the total dynamic head from static height, pipe length, pipe size, material and fittings, with friction losses and a system curve.";

export const metadata: Metadata = {
  title: "Pump Head Calculator — Total Dynamic Head & Friction Loss",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
};

const faqs: Faq[] = [
  {
    q: "What is total dynamic head (TDH)?",
    a: "Total dynamic head is the total height a pump must lift the liquid at the design flow. It is the static height from the lowest liquid level to the discharge point, plus friction loss in the pipe, plus losses in fittings and valves, plus any pressure required at the outlet.",
  },
  {
    q: "How do I measure the static height?",
    a: "Measure vertically from the lowest liquid level in the pit (where the pump stops) to the highest point the pipe reaches on its way to the discharge. Horizontal distance does not add static height; it only adds friction loss.",
  },
  {
    q: "How is the friction loss calculated?",
    a: "The calculator uses the Darcy–Weisbach equation, hf = f · (L/D) · v²/2g, with the friction factor f from the Swamee–Jain form of the Colebrook equation. It depends on the flow velocity, the pipe diameter and the roughness of the pipe material.",
  },
  {
    q: "Why add a 10% margin to the calculated head?",
    a: "Pipes roughen with age, fittings are often added during installation and sewage contains solids, so the real head is usually a little higher than calculated. A 10% margin keeps the pump delivering the required flow over its service life.",
  },
  {
    q: "What pipe velocity should I aim for with sewage?",
    a: "Keep the velocity in the discharge pipe at about 0.7 to 3 m/s. Below 0.7 m/s solids can settle and block the pipe; above 3 m/s friction losses, noise and wear rise quickly.",
  },
];

export default function HeadCalculatorPage() {
  return (
    <ToolPage
      path={PATH}
      name="Pump Head Calculator"
      title="Pump Head Calculator"
      intro="Work out the total head your sewage pump needs, from the static height, pipe length, pipe size and fittings, with a system curve for your pipeline."
      description={DESCRIPTION}
      tool={<HeadCalculator />}
      faqs={faqs}
      howItWorks={
        <>
          <h2>How the pump head is calculated</h2>
          <p>The total dynamic head (TDH) the pump has to deliver is the sum of four parts:</p>
          <ul>
            <li>
              <strong>Static height</strong>: the vertical distance from the lowest liquid level to the
              highest point of the discharge pipe.
            </li>
            <li>
              <strong>Pipe friction loss</strong>: from the Darcy–Weisbach equation{" "}
              <code>hf = f · (L/D) · v² / 2g</code>, with the friction factor f from the Swamee–Jain
              equation for your pipe material.
            </li>
            <li>
              <strong>Fitting losses</strong>: <code>hm = ΣK · v² / 2g</code>, using standard K values for
              elbows, valves and tees, plus 1.0 for the exit loss at a free outlet.
            </li>
            <li>
              <strong>Outlet pressure</strong>: any pressure required at the end of the pipe, converted to
              metres (1 bar ≈ 10.2 m of water).
            </li>
          </ul>
          <p>
            The calculation assumes water at about 20 °C, which is also a good approximation for dilute
            sewage. For thick sludge or viscous liquids, ask our engineers for a detailed calculation.
          </p>
          <h3>The system curve</h3>
          <p>
            The chart shows the head your pipeline needs at every flow. Static height and outlet pressure
            stay constant, while friction and fitting losses grow with the square of the flow. The pump
            will run at the point where its own curve crosses this line.
          </p>
          <p>
            Once you have the head, the <Link href={`${TOOLS_PATH}/pump-selector`}>pump selector</Link>{" "}
            shows which Haquan pumps suit your duty point.
          </p>
        </>
      }
    />
  );
}
