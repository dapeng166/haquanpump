// Short names for the pump-series filter under "Technical Guides" on the
// News & Guides page. The full WordPress series names are too long for a row
// of chips. Localized routes translate these; a series missing here falls back
// to its WordPress name.
export const SERIES_SHORT: Record<string, string> = {
  "deep-well-pump": "Deep Well Pumps",
  "pipeline-centrifugal-pump": "Pipeline & CDL Pumps",
  "qdx-small-submersible-pump": "QDX Small Pumps",
  "submersible-sewage-pumps": "WQ Submersible Pumps",
  "gnwq-cutting-submersible-sewage-pump": "GNWQ Cutter Pumps",
  "chopper-pump": "WQK Cutter Pumps",
  "yw-liquid-submerged-sewage-pump": "YW Vertical Pumps",
  "zw-self-priming-sewage-pump": "ZW Self-Priming Pumps",
  "zwl-self-priming-sewage-pump": "ZWL Self-Priming Pumps",
  "aodd-pump": "QBY Diaphragm Pumps",
  "wilden-aodd-pump": "Wilden Pumps",
  "mobile-diesel-pump-truck": "Mobile Pump Trucks",
};

/** Guides written as news posts carry no pump series; they share this chip. */
export const GENERAL_SERIES = "general";
