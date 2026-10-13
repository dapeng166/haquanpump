// What each Haquan pump series can do, for the pump selector. Ranges are the
// series-level figures published on the product pages; the selector only uses
// them to shortlist series — the exact model is confirmed by our engineers.

export type Liquid = "drainage" | "sewage" | "fibrous" | "chemical";
export type Install = "submersible" | "dry" | "vertical" | "mobile";
export type Material = "ci" | "ss304" | "ss316";
export type Drive = "electric" | "air" | "diesel";

export interface SeriesSpec {
  slug: string;
  name: string;
  flow: [number, number]; // m³/h
  head: [number, number]; // m
  install: Install;
  drive: Drive;
  liquids: Liquid[];
  /** Liquids the series is the first choice for (ranked higher). */
  best: Liquid[];
  materials: Material[];
  /** Haquan model code format, when the series uses one: {dn}, {q}, {h}, {kw}. */
  code?: string;
  /** Maximum suction lift (m), for self-priming pumps installed above the liquid. */
  maxLift?: number;
  points: string[];
}

export const SERIES: SeriesSpec[] = [
  {
    slug: "submersible-sewage-pumps",
    name: "WQ / QW Submersible Sewage Pump",
    flow: [7, 2650],
    head: [7, 60],
    install: "submersible",
    drive: "electric",
    liquids: ["drainage", "sewage"],
    best: ["drainage", "sewage"],
    materials: ["ci", "ss304", "ss316"],
    code: "{dn}QW{q}-{h}-{kw}",
    points: [
      "Non-clog impeller for raw sewage and drainage water",
      "Installed directly in the pit: no suction lift, no priming",
      "Float switch automatic start / stop",
    ],
  },
  {
    slug: "gnwq-cutting-submersible-sewage-pump",
    name: "GNWQ Cutter Submersible Sewage Pump",
    flow: [7, 950],
    head: [7, 55],
    install: "submersible",
    drive: "electric",
    liquids: ["sewage", "fibrous"],
    best: ["fibrous"],
    materials: ["ci", "ss304", "ss316"],
    code: "{dn}GNWQ{q}-{h}-{kw}",
    points: [
      "Cutter at the inlet shreds rags, fibres, hair and plastics",
      "For sewage with long fibres that block ordinary impellers",
      "Installed directly in the pit, automatic level control",
    ],
  },
  {
    slug: "chopper-pump",
    name: "WQK Cutter Submersible Sewage Pump",
    flow: [10, 300],
    head: [10, 30],
    install: "submersible",
    drive: "electric",
    liquids: ["sewage", "fibrous"],
    best: ["fibrous"],
    materials: ["ci", "ss304"],
    points: [
      "Cutting impeller for fibrous sewage and sludge",
      "Compact design for building and municipal sewage pits",
    ],
  },
  {
    slug: "yw-liquid-submerged-sewage-pump",
    name: "YW Vertical Submerged Sewage Pump",
    flow: [2, 2000],
    head: [3, 60],
    install: "vertical",
    drive: "electric",
    liquids: ["drainage", "sewage"],
    best: ["sewage"],
    materials: ["ci", "ss304", "ss316"],
    points: [
      "Motor stays dry above the pit, pump end in the liquid",
      "Easy motor maintenance without lifting the pump out",
      "Suited to pits with a cover plate or a mounting frame",
    ],
  },
  {
    slug: "zw-self-priming-sewage-pump",
    name: "ZW Self-Priming Sewage Pump",
    flow: [5, 800],
    head: [12, 60],
    install: "dry",
    drive: "electric",
    liquids: ["drainage", "sewage"],
    best: ["sewage"],
    materials: ["ci", "ss304", "ss316"],
    maxLift: 5,
    points: [
      "Installed above the liquid, no foot valve needed",
      "Easy access for inspection and maintenance",
      "Suction lift up to 5 m",
    ],
  },
  {
    slug: "zwl-self-priming-sewage-pump",
    name: "ZWL Direct-Coupled Self-Priming Sewage Pump",
    flow: [8, 800],
    head: [10, 80],
    install: "dry",
    drive: "electric",
    liquids: ["drainage", "sewage"],
    best: ["sewage"],
    materials: ["ci", "ss304", "ss316"],
    maxLift: 5,
    points: [
      "Direct-coupled, compact footprint above the liquid",
      "Non-clog impeller, no foot valve needed",
      "Suction lift up to 5 m",
    ],
  },
  {
    slug: "aodd-pump",
    name: "QBY Air-Operated Diaphragm Pump (AODD)",
    flow: [0.1, 30],
    head: [0, 50],
    install: "dry",
    drive: "air",
    liquids: ["chemical", "sewage", "drainage"],
    best: ["chemical"],
    materials: ["ci", "ss304", "ss316"],
    maxLift: 5,
    points: [
      "Runs on compressed air: no electric motor at the pump",
      "Handles viscous liquids, slurries, chemicals and solids",
      "Can run dry without damage",
    ],
  },
  {
    slug: "mobile-diesel-pump-truck",
    name: "Mobile Diesel Engine Drainage Pump Truck",
    flow: [200, 3200],
    head: [4, 30],
    install: "mobile",
    drive: "diesel",
    liquids: ["drainage", "sewage"],
    best: ["drainage"],
    materials: ["ci"],
    points: [
      "Diesel driven: no mains power needed on site",
      "For flood control, emergency drainage and temporary works",
    ],
  },
];

export const LIQUID_LABELS: Record<Liquid, string> = {
  drainage: "Clean or drainage water",
  sewage: "Sewage / wastewater with solids",
  fibrous: "Sewage with rags, fibres or hair",
  chemical: "Viscous, slurry or chemical liquid",
};

export const INSTALL_LABELS: Record<Install | "any", string> = {
  any: "Not sure / any",
  submersible: "Submersible, in the pit",
  vertical: "Vertical, motor above the pit",
  dry: "Dry, beside or above the liquid",
  mobile: "Mobile / emergency",
};

export const MATERIAL_LABELS: Record<Material | "any", string> = {
  any: "Not sure / any",
  ci: "Cast iron",
  ss304: "Stainless steel 304",
  ss316: "Stainless steel 316 / 316L",
};

export const DRIVE_LABELS: Record<Drive | "any", string> = {
  any: "Not sure / any",
  electric: "Electric motor",
  air: "Compressed air",
  diesel: "Diesel (no mains power)",
};
