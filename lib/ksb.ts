/** The standalone KSB brand page. Products are listed here, not in WordPress. */
export const KSB_HUB_PATH = "/ksb-pumps";

export type KsbItem = {
  /** Type series as KSB names it. */
  name: string;
  /** Model-code prefix seen on nameplates and quotations. */
  code: string;
  kind: string;
  summary: string;
  /** Published type-series maxima; "" when not stated. */
  flow: string;
  head: string;
  temp: string;
  pressure: string;
  uses: string[];
};

// Genuine KSB built in KSB's China plant (owner, 2026-11-03), so never "Made in
// Germany". Ranges are the type-series maxima; the exact model is confirmed per quote.
export const KSB_PUMPS: KsbItem[] = [
  {
    name: "Etanorm SYT",
    code: "ETNY",
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
    kind: "Large thermal oil pump, horizontal end-suction",
    summary:
      "The larger sizes of the Etanorm thermal oil family, for high-flow heat transfer systems with suction branches up to DN 500.",
    flow: "2,285",
    head: "160",
    temp: "350",
    pressure: "16",
    uses: ["Large thermal oil systems", "Petrochemical and polyester fibre plants", "Energy-saving system upgrades"],
  },
  {
    name: "Etabloc SYT",
    code: "ETBY",
    kind: "Thermal oil pump, close-coupled",
    summary:
      "Close-coupled thermal oil pump for horizontal or vertical installation. Pump-end bearing lubricated by the pumped oil. Replaces the older SY series one for one.",
    flow: "337",
    head: "99",
    temp: "350",
    pressure: "16",
    uses: ["Compact thermal oil heaters", "Hot water circulation", "Replacing old KSB SY pumps"],
  },
  {
    name: "Etabloc",
    code: "ETB",
    kind: "Standard pump, close-coupled",
    summary:
      "Pump and motor on one shaft line with no coupling or baseplate, so it fits tight pump rooms. Cast iron or stainless steel wetted parts, hydraulics to EN 733.",
    flow: "",
    head: "",
    temp: "",
    pressure: "",
    uses: ["Water supply and pressure boosting", "Cooling water and HVAC circuits", "Swimming pool filtration"],
  },
  {
    name: "HPK-L",
    code: "HPK-L",
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
