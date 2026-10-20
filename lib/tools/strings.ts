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

const WILDEN_FAQS = [
  {
    q: "How do I choose the right WILDEN pump size?",
    a: "Start from the flow you need, then pick a size whose maximum flow is clearly higher: an air-operated diaphragm pump lasts longest when it runs at about a third to two thirds of its maximum. Then check the flow on the WILDEN performance curve at your actual discharge pressure and air supply pressure, because the maximum flow is only reached with full air pressure and an open discharge.",
  },
  {
    q: "Which body material should I choose?",
    a: "Aluminum and iron are economical and robust for water, wastewater, oils and abrasive slurries. Stainless steel suits solvents, food products and many chemicals. Polypropylene and PVDF resist most acids and alkalis. Aluminum must never be used with halogenated hydrocarbon solvents such as methylene chloride or trichloroethane.",
  },
  {
    q: "Which diaphragm material is best?",
    a: "It depends on the liquid. Santoprene and Neoprene are durable all-rounders for water and slurries, Buna-N, Bunalast and FKM resist oils and fuels, and PTFE has the widest chemical resistance. The selector suggests a diaphragm for your liquid and temperature, and we confirm compatibility with your exact liquid before you order.",
  },
  {
    q: "What is the difference between clamped and bolted WILDEN pumps?",
    a: "Clamped pumps hold the liquid chambers with clamp bands, so they are quick to take apart for cleaning and maintenance. Bolted pumps use bolts instead, which gives a more secure seal for aggressive, hazardous or high-value liquids.",
  },
  {
    q: "Are these genuine WILDEN pumps?",
    a: "Yes. Haquan supplies genuine, original WILDEN pumps and spare parts, identified by their official part numbers. The models and figures in this selector come from WILDEN's official build listings. WILDEN parts fit WILDEN pumps only and are not interchangeable with our own QBY diaphragm pumps.",
  },
];

// Trusted HTML. {lookupHref}, {sparesHref}, {converterHref} are filled with the locale's paths.
const WILDEN_HOW = `<h2>How the WILDEN pump selector works</h2>
<p>The selector searches all 2,476 current WILDEN pump builds, grouped into families of the same model, body material, construction and connection. For each family it knows the maximum flow, the maximum air pressure, the largest solid the valves pass and the temperature range of every diaphragm material, as listed for current WILDEN builds.</p>
<h3>Size: maximum flow is not the operating point</h3>
<p>The listed maximum flow is reached only at maximum air pressure with an open discharge. Against a discharge pressure the flow falls, and a lower air supply lowers it further. The selector therefore makes a rough allowance for your air pressure and prefers sizes where your flow is no more than about 60% of the maximum. Always check the flow on the WILDEN performance curve at your actual discharge pressure; we do this for you with your quotation.</p>
<h3>Materials</h3>
<p>For each liquid group the selector suggests body materials and diaphragms that are commonly used, and it removes diaphragms whose temperature range does not cover your liquid. This is general guidance: chemical compatibility depends on the exact liquid, its concentration and temperature, so we confirm the materials before you order.</p>
<h3>Part numbers</h3>
<p>Each suggestion shows example part numbers. Open one to see the full build code and every other build of that model in the <a href="{lookupHref}">WILDEN part number lookup</a>, or find diaphragms, valve balls and repair kits in the <a href="{sparesHref}">spare parts lookup</a>. Need to convert L/min, GPM, bar or psi? Use the <a href="{converterHref}">unit converter</a>.</p>`;

const CONV_FAQS = [
  {
    q: "How many litres per minute is one US GPM?",
    a: "One US gallon per minute is 3.785 L/min, or 0.227 m³/h. One UK (imperial) gallon per minute is larger: 4.546 L/min, or 0.273 m³/h.",
  },
  {
    q: "How do I convert bar to metres of head?",
    a: "For water, 1 bar equals about 10.2 m of head and 1 psi about 0.70 m. For another liquid, divide the head in metres of water by the liquid's specific gravity: 1 bar of a liquid with a specific gravity of 1.2 is about 8.5 m of head.",
  },
  {
    q: "What is the difference between HP and PS?",
    a: "Mechanical horsepower (HP), used in the US and UK, is 745.7 W. Metric horsepower (PS or CV) is slightly smaller at 735.5 W. A 7.5 kW motor is about 10 HP or 10.2 PS.",
  },
  {
    q: "Is the converter accurate enough for pump selection?",
    a: "Yes. It uses exact conversion factors and shows up to five significant figures, which is far more precise than any pump curve. Metres and feet of water assume water, which is the convention on pump curves.",
  },
];

