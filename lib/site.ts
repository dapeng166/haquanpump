// Single source of truth for company facts, navigation and SEO defaults.
// Edit here to update the whole site.

export const company = {
  name: "Shanghai Haquan Pump Valve Manufacturing Co., Ltd.",
  shortName: "Haquan Pump",
  founded: 2014,
  tagline: "Engineered Fluid Solutions for Global Industry",
  description:
    "Shanghai Haquan Pump Valve Manufacturing Co., Ltd. is an industrial pump manufacturer founded in 2014, supplying sewage, grinder, self-priming, submersible, AODD and pipeline centrifugal pumps to clients in over 60 countries.",
  email: "sales@haquanpump.com",
  salesEmail: "sales@haquanpump.com",
  phone: "+86 150 0057 7161",
  phoneHref: "+8615000577161",
  whatsapp: "+8615000577161",
  address: {
    line1: "No. 868, Jinqi Road",
    line2: "Fengxian District",
    city: "Shanghai",
    postcode: "201400",
    country: "China",
    full: "No. 868, Jinqi Road, Fengxian District, Shanghai 201400, China",
  },
  // Used for canonical URLs / metadata / sitemap.
  url: "https://www.haquanpump.com",
  // Google Maps embed centred on Fengxian District, Shanghai.
  mapEmbed:
    "https://www.google.com/maps?q=Fengxian+District,+Shanghai,+China&output=embed",
  social: {
    linkedin: "https://www.linkedin.com/company/haquanpump",
    x: "https://x.com/HaquanPump",
    whatsapp: "https://wa.me/8615000577161",
  },
} as const;

export const mainNav = [
  { key: "nav.home", href: "/" },
  { key: "nav.about", href: "/about" },
  { key: "nav.products", href: "/products" },
  { key: "nav.news", href: "/news" },
  { key: "nav.support", href: "/support" },
  { key: "nav.contact", href: "/contact" },
] as const;

export const industries = [
  "Mining",
  "Municipal Water",
  "Irrigation",
  "Petrochemical",
  "Power Plants",
  "Metallurgy",
  "Marine",
  "HVAC",
  "Pharmaceuticals",
  "Boilers",
] as const;

// WordPress REST API base. Override with NEXT_PUBLIC_WP_API_URL in .env.local.
export const WP_API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL ?? "https://cms.haquanpump.com/wp-json";

export const siteConfig = {
  defaultTitle: `${company.shortName} | Industrial Pump Manufacturer Since 2014`,
  titleTemplate: "%s | Haquan Pump",
  defaultDescription: company.description,
  ogImage:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
};
