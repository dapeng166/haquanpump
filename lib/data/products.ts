import type { Product, PumpSeries } from "@/lib/types";
import { productImages } from "@/lib/images";

// Curated, technically-accurate seed catalogue. Used as a graceful fallback
// when the WordPress REST API is empty or unreachable, so the site always
// renders real content (never lorem ipsum).

export const pumpSeries: PumpSeries[] = [
  {
    slug: "sewage-pumps",
    name: "Sewage Pumps",
    description:
      "Submersible non-clog sewage pumps for municipal and industrial wastewater with large solids handling.",
  },
  {
    slug: "grinder-pumps",
    name: "Grinder Pumps",
    description:
      "Cutter / grinder pumps that shred fibrous solids for pressurised sewer and lifting-station duty.",
  },
  {
    slug: "self-priming-sewage-pumps",
    name: "Self-Priming Sewage Pumps",
    description:
      "Dry-installed self-priming sewage pumps — no submersion required, easy maintenance.",
  },
  {
    slug: "stainless-steel-submersible-pumps",
    name: "Stainless Steel Submersible Pumps",
    description:
      "Fully SS304/SS316L submersible pumps for corrosive and hygienic fluid transfer.",
  },
  {
    slug: "aodd-pumps",
    name: "AODD Pumps",
    description:
      "Air-operated double-diaphragm pumps, dimensionally interchangeable with WILDEN®.",
  },
  {
    slug: "pipeline-centrifugal-pumps",
    name: "Pipeline Centrifugal Pumps",
    description:
      "ISG / IRG / IHG / ISW inline and horizontal centrifugal pumps for clean, hot and chemical media.",
  },
];

