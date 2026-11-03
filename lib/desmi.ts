/** The standalone DESMI brand page. Products are listed here, not in WordPress. */
export const DESMI_HUB_PATH = "/desmi-pumps";

export type DesmiItem = {
  /** URL segment of the series detail page under DESMI_HUB_PATH. */
  slug: string;
  /** Type series as DESMI names it. */
  name: string;
  /** Series code seen on nameplates and quotations. */
  code: string;
  /** Detail-page heading, e.g. "DESMI ROTAN HD Heavy-Duty Gear Pump". */
  title: string;
  kind: string;
  summary: string;
  /** Official DESMI product photo in /public/desmi (Ex mark removed). */
  image: string;
  material: string;
  /** Published type-series maxima; "" when not stated. */
  flow: string;
  viscosity: string;
  temp: string;
  pressure: string;
  /** Typical liquids as listed by DESMI. */
  uses: string[];
  /** Design points, paraphrased from DESMI's product page. */
  features: string[];
};

// Genuine DESMI built in DESMI's China plant (owner, 2026-11-03), so never "Made
// in Denmark". Ranges, liquids and features follow the desmi.com product pages
// (checked 2026-11-03); no certification wording. Lead time about 10 weeks, no
// rush orders, 12-month warranty (owner, 2026-11-03).
export const DESMI_ITEMS: DesmiItem[] = [
  {
    slug: "rotan-gp",
    name: "ROTAN GP",
    code: "GP",
    title: "DESMI ROTAN GP General Purpose Gear Pump",
    image: "/desmi/desmi-rotan-gp.jpg",
    kind: "Internal gear pump for clean liquids",
    summary:
      "Simple, compact cast iron internal gear pump for clean, non-abrasive liquids, also built as a close-coupled model for IEC or NEMA flange motors.",
    material: "Cast iron",
    flow: "50",
    viscosity: "7,500",
    temp: "150",
    pressure: "16",
    uses: ["Clean oil and lube oil", "Glycol", "Vegetable oil and fish oil", "Waste oil and solvents"],
    features: [
      "Self-priming with large suction capability and a low NPSH requirement.",
      "Self-draining integral safety relief valve.",
      "Opposing inlet and outlet connections with oversized ports.",
      "Close-coupled model available for IEC or NEMA flange motors.",
      "Flow up to 50 m³/h, viscosity up to 7,500 cSt, up to 16 bar and 150 °C.",
    ],
  },
  {
    slug: "rotan-hd",
    name: "ROTAN HD",
    code: "HD",
    title: "DESMI ROTAN HD Heavy-Duty Gear Pump",
    image: "/desmi/desmi-rotan-hd.jpg",
    kind: "Internal gear pump for viscous liquids",
    summary:
      "Cast iron internal gear pump for a wide range of viscous, non-corrosive liquids, with a back pull-out design for quick service.",
    material: "Cast iron",
    flow: "250",
    viscosity: "250,000",
    temp: "250",
    pressure: "16",
    uses: ["Oil, base oil and grease", "Asphalt, bitumen and pitch", "Paint, lacquer and polyester", "Molasses, maltose and soap"],
    features: [
      "Back pull-out design: the rotating parts come out without disturbing the pipework.",
      "Flexible sealing options to suit the liquid and temperature.",
      "Full heating or cooling jackets available for hot or solidifying liquids.",
      "90° port orientation available.",
      "Flow up to 250 m³/h, viscosity up to 250,000 cSt, up to 16 bar and 250 °C.",
    ],
  },
  {
    slug: "rotan-pd",
    name: "ROTAN PD",
    code: "PD",
    title: "DESMI ROTAN PD Petrochemical Gear Pump",
    image: "/desmi/desmi-rotan-pd.jpg",
    kind: "Internal gear pump for refinery and petrochemical duty",
    summary:
      "Internal gear pump for refinery and petrochemical service, with all pressure-containing parts in carbon steel.",
    material: "Carbon steel",
    flow: "250",
    viscosity: "250,000",
    temp: "250",
    pressure: "16",
    uses: ["Fuel oil and gasoline", "Lube oil, grease and additives", "Bitumen and wax", "Polystyrene and other hydrocarbon liquids"],
    features: [
      "All pressure-containing parts in carbon steel.",
      "Shaft seal choice: gland packing, single or double mechanical seal, component or cartridge seal.",
      "Heating jackets at the front and back available.",
      "90° angular configuration available.",
      "Flow up to 250 m³/h, viscosity up to 250,000 cSt, up to 16 bar and 250 °C.",
    ],
  },
  {
    slug: "rotan-cd",
    name: "ROTAN CD",
    code: "CD",
    title: "DESMI ROTAN CD Stainless Steel Gear Pump",
    image: "/desmi/desmi-rotan-cd.jpg",
    kind: "Internal gear pump for corrosive liquids",
    summary:
      "Stainless steel internal gear pump for corrosive liquids in chemical processing, food and pharmaceutical plants.",
    material: "Stainless steel",
    flow: "250",
    viscosity: "250,000",
    temp: "250",
    pressure: "16",
    uses: ["Organic acids, alkali and caustic soda", "Animal and vegetable fats, fatty acids", "Resin, polymer solutions and paint", "Soap, shampoo and chocolate"],
    features: [
      "Stainless steel construction for corrosive and hygienic duties.",
      "Back pull-out design for service without disturbing the pipework.",
      "Flexible sealing options and full heating or cooling jackets.",
      "90° angular configuration available.",
      "Flow up to 250 m³/h, viscosity up to 250,000 cSt, up to 16 bar and 250 °C.",
    ],
  },
  {
    slug: "rotan-ed",
    name: "ROTAN ED",
    code: "ED",
    title: "DESMI ROTAN ED Magnetic Drive Gear Pump",
    image: "/desmi/desmi-rotan-ed.jpg",
    kind: "Sealless magnetic drive gear pump",
    summary:
      "Magnetically coupled internal gear pump with no shaft seal, for hazardous liquids that must not leak.",
    material: "Iron, steel or stainless steel",
    flow: "90",
    viscosity: "10,000",
    temp: "250",
    pressure: "16",
    uses: ["Isocyanates, polyols and monomers", "Solvents and hazardous organic liquids", "Resins, alkyd resins and printing ink", "Soybean oil, linseed oil and corn syrup"],
    features: [
      "Magnetic coupling: no shaft seal to leak or to maintain.",
      "Often a lower-cost choice than a pump with double mechanical seals.",
      "Tungsten carbide wear parts available for abrasive duty.",
      "Reversible flow, with an optional double-acting relief valve.",
      "Flow up to 90 m³/h, viscosity up to 10,000 cSt, up to 16 bar and 250 °C.",
    ],
  },
  {
    slug: "rotan-chd",
    name: "ROTAN CHD",
    code: "CHD",
    title: "DESMI ROTAN CHD Chocolate Pump",
    image: "/desmi/desmi-rotan-chd.jpg",
    kind: "Internal gear pump for chocolate",
    summary:
      "Internal gear pump designed for chocolate and confectionery, gentle on the product both mechanically and in temperature.",
    material: "Cast iron, carbon steel or stainless steel",
    flow: "",
    viscosity: "",
    temp: "",
    pressure: "",
    uses: ["Cocoa mass (liquor)", "Milk, dark and white chocolate", "Couverture and conched chocolate", "Caramel cream and melange"],
    features: [
      "Special T2 rotor tolerance for gentle handling of chocolate.",
      "Dedicated chocolate shaft seal.",
      "Heating jackets at the front and rear as standard.",
      "Back pull-out design for quick cleaning and service.",
      "Developed over more than 50 years with leading chocolate plant builders.",
    ],
  },
];

export const desmiPath = (item: DesmiItem) => `${DESMI_HUB_PATH}/${item.slug}`;

/** Meta description for a series detail page (English; locale routes translate it). */
export function desmiDetailDescription(item: DesmiItem): string {
  const specs = item.flow
    ? `up to ${item.flow} m³/h, ${item.viscosity} cSt, ${item.temp} °C and ${item.pressure} bar`
    : item.material.toLowerCase();
  return `Genuine, original DESMI ${item.name} (${item.code}): ${item.kind.toLowerCase()}, ${specs}. Quote by model code, 12-month warranty, lead time about 10 weeks.`;
}
