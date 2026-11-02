/** The standalone KSB brand page. Products are listed here, not in WordPress. */
export const KSB_HUB_PATH = "/ksb-pumps";

export type KsbItem = {
  /** Type series as KSB names it. */
  name: string;
  /** Model-code prefix seen on nameplates and quotations. */
  code: string;
  kind: string;
  summary: string;
  /** Official KSB product photo in /public/ksb. */
  image: string;
  /** Published type-series maxima; "" when not stated. */
  flow: string;
  head: string;
  temp: string;
  pressure: string;
  uses: string[];
};

// Genuine KSB built in KSB's China plant (owner, 2026-11-03), so never "Made in
// Germany". Ranges are the type-series maxima from ksb.com (checked 2026-11-03);
// the exact model is confirmed per quote. Photos are KSB's official product images.
export const KSB_PUMPS: KsbItem[] = [
  {
    name: "Etanorm SYT",
    code: "ETNY",
    image: "/ksb/ksb-etanorm-syt.jpg",
    kind: "Thermal oil pump, horizontal end-suction",
    summary:
      "Single-stage volute pump on a bearing bracket for closed thermal oil and hot water circuits. Back pull-out design, dimensions to EN 733.",
    flow: "754",
    head: "102",
    temp: "350",
    pressure: "16",
    uses: ["Thermal oil heaters", "Textile dyeing and printing", "Plastics, food and chemical plants"],
  },
  {
    name: "Etanorm RSY",
    code: "RSY",
    image: "/ksb/ksb-etanorm-rsy.jpg",
    kind: "Large thermal oil pump, horizontal end-suction",
    summary:
      "The larger sizes of the Etanorm thermal oil family, for high-flow heat transfer systems in the chemical and petrochemical industries.",
    flow: "2,285",
    head: "101",
    temp: "350",
    pressure: "16",
    uses: ["Large thermal oil systems", "Chemical and petrochemical plants", "Hot water circulation"],
  },
  {
    name: "Etabloc SYT",
    code: "ETBY",
    image: "/ksb/ksb-etabloc-syt.jpg",
    kind: "Thermal oil pump, close-coupled",
    summary:
      "Close-coupled thermal oil pump for horizontal or vertical installation. Pump-end bearing lubricated by the pumped oil.",
    flow: "337",
    head: "99",
    temp: "350",
    pressure: "16",
    uses: ["Compact thermal oil heaters", "Hot water circulation", "Plastics and food processing"],
  },
  {
    name: "Etabloc",
    code: "ETB",
    image: "/ksb/ksb-etabloc.jpg",
    kind: "Standard pump, close-coupled",
    summary:
      "Pump and motor on one shaft line with no coupling or baseplate, so it fits tight pump rooms. Cast iron or stainless steel wetted parts, hydraulics to EN 733.",
    flow: "740",
    head: "160",
    temp: "140",
    pressure: "16",
    uses: ["Water supply and pressure boosting", "Cooling water and HVAC circuits", "Swimming pool filtration"],
  },
  {
    name: "HPK-L",
    code: "HPK-L",
    image: "/ksb/ksb-hpk-l.jpg",
    kind: "Hot water and thermal oil pump, air-cooled",
    summary:
      "Horizontal single-stage volute pump with an air-cooled bearing bracket, so no external cooling water is needed. Built to ISO 2858 / ISO 5199.",
    flow: "1,400",
    head: "233",
    temp: "400",
    pressure: "40",
    uses: ["Forced circulation boilers", "District heating", "High-temperature thermal oil circuits"],
  },
];

export const KSB_VALVES: KsbItem[] = [
  {
    name: "BOA-H",
    code: "BOA-H",
    image: "/ksb/ksb-boa-h.jpg",
    kind: "Bellows-sealed globe valve",
    summary:
      "Flanged valve with a metal bellows plus back-up packing at the stem, so the stem does not leak. For steam, thermal oil and hot water lines.",
    flow: "",
    head: "",
    temp: "350",
    pressure: "25",
    uses: ["Steam and boiler lines", "Thermal oil systems", "Hot water heating"],
  },
  {
    name: "BOA-S",
    code: "BOA-S",
    image: "/ksb/ksb-boa-s.jpg",
    kind: "Flanged Y-strainer",
    summary:
      "Stainless steel screen in a flanged Y-body that catches weld slag, rust and scale before they reach pumps and control valves.",
    flow: "",
    head: "",
    temp: "350",
    pressure: "25",
    uses: ["Upstream of pumps", "Ahead of control and relief valves", "Heating and process pipework"],
  },
];
