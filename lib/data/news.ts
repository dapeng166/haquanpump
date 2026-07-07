import type { NewsPost } from "@/lib/types";
import { newsImages } from "@/lib/images";

// Seed news — real, industry-relevant articles used when the WordPress
// /posts endpoint is empty or unreachable.

export const seedNews: NewsPost[] = [
  {
    slug: "haquan-expands-stainless-submersible-line",
    title:
      "Haquan Expands Stainless-Steel Submersible Line for Corrosive Duty",
    excerpt:
      "Our new WQP SS316L range targets seawater desalination, brine transfer and food-grade effluent with mirror-polished, fully stainless hydraulics.",
    content:
      "<p>Shanghai Haquan has extended its WQP stainless-steel submersible range with new SS316L models built for highly corrosive and hygienic applications. The expansion answers growing demand from desalination, aquaculture and food-processing customers who need pumps that resist chloride attack while meeting cleanability requirements.</p><p>Each unit is fabricated from solid stainless steel rather than coated cast iron, eliminating the corrosion creep that shortens service life in saline environments. Mirror-polished wetted surfaces resist biofilm and simplify CIP cleaning.</p><p>Deliveries begin this quarter, with full technical documentation supplied for every export order.</p>",
    image: newsImages[0],
    date: "2026-05-18",
    author: "Haquan Engineering Team",
    category: "Product News",
    readingTime: 3,
  },
  {
    slug: "how-to-select-sewage-pump-duty-point",
    title: "How to Select the Right Sewage Pump for Your Duty Point",
    excerpt:
      "A practical guide to reading the pump curve, sizing solids passage and avoiding the most common specification mistakes.",
    content:
      "<p>Choosing a sewage pump is more than matching flow and head. This guide walks buyers through reading a pump performance curve, defining the true duty point, and allowing for solids passage and fibre content.</p><p>We cover NPSH margins, the cost of oversizing, and why the best efficiency point (BEP) matters for energy bills over a 10-year service life. The article closes with a checklist you can send to our engineering team for a same-day recommendation.</p>",
    image: newsImages[1],
    date: "2026-04-02",
    author: "Haquan Engineering Team",
    category: "Technical Guide",
    readingTime: 6,
  },
  {
    slug: "haquan-qby-aodd-diaphragm-pump-range",
    title: "Haquan QBY Air-Operated Diaphragm Pumps for Tough Chemical Duty",
    excerpt:
      "Our QBY AODD range transfers solvents, acids and abrasive slurries with seal-less, self-priming reliability and a wide choice of body and elastomer materials.",
    content:
      "<p>Haquan's QBY air-operated double-diaphragm (AODD) pumps are built for the fluids that defeat conventional pumps — solvents, acids, viscous media and abrasive slurries. Because they are seal-less and air-driven, they run dry, self-prime and handle solids without the wear points of a rotating seal.</p><p>The range covers aluminium, cast-iron, stainless-steel and polypropylene bodies with PTFE, Santoprene and NBR elastomers, so the wetted parts can be matched to each chemical duty. Please note the QBY series is Haquan's own diaphragm-pump platform and is separate from our WILDEN sanitary diaphragm pumps — the two lines use different parts and are not interchangeable.</p>",
    image: newsImages[2],
    date: "2026-03-11",
    author: "Haquan Sales Team",
    category: "Product News",
    readingTime: 4,
  },
  {
    slug: "haquan-pumps-shipped-to-60-countries",
    title: "Milestone: Haquan Pumps Now Shipped to Over 60 Countries",
    excerpt:
      "A decade after our 2014 founding, Haquan equipment is operating on six continents across municipal, wastewater and process industries.",
    content:
      "<p>Founded in 2014, Shanghai Haquan has reached a milestone: our pumps now operate in more than 60 countries across six continents. Recent project shipments include sewage and drainage pumps for South America, municipal lifting stations across Southeast Asia, and stainless diaphragm pumps for food and pharmaceutical plants in the Middle East.</p><p>The growth reflects sustained investment in export documentation, multilingual support and a global spares network that keeps customer downtime to a minimum.</p>",
    image: newsImages[3],
    date: "2026-02-20",
    author: "Haquan",
    category: "Company News",
    readingTime: 3,
  },
  {
    slug: "energy-efficiency-pump-retrofit-savings",
    title: "Energy-Efficiency Retrofits: Cutting Pumping Costs by Up to 30%",
    excerpt:
      "Replacing oversized legacy pumps with correctly-sized Haquan hydraulics and VFD control delivers fast payback on energy.",
    content:
      "<p>Pumping accounts for a large share of industrial electricity use, and oversized legacy pumps throttled by valves waste energy continuously. This article shows how right-sizing to the best efficiency point, combined with variable-frequency drive (VFD) control, can cut pumping energy by up to 30%.</p><p>We include a worked example from a metallurgical plant where a Haquan retrofit paid for itself in under 14 months.</p>",
    image: newsImages[4],
    date: "2026-01-15",
    author: "Haquan Engineering Team",
    category: "Technical Guide",
    readingTime: 5,
  },
  {
    slug: "inside-haquan-pump-test-bench",
    title: "Inside Haquan's Test Bench: How Every Pump Is Verified Before Shipment",
    excerpt:
      "A look at the hydrostatic and performance testing each pump passes on our factory test bench before it is packed for export.",
    content:
      "<p>Before any Haquan pump leaves the factory, it runs through a structured verification process on our in-house test bench. This article takes you behind the scenes of how we confirm hydraulic performance, seal integrity and motor protection on every unit.</p><p>Each pump is hydrostatically pressure-tested for leak tightness, then run against its duty curve to confirm flow and head fall within tolerance. Insulation resistance and no-load current are checked on the motor, and serial numbers are logged for full traceability.</p><p>This shipment-by-shipment discipline is why buyers across 60+ countries standardise on Haquan for critical fluid-handling duty.</p>",
    image: newsImages[5],
    date: "2026-01-08",
    author: "Haquan Quality Team",
    category: "Company News",
    readingTime: 3,
  },
];
