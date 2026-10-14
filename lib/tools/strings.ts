// English source copy for the engineering tools. The English pages render it
// directly; the localized pages (/es/tools/…) machine-translate it on the
// server (lib/tools/translateTools.ts), so there is one source of truth.
//
// `{name}` placeholders are filled at render time and never translated: keep
// figures *with* their unit inside a placeholder ("{q}" → "40 m³/h") so units
// stay untranslated in every language.

import { SERIES, LIQUID_LABELS, INSTALL_LABELS, MATERIAL_LABELS, DRIVE_LABELS } from "./series";
import { PIPE_MATERIALS, FITTINGS } from "./hydraulics";

const SELECTOR_FAQS = [
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

const CALC_FAQS = [
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

// Trusted HTML. {calcHref} / {selectorHref} are filled with the locale's path.
const SELECTOR_HOW = `<h2>How the pump selector works</h2>
<p>The selector compares your duty point with the flow and head range of each Haquan pump series, then filters by liquid, installation, material and power supply. Series that are the first choice for your liquid are listed first: for example, a cutter pump ranks highest for sewage with rags and fibres.</p>
<h3>Motor power estimate</h3>
<p>Hydraulic power is <code>P = ρ · g · Q · H</code>, with Q in m³/s and H in metres. Dividing by the pump efficiency gives the shaft power. Small non-clog sewage pumps run at around 30% efficiency and large ones at 65 to 70%, so the selector uses a conservative figure for your flow and adds a 15% margin before rounding up to a standard motor size.</p>
<h3>Outlet size</h3>
<p>The suggested outlet keeps the discharge velocity between about 1.5 and 3.5 m/s. Sewage pumps start at DN50 so that solids can pass through.</p>
<h3>Self-priming pumps and suction lift</h3>
<p>A self-priming pump installed above the liquid can lift it up to about 5 m. Higher suction lifts need an external vacuum system; without one, choose a submersible or vertical pump instead.</p>
<p>Don't know the total head yet? Calculate it from your pipe length, fittings and static height with the <a href="{calcHref}">pump head calculator</a>.</p>`;

const CALC_HOW = `<h2>How the pump head is calculated</h2>
<p>The total dynamic head (TDH) the pump has to deliver is the sum of four parts:</p>
<ul>
<li><strong>Static height</strong>: the vertical distance from the lowest liquid level to the highest point of the discharge pipe.</li>
<li><strong>Pipe friction loss</strong>: from the Darcy–Weisbach equation <code>hf = f · (L/D) · v² / 2g</code>, with the friction factor f from the Swamee–Jain equation for your pipe material.</li>
<li><strong>Fitting losses</strong>: <code>hm = ΣK · v² / 2g</code>, using standard K values for elbows, valves and tees, plus 1.0 for the exit loss at a free outlet.</li>
<li><strong>Outlet pressure</strong>: any pressure required at the end of the pipe, converted to metres (1 bar ≈ 10.2 m of water).</li>
</ul>
<p>The calculation assumes water at about 20 °C, which is also a good approximation for dilute sewage. For thick sludge or viscous liquids, ask our engineers for a detailed calculation.</p>
<h3>The system curve</h3>
<p>The chart shows the head your pipeline needs at every flow. Static height and outlet pressure stay constant, while friction and fitting losses grow with the square of the flow. The pump will run at the point where its own curve crosses this line.</p>
<p>Once you have the head, the <a href="{selectorHref}">pump selector</a> shows which Haquan pumps suit your duty point.</p>`;

export const TOOLS_EN = {
  common: {
    eyebrow: "Engineering Tools",
    faqEyebrow: "FAQ",
    faqTitle: "Frequently Asked Questions",
    allTools: "All engineering tools",
    askEngineers: "Ask our engineers",
  },
  index: {
    metaTitle: "Free Pump Engineering Tools — Pump Selector & Head Calculator",
    metaDesc:
      "Free online tools for sewage pump selection: find the right pump type by flow and head, and calculate total dynamic head and friction loss for your pipeline.",
    title: "Free Pump Engineering Tools",
    intro:
      "Size and select a sewage pump in minutes. Free to use, no sign-up, and our engineers are on hand to confirm the final model.",
    openTool: "Open tool",
    selectorTitle: "Pump Selector",
    selectorText:
      "Enter flow, head, liquid and installation to see which sewage pump types fit, with an estimated motor power, outlet size and example model.",
    calcTitle: "Pump Head Calculator",
    calcText:
      "Work out the total dynamic head from static height, pipe length, pipe size and fittings, with friction losses and a system curve.",
  },
  selector: {
    page: {
      metaTitle: "Sewage Pump Selector — Find the Right Pump by Flow & Head",
      metaDesc:
        "Free sewage pump selector: enter flow rate, head, liquid and installation to get suitable pump types, an estimated motor power, outlet size and an example model.",
      name: "Pump Selector",
      title: "Sewage Pump Selector",
      intro:
        "Enter your flow rate, head and site conditions to see which pump types fit, with an estimated motor power, outlet size and an example model number.",
      faqs: SELECTOR_FAQS,
      howItWorks: SELECTOR_HOW,
    },
    ui: {
      dutyPoint: "Your duty point",
      flowRate: "Flow rate",
      flowUnit: "Flow unit",
      totalHead: "Total head (m)",
      headHint: "Not sure? Work it out with the {link}.",
      headHintLink: "pump head calculator",
      liquid: "Liquid",
      installation: "Installation",
      suctionLift: "Suction lift (m)",
      suctionLiftHint: "Height from the lowest liquid level up to the pump inlet.",
      material: "Material",
      power: "Power available",
      empty: "Enter a flow rate and head to see suitable pumps.",
      estimateFor: "Estimate for {q} at {h}",
      hydraulicPower: "Hydraulic power",
      shaftPower: "Shaft power",
      motor: "Motor",
      outletSize: "Outlet size",
      efficiencyNote:
        "Based on a typical pump efficiency of {eff} and a 15% motor margin. The motor of the final model may be one size larger.",
      liftNote:
        "A suction lift of {lift} is more than self-priming pumps can manage (up to {max}) without an external vacuum system. A submersible or vertical pump avoids suction lift altogether.",
      noSeries:
        "No standard series covers this exact duty with the options chosen. Send us the figures: we can often build a custom model.",
      bestMatch: "Best match",
      seriesRange: "Series range: {flow}, {head}",
      exampleModel: "Example model",
      viewSeries: "View {series} pumps",
      quoteText: "Send us these figures and our engineers will confirm the exact model, curve and price.",
      getQuote: "Get a quote",
      catalogueTitle: "Matching pumps in our catalogue",
      close: "Close to your duty",
      covers: "Range covers your duty",
      // Pieces of the duty summary pre-filled into the inquiry message.
      sumDuty: "{q} at {h} head",
      sumLift: "suction lift {lift}",
      sumMaterial: "material: {x}",
      sumPower: "power: {x}",
      sumSeries: "suggested series: {x}",
      liquids: { ...LIQUID_LABELS },
      installs: { ...INSTALL_LABELS },
      materials: { ...MATERIAL_LABELS },
      drives: { ...DRIVE_LABELS },
      series: Object.fromEntries(
        SERIES.map((s) => [s.slug, { name: s.name, short: s.name.split(" ")[0], points: [...s.points] }]),
      ) as Record<string, { name: string; short: string; points: string[] }>,
      inquiry: {
        title: "Ask our engineers",
        text: "We can often build a pump for duties outside our standard ranges. Send your figures and we will reply with a recommendation.",
        name: "Name",
        email: "Email",
        message: "Message",
        recommend: "Please recommend a pump for:",
        sentTitle: "Thank you, your request has been sent.",
        sentText: "Our engineers will reply by email, usually within 24 hours.",
        error: "Sorry, the request could not be sent. Please email us at {email}.",
        send: "Send request",
        sending: "Sending…",
      },
    },
  },
  calc: {
    page: {
      metaTitle: "Pump Head Calculator — Total Dynamic Head & Friction Loss",
      metaDesc:
        "Free pump head calculator: work out the total dynamic head from static height, pipe length, pipe size, material and fittings, with friction losses and a system curve.",
      name: "Pump Head Calculator",
      title: "Pump Head Calculator",
      intro:
        "Work out the total head your sewage pump needs, from the static height, pipe length, pipe size and fittings, with a system curve for your pipeline.",
      faqs: CALC_FAQS,
      howItWorks: CALC_HOW,
    },
    ui: {
      system: "Your system",
      flowRate: "Flow rate",
      flowUnit: "Flow unit",
      staticHeight: "Static height (m)",
      staticHint: "Vertical height from the lowest liquid level in the pit to the highest point of discharge.",
      pipeLength: "Pipe length (m)",
      pipeSize: "Pipe size",
      pipeMaterial: "Pipe material",
      fittings: "Fittings (quantity)",
      pressure: "Pressure required at the outlet (bar)",
      pressureHint: "Leave 0 when the pipe discharges freely into a tank, channel or manhole.",
      empty: "Enter the flow rate and pipe details to calculate the head.",
      recommended: "Recommended pump head (incl. 10% margin)",
      calculated: "Calculated total dynamic head: {h} at {q}",
      rowStatic: "Static height",
      rowPressure: "Outlet pressure",
      rowFriction: "Pipe friction loss",
      rowFittings: "Fittings and exit loss",
      rowVelocity: "Velocity in pipe",
      slow: "The velocity is below 0.7 m/s: solids in sewage may settle in the pipe. Consider a smaller pipe size.",
      fast: "The velocity is above 3 m/s: friction losses and wear are high. Consider a larger pipe size.",
      findText: "Find pumps for {q} at {h} with the pump selector.",
      findPump: "Find a pump",
      curveTitle: "System curve",
      curveSub: "(head required at each flow)",
      curveAria: "System curve chart",
      curveNote:
        "The pump runs where its own curve crosses this line. Choose a pump whose curve passes through or just above the orange point.",
      pipeMaterials: Object.fromEntries(PIPE_MATERIALS.map((m) => [m.value, m.label])) as Record<string, string>,
      fittingLabels: Object.fromEntries(FITTINGS.map((f) => [f.key, f.label])) as Record<string, string>,
    },
  },
};

export type ToolsStrings = typeof TOOLS_EN;
export type SelectorUi = ToolsStrings["selector"]["ui"];
export type CalcUi = ToolsStrings["calc"]["ui"];
export type ToolPageText = ToolsStrings["selector"]["page"];

/**
 * Wrap a figure with its unit in a left-to-right isolate, so right-to-left
 * text (Arabic) keeps "≈ 4 kW" in order instead of reordering it to "kW 4 ≈".
 * Invisible, and a no-op in left-to-right languages.
 */
export const ltr = (s: string) => `⁦${s}⁩`;

/** Fill `{name}` placeholders. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}