export const seedProducts: Product[] = [
  // --- Sewage Pumps -----------------------------------------------------
  {
    slug: "wq-submersible-sewage-pump",
    name: "WQ Submersible Sewage Pump",
    model: "WQ",
    seriesSlug: "sewage-pumps",
    seriesName: "Sewage Pumps",
    excerpt:
      "Heavy-duty non-clog submersible pump for raw sewage and wastewater with large-passage impeller.",
    description:
      "<p>The WQ series is a submersible non-clog sewage pump engineered for municipal and industrial wastewater containing long fibres and large solids. The single-channel or double-channel cast-iron impeller passes solids up to 80&nbsp;mm, while the silicon-carbide mechanical seal and oil chamber give long maintenance intervals in continuous operation.</p><p>A built-in motor protector guards against overheating and overload, and the dry-running thermal sensor extends service life in lifting stations and pump pits.</p>",
    image: productImages[0],
    gallery: [productImages[0], productImages[4], productImages[5]],
    specs: {
      flowRate: "10 – 1200",
      head: "5 – 40",
      power: "0.75 – 90",
      diameter: "50 – 300",
      material: "Cast Iron HT200 + SiC mechanical seal",    },
    applications: ["Municipal Water", "Mining", "Metallurgy", "Power Plants"],
    featured: true,
  },
  {
    slug: "wqd-sewage-pump",
    name: "WQD Light-Duty Sewage Pump",
    model: "WQD",
    seriesSlug: "sewage-pumps",
    seriesName: "Sewage Pumps",
    excerpt:
      "Compact single-phase submersible pump for basements, buildings and light effluent transfer.",
    description:
      "<p>The WQD is a compact submersible sewage pump designed for buildings, basements and small lifting stations. With a vortex impeller it handles soft solids and suspended particles while keeping a small footprint and quiet, vibration-free operation.</p>",
    image: productImages[1],
    gallery: [productImages[1], productImages[0], productImages[7]],
    specs: {
      flowRate: "5 – 60",
      head: "5 – 22",
      power: "0.55 – 4",
      diameter: "50 – 80",
      material: "Cast Iron + Stainless steel shaft",    },
    applications: ["Municipal Water", "HVAC"],
  },
  // --- Grinder Pumps ----------------------------------------------------
  {
    slug: "wqk-grinder-pump",
    name: "WQK Cutter Grinder Pump",
    model: "WQK",
    seriesSlug: "grinder-pumps",
    seriesName: "Grinder Pumps",
    excerpt:
      "Tungsten-carbide cutting system shreds rags and fibres for pressurised sewer systems.",
    description:
      "<p>The WQK grinder pump features a hardened tungsten-carbide cutter ring and rotating blade that macerate fibrous and stringy solids before they reach the impeller. This makes it ideal for pressurised sewer mains, hospitals and food-processing effluent where ragging would block a conventional pump.</p>",
    image: productImages[2],
    gallery: [productImages[2], productImages[5], productImages[0]],
    specs: {
      flowRate: "5 – 40",
      head: "10 – 35",
      power: "0.75 – 7.5",
      diameter: "40 – 65",
      material: "Cast Iron + Tungsten-carbide cutter",    },
    applications: ["Municipal Water", "Pharmaceuticals", "Marine"],
    featured: true,
  },
  // --- Self-Priming Sewage Pumps ---------------------------------------
  {
    slug: "zw-self-priming-sewage-pump",
    name: "ZW Self-Priming Sewage Pump",
    model: "ZW",
    seriesSlug: "self-priming-sewage-pumps",
    seriesName: "Self-Priming Sewage Pumps",
    excerpt:
      "Dry-installed self-priming non-clog pump — services without entering the wet well.",
    description:
      "<p>The ZW series is a horizontal self-priming sewage pump that installs dry, above the liquid level. Its integrated priming chamber re-primes automatically after the first fill, so no foot valve or vacuum pump is required. Maintenance is performed without entering the wet well, improving operator safety.</p>",
    image: productImages[3],
    gallery: [productImages[3], productImages[4], productImages[6]],
    specs: {
      flowRate: "10 – 300",
      head: "10 – 30",
      power: "1.5 – 37",
      diameter: "40 – 150",
      material: "Cast Iron HT250",    },
    applications: ["Municipal Water", "Irrigation", "Petrochemical"],
  },
  // --- Stainless Steel Submersible Pumps -------------------------------
  {
    slug: "wqp-stainless-submersible-pump",
    name: "WQP Stainless Steel Submersible Pump",
    model: "WQP",
    seriesSlug: "stainless-steel-submersible-pumps",
    seriesName: "Stainless Steel Submersible Pumps",
    excerpt:
      "Fully SS304 / SS316L construction for corrosive, saline and hygienic effluent.",
    description:
      "<p>The WQP is precision-fabricated entirely from SS304 or SS316L stainless steel, giving outstanding corrosion resistance for seawater, chemical and food-grade applications. Mirror-polished surfaces resist fouling, making it a hygienic choice for pharmaceutical and beverage plants.</p>",
    image: productImages[4],
    gallery: [productImages[4], productImages[1], productImages[7]],
    specs: {
      flowRate: "10 – 500",
      head: "5 – 35",
      power: "0.75 – 30",
      diameter: "50 – 200",
      material: "SS304 / SS316L (full stainless)",    },
    applications: ["Marine", "Pharmaceuticals", "Petrochemical", "Metallurgy"],
    featured: true,
  },
  // --- AODD Pumps -------------------------------------------------------
  {
    slug: "qby-aodd-pump",
    name: "QBY Air-Operated Double-Diaphragm Pump",
    model: "QBY",
    seriesSlug: "aodd-pumps",
    seriesName: "AODD Pumps",
    excerpt:
      "WILDEN®-interchangeable AODD pump for viscous, abrasive and shear-sensitive media.",
    description:
      "<p>The QBY air-operated double-diaphragm (AODD) pump runs entirely on compressed air, making it intrinsically safe and self-priming with run-dry capability. Dimensionally interchangeable with WILDEN®, it transfers viscous, abrasive and shear-sensitive fluids — from paints and adhesives to slurries and solvents. Available in aluminium, cast iron, stainless steel and engineered-plastic bodies with PTFE, NBR or Santoprene diaphragms.</p>",
    image: productImages[5],
    gallery: [productImages[5], productImages[2], productImages[3]],
    specs: {
      flowRate: "0 – 60",
      head: "0 – 70 (max 8 bar)",
      power: "Air-driven (0.7 m³/min)",
      diameter: "10 – 80",
      material: "Aluminium / SS316 / PP + PTFE diaphragm",    },
    applications: ["Petrochemical", "Pharmaceuticals", "Metallurgy", "HVAC"],
    featured: true,
  },
  // --- Pipeline Centrifugal Pumps --------------------------------------
  {
    slug: "isg-vertical-pipeline-pump",
    name: "ISG Vertical Inline Pipeline Pump",
    model: "ISG",
    seriesSlug: "pipeline-centrifugal-pumps",
    seriesName: "Pipeline Centrifugal Pumps",
    excerpt:
      "Space-saving vertical inline centrifugal pump for clean-water pressure boosting.",
    description:
      "<p>The ISG vertical inline centrifugal pump shares a common inlet/outlet centreline so it drops straight into a pipe run, saving floor space. It is the workhorse for HVAC circulation, building water supply and industrial pressure boosting of clean or slightly turbid water up to 80&nbsp;°C.</p>",
    image: productImages[6],
    gallery: [productImages[6], productImages[7], productImages[0]],
    specs: {
      flowRate: "1.5 – 600",
      head: "5 – 125",
      power: "0.55 – 110",
      diameter: "25 – 300",
      material: "Cast Iron + Stainless impeller",    },
    applications: ["HVAC", "Municipal Water", "Boilers"],
  },
  {
    slug: "irg-hot-water-pipeline-pump",
    name: "IRG Hot Water Circulation Pump",
    model: "IRG",
    seriesSlug: "pipeline-centrifugal-pumps",
    seriesName: "Pipeline Centrifugal Pumps",
    excerpt:
      "Vertical inline pump rated to 120 °C for boiler and heating-system circulation.",
    description:
      "<p>The IRG is a hot-water variant of the inline range, fitted with a high-temperature mechanical seal and heat-resistant components for boiler feed and district-heating circulation up to 120&nbsp;°C.</p>",
    image: productImages[7],
    gallery: [productImages[7], productImages[6], productImages[5]],
    specs: {
      flowRate: "1.5 – 600",
      head: "5 – 125",
      power: "0.55 – 90",
      diameter: "25 – 300",
      material: "Cast Iron + High-temp seal",    },
    applications: ["Boilers", "Power Plants", "HVAC"],
  },
  {
    slug: "ihg-chemical-pipeline-pump",
    name: "IHG Chemical Inline Pump",
    model: "IHG",
    seriesSlug: "pipeline-centrifugal-pumps",
    seriesName: "Pipeline Centrifugal Pumps",
    excerpt:
      "Stainless-steel vertical inline pump for corrosive chemical process media.",
    description:
      "<p>The IHG is a fully stainless-steel (SS304/SS316) version of the inline pump for corrosive chemical duty in petrochemical and pharmaceutical plants, with a balanced mechanical seal selected for the pumped medium.</p>",
    image: productImages[0],
    gallery: [productImages[0], productImages[4], productImages[1]],
    specs: {
      flowRate: "1.5 – 400",
      head: "5 – 125",
      power: "0.55 – 75",
      diameter: "25 – 200",
      material: "SS304 / SS316",    },
    applications: ["Petrochemical", "Pharmaceuticals", "Metallurgy"],
  },
  {
    slug: "isw-horizontal-pipeline-pump",
    name: "ISW Horizontal Inline Pump",
    model: "ISW",
    seriesSlug: "pipeline-centrifugal-pumps",
    seriesName: "Pipeline Centrifugal Pumps",
    excerpt:
      "Horizontal inline centrifugal pump for high-flow water supply and irrigation.",
    description:
      "<p>The ISW is the horizontally-mounted member of the inline family, favoured where headroom is limited. It delivers high flow for irrigation, water supply and cooling circuits with low NPSH requirements and quiet running.</p>",
    image: productImages[1],
    gallery: [productImages[1], productImages[6], productImages[3]],
    specs: {
      flowRate: "1.5 – 600",
      head: "5 – 125",
      power: "0.55 – 110",
      diameter: "25 – 300",
      material: "Cast Iron + Stainless impeller",    },
    applications: ["Irrigation", "Municipal Water", "Power Plants"],
  },
];

export function seriesWithCounts(): PumpSeries[] {
  return pumpSeries.map((s) => ({
    ...s,
    count: seedProducts.filter((p) => p.seriesSlug === s.slug).length,
  }));
}
