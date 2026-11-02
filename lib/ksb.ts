/** The standalone KSB brand page. Products are listed here, not in WordPress. */
export const KSB_HUB_PATH = "/ksb-pumps";

export type KsbItem = {
  /** URL segment of the series detail page under KSB_HUB_PATH. */
  slug: string;
  /** Type series as KSB names it. */
  name: string;
  /** Model-code prefix seen on nameplates and quotations. */
  code: string;
  /** Detail-page heading, e.g. "KSB Etanorm SYT Thermal Oil Pump". */
  title: string;
  kind: string;
  summary: string;
  /** Official KSB product photo in /public/ksb. */
  image: string;
  /** Published type-series maxima; "" when not stated. */
  flow: string;
  head: string;
  temp: string;
  pressure: string;
  /** Valves only: nominal pressure classes and largest nominal size. */
  pn?: string;
  dn?: string;
  /** Main applications as listed by KSB. */
  uses: string[];
  /** Design points, paraphrased from KSB's product page. */
  features: string[];
};

// Genuine KSB built in KSB's China plant (owner, 2026-11-03), so never "Made in
// Germany". Ranges, applications and features follow the ksb.com product pages
// (checked 2026-11-03); the exact model is confirmed per quote. Photos are KSB's
// official product images.
export const KSB_PUMPS: KsbItem[] = [
  {
    slug: "etanorm-syt",
    name: "Etanorm SYT",
    code: "ETNY",
    title: "KSB Etanorm SYT Thermal Oil Pump",
    image: "/ksb/ksb-etanorm-syt.jpg",
    kind: "Thermal oil pump, horizontal end-suction",
    summary:
      "Single-stage volute pump on a bearing bracket for closed thermal oil and hot water circuits. Back pull-out design, dimensions to EN 733.",
    flow: "754",
    head: "102",
    temp: "350",
    pressure: "16",
    uses: ["Heat transfer (thermal oil) systems", "Hot water circulation", "Process heat in industrial plants"],
    features: [
      "Built for mineral and synthetic thermal oils up to 350 °C.",
      "KSB single mechanical seal, or double seals in tandem with a quench, chosen to suit the oil and temperature.",
      "Patented VenJet venting contour keeps air away from the mechanical seal.",
      "Back pull-out design: the rotating assembly comes out without disturbing the pipework.",
      "Flow up to 754 m³/h and head up to 102 m at up to 16 bar.",
    ],
  },
  {
    slug: "etanorm-rsy",
    name: "Etanorm RSY",
    code: "RSY",
    title: "KSB Etanorm RSY Large Thermal Oil Pump",
    image: "/ksb/ksb-etanorm-rsy.jpg",
    kind: "Large thermal oil pump, horizontal end-suction",
    summary:
      "The larger sizes of the Etanorm thermal oil family, for high-flow heat transfer systems in the chemical and petrochemical industries.",
    flow: "2,285",
    head: "101",
    temp: "350",
    pressure: "16",
    uses: ["Heat transfer (thermal oil) systems", "Hot water circulation", "Chemical and petrochemical plants"],
    features: [
      "The high-flow member of the KSB thermal oil family, up to 2,285 m³/h.",
      "Built for mineral and synthetic thermal oils up to 350 °C.",
      "KSB single mechanical seal, or double seals in tandem with a quench, plus reliable pump venting.",
      "Head up to 101 m at up to 16 bar working pressure.",
    ],
  },
  {
    slug: "etabloc-syt",
    name: "Etabloc SYT",
    code: "ETBY",
    title: "KSB Etabloc SYT Close-Coupled Thermal Oil Pump",
    image: "/ksb/ksb-etabloc-syt.jpg",
    kind: "Thermal oil pump, close-coupled",
    summary:
      "Close-coupled thermal oil pump: pump and motor form one compact unit with no coupling or baseplate, for heat transfer systems where space is tight.",
    flow: "337",
    head: "99",
    temp: "350",
    pressure: "16",
    uses: ["Heat transfer (thermal oil) systems", "Hot water circulation", "Compact heater and skid installations"],
    features: [
      "Close-coupled: no coupling, coupling guard or separate baseplate to align.",
      "Built for mineral and synthetic thermal oils up to 350 °C.",
      "KSB single mechanical seal, or double seals in tandem with a quench, chosen to suit the application.",
      "Flow up to 337 m³/h and head up to 99 m at up to 16 bar.",
    ],
  },
  {
    slug: "etabloc",
    name: "Etabloc",
    code: "ETB",
    title: "KSB Etabloc Close-Coupled Standard Pump",
    image: "/ksb/ksb-etabloc.jpg",
    kind: "Standard pump, close-coupled",
    summary:
      "Pump and motor on one shaft line with no coupling or baseplate, so it fits tight pump rooms. Cast iron or stainless steel wetted parts, ratings to EN 733.",
    flow: "740",
    head: "160",
    temp: "140",
    pressure: "16",
    uses: ["Water supply systems", "Cooling circuits", "Swimming pools", "Clean or mildly aggressive liquids"],
    features: [
      "Single-stage volute casing pump in close-coupled design, ratings to EN 733.",
      "Efficient hydraulics with the impeller trimmed to the duty point as standard.",
      "Optional speed control (PumpDrive) or virtual impeller trimming (MyFlow) to match changing duty points.",
      "Flow up to 740 m³/h and head up to 160 m, fluid temperature up to 140 °C.",
    ],
  },
  {
    slug: "hpk-l",
    name: "HPK-L",
    code: "HPK-L",
    title: "KSB HPK-L Hot Water & Thermal Oil Pump",
    image: "/ksb/ksb-hpk-l.jpg",
    kind: "Hot water and thermal oil pump, air-cooled",
    summary:
      "Horizontal single-stage volute pump in back pull-out design with an air-cooled bearing bracket, so no external cooling water is needed.",
    flow: "1,400",
    head: "233",
    temp: "400",
    pressure: "40",
    uses: ["Heating systems", "Forced circulation boilers", "District heating", "Organic and synthetic heat transfer fluids"],
    features: [
      "Handles hot water and organic or synthetic heat transfer fluids up to 400 °C.",
      "Air-cooled design: no external cooling water connection to run.",
      "Patented VenJet venting chamber keeps air away from rotating parts and protects the seal from running dry.",
      "Flow up to 1,400 m³/h and head up to 233 m at up to 40 bar.",
    ],
  },
];