const CONV_HOW = `<h2>How the unit converter works</h2>
<p>Type a value into any field and every other unit in that group updates at once. Each value is converted through a base unit (m³/h for flow, kPa for pressure, kW for power) using exact factors.</p>
<h3>Common conversions</h3>
<ul>
<li><strong>Flow</strong>: 1 m³/h = 16.67 L/min = 0.278 L/s = 4.40 US GPM = 3.67 UK GPM</li>
<li><strong>Pressure</strong>: 1 bar = 100 kPa = 0.1 MPa = 14.50 psi = 10.20 m of water = 33.46 ft of water</li>
<li><strong>Power</strong>: 1 kW = 1.341 HP = 1.360 PS</li>
</ul>
<h3>Pressure and head</h3>
<p>Pump head is quoted in metres or feet of the liquid being pumped. The converter uses water, so for a heavier or lighter liquid divide the head by its specific gravity. To work out the head your pipeline needs, use the <a href="{calcHref}">pump head calculator</a>.</p>`;

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
    wildenTitle: "WILDEN Pump Selector",
    wildenText:
      "Enter flow, liquid, temperature and air pressure to get a shortlist of genuine WILDEN AODD pump models, a suggested body and diaphragm material, and example part numbers.",
    convTitle: "Unit Converter",
    convText:
      "Convert flow (m³/h, L/s, L/min, GPM), pressure and head (bar, psi, kPa, MPa, m and ft of water) and power (kW, HP) instantly.",
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
  wilden: {
    page: {
      metaTitle: "WILDEN Pump Selector — Choose a WILDEN AODD Pump by Flow & Liquid",
      metaDesc:
        "Free WILDEN pump selector: enter flow, liquid, temperature and air pressure to get a shortlist of genuine WILDEN AODD pump models, suggested body and diaphragm materials and example part numbers.",
      name: "WILDEN Pump Selector",
      title: "WILDEN Pump Selector",
      intro:
        "Find the right genuine WILDEN air-operated double-diaphragm pump: enter your flow, liquid and site conditions to get a shortlist of models, suggested materials and example part numbers.",
      faqs: WILDEN_FAQS,
      howItWorks: WILDEN_HOW,
    },
    ui: {
      application: "Your application",
      flowRate: "Flow rate",
      flowUnit: "Flow unit",
      port: "Port size",
      portAny: "Any size",
      liquid: "Liquid",
      temperature: "Liquid temperature (°C)",
      connection: "Connection",
      construction: "Assembly",
      constructionHint:
        "Clamped pumps are quicker to take apart for cleaning; bolted pumps seal more securely for aggressive or hazardous liquids.",
      airPressure: "Air supply pressure",
      airUnit: "Air pressure unit",
      empty: "Enter the flow you need to see suitable WILDEN pumps.",
      suggestTitle: "Suggested materials",
      bodyLabel: "Body (wetted parts)",
      diaphragmLabel: "Diaphragm",
      compatNote:
        "General guidance only. Compatibility depends on the exact liquid, its concentration and temperature: we confirm the materials before you order.",
      curveNote:
        "Max flow is the flow at maximum air pressure with an open discharge, not your operating point. Check the flow on the WILDEN curve at your actual discharge pressure; we do this with your quotation.",
      shortlistTitle: "Shortlist for {q}",
      bestMatch: "Best match",
      bandComfort: "Comfortable size",
      bandHigh: "Near the top of its range",
      bandLimit: "At its limit: check the curve",
      bandUnknown: "Max flow not listed: we confirm it from the curve",
      statMaxFlow: "Max flow",
      statLoad: "Your flow",
      loadOf: "{p} of max",
      statAir: "Max air pressure",
      statSolids: "Max solids",
      statLift: "Dry suction lift",
      statTemp: "Temperature range",
      curveExample: "From the WILDEN curve: {q} against {p} discharge needs {air} air supply and about {nm3} of air.",
      diaphragms: "Suitable diaphragms",
      suggested: "suggested",
      examples: "Example part numbers",
      builds: "{n} builds",
      allBuilds: "All {model} builds",
      regulator: "Your air supply is above this pump's maximum air pressure: fit a pressure regulator.",
      quote: "Quote",
      quoteText: "Send us a part number or your operating conditions and we will confirm the model, materials and lead time.",
      getQuote: "Request a quote",
      noMatch:
        "No single WILDEN pump in the current listing covers these conditions with the options chosen. Try another port size, connection or assembly, or send us the figures: two pumps in parallel may suit.",
      hubLink: "All WILDEN pumps and spare parts",
      liquids: {
        water: "Water or wastewater",
        oils: "Oils and fuels",
        solvents: "Solvents",
        chemicals: "Acids and alkalis",
        slurry: "Slurries and solids",
        food: "Food and hygienic",
      },
      reasons: {
        water: {
          body: "Aluminum or iron bodies are economical and robust for water and wastewater; polypropylene suits slightly corrosive water.",
          diaphragm: "Santoprene, Neoprene or EPDM diaphragms give a long life with water and wastewater carrying some solids.",
        },
        oils: {
          body: "Aluminum, iron or stainless steel bodies are the usual choice for oils and fuels; plastic bodies are not.",
          diaphragm: "Buna-N, Bunalast or FKM resist petroleum products, and PTFE covers almost any oil. Avoid EPDM, which swells in oil.",
        },
        solvents: {
          body: "Stainless steel is the safe choice for solvents. Aluminum suits many solvents but never halogenated hydrocarbons such as methylene chloride or trichloroethane.",
          diaphragm: "PTFE resists almost all solvents; FKM suits aromatic and chlorinated solvents but not ketones.",
        },
        chemicals: {
          body: "Polypropylene or PVDF bodies resist most acids and alkalis; PVDF suits stronger oxidising acids. Avoid aluminum and iron.",
          diaphragm: "PTFE suits strong or concentrated chemicals; Santoprene suits many dilute acids and alkalis.",
        },
        slurry: {
          body: "Metal bodies (aluminum or iron) stand up best to abrasive slurries. A larger size running slowly lasts longer.",
          diaphragm: "Santoprene, Neoprene or polyurethane resist abrasion. Check that the largest solid is smaller than the pump's maximum solids size.",
        },
        food: {
          body: "Stainless steel pumps with Tri-Clamp connections are built for hygienic transfer and easy cleaning.",
          diaphragm: "PTFE is the common choice for food products; we confirm the materials against your food-contact requirements.",
        },
      },
      materials: {
        Aluminum: "Aluminum",
        Iron: "Iron",
        "Stainless Steel": "Stainless steel",
        Polypropylene: "Polypropylene",
        PVDF: "PVDF",
      } as Record<string, string>,
      connections: { any: "Any", Threaded: "Threaded", Flanged: "Flanged", "Tri-Clamp": "Tri-Clamp (hygienic)" } as Record<
        string,
        string
      >,
      constructions: { any: "Any", Clamped: "Clamped", Bolted: "Bolted" } as Record<string, string>,
      elastomerNotes: {
        Santoprene: "Durable all-rounder for water, wastewater and many dilute acids and alkalis, with good abrasion resistance.",
        Neoprene: "Economical general-purpose diaphragm for water and non-aggressive liquids.",
        EPDM: "Water, dilute acids and alkalis, and low temperatures. Not for oils or fuels.",
        "Buna-N": "Oils, fuels and other petroleum products. Not for ketones or strong acids.",
        Bunalast: "Oils and fuels, with a longer flex life than Buna-N.",
        Hytrel: "Tough and long-lasting, with good abrasion resistance; suits oils and mild chemicals.",
        Polyurethane: "Very abrasion-resistant for slurries; narrower chemical and temperature range.",
        FKM: "Aggressive chemicals, aromatic and chlorinated solvents, and higher temperatures. Not for ketones.",
        PTFE: "Widest chemical resistance, for solvents, strong acids and alkalis.",
      } as Record<string, string>,
      inquiry: {
        title: "Ask us about WILDEN pumps",
        text: "Send your flow, liquid and pressures and we will recommend a genuine WILDEN pump and confirm the materials.",
        name: "Name",
        email: "Email",
        message: "Message",
        recommend: "Please recommend a WILDEN pump for:",
        sentTitle: "Thank you, your request has been sent.",
        sentText: "We will reply by email, usually within 24 hours.",
        error: "Sorry, the request could not be sent. Please email us at {email}.",
        send: "Send request",
        sending: "Sending…",
      },
    },
  },
  conv: {
    page: {
      metaTitle: "Pump Unit Converter — Flow, Pressure, Head & Power",
      metaDesc:
        "Free pump unit converter: convert flow (m³/h, L/s, L/min, US and UK GPM), pressure and head (bar, psi, kPa, MPa, m and ft of water) and power (kW, HP) instantly.",
      name: "Unit Converter",
      title: "Pump Unit Converter",
      intro:
        "Convert flow, pressure, head and power units in one place. Type in any field and every other unit updates instantly.",
      faqs: CONV_FAQS,
      howItWorks: CONV_HOW,
    },
    ui: {
      hint: "Type in any field: the others update instantly.",
      waterNote: "Head in metres or feet of water assumes water (specific gravity 1.0).",
      reset: "Reset",
      groups: { flow: "Flow", pressure: "Pressure and head", power: "Power" } as Record<string, string>,
      units: {
        m3h: "Cubic metres per hour",
        ls: "Litres per second",
        lmin: "Litres per minute",
        usgpm: "US gallons per minute",
        ukgpm: "UK gallons per minute",
        bar: "Bar",
        psi: "Pounds per square inch",
        kpa: "Kilopascal",
        mpa: "Megapascal",
        mwc: "Metres of water",
        ftwc: "Feet of water",
        kw: "Kilowatt",
        hp: "Horsepower (mechanical)",
        ps: "Metric horsepower",
      } as Record<string, string>,
    },
  },
};

export type ToolsStrings = typeof TOOLS_EN;
export type WildenUi = ToolsStrings["wilden"]["ui"];
export type ConvUi = ToolsStrings["conv"]["ui"];
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