export const KSB_VALVES: KsbItem[] = [
  {
    slug: "boa-h",
    name: "BOA-H",
    code: "BOA-H",
    title: "KSB BOA-H Bellows-Sealed Globe Valve",
    image: "/ksb/ksb-boa-h.jpg",
    kind: "Bellows-sealed globe valve",
    summary:
      "Flanged globe valve with a metal bellows at the stem, for hot water heating, air-conditioning and boiler feed lines.",
    flow: "",
    head: "",
    temp: "350",
    pressure: "25",
    pn: "PN 16 / PN 25",
    dn: "DN 350",
    uses: ["Hot water heating systems", "Air-conditioning systems", "Boiler feed applications", "Boiler recirculation"],
    features: [
      "When the valve is fully open, the bellows sits inside the valve body, protected from pressure surges.",
      "Position indicator with travel stop and locking device outside the insulation: the disc position can be checked at any time.",
      "Throttling plug as standard up to DN 100; a seat-guided V-port plug is available for all sizes.",
      "PN 16 and PN 25, up to DN 350, fluid temperature up to 350 °C.",
    ],
  },
  {
    slug: "boa-s",
    name: "BOA-S",
    code: "BOA-S",
    title: "KSB BOA-S Flanged Strainer",
    image: "/ksb/ksb-boa-s.jpg",
    kind: "Flanged Y-strainer",
    summary:
      "Flanged strainer with a stainless steel screen that catches weld slag, rust and scale before they reach pumps and control valves.",
    flow: "",
    head: "",
    temp: "350",
    pressure: "25",
    pn: "PN 6 / PN 16 / PN 25",
    dn: "DN 400",
    uses: ["Hot water heating systems", "Air-conditioning systems", "Process engineering", "Chemical industry"],
    features: [
      "Stainless steel screen for a long service life.",
      "The screen can be replaced without removing the body insulation, using the studs as centering aids.",
      "Drain plug as standard for easy inspection and draining, useful on large sizes.",
      "PN 6, PN 16 and PN 25, up to DN 400, fluid temperature up to 350 °C.",
    ],
  },
];

export const KSB_ITEMS = [...KSB_PUMPS, ...KSB_VALVES];

export const ksbPath = (item: KsbItem) => `${KSB_HUB_PATH}/${item.slug}`;
