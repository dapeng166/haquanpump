import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { company, siteConfig } from "@/lib/site";
import { defaultLocale } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleTranslateLoader } from "@/components/layout/GoogleTranslate";
import { BrandTranslationFix } from "@/components/layout/BrandTranslationFix";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.defaultDescription,
  keywords: [
    "industrial pump manufacturer",
    "sewage pump",
    "grinder pump",
    "self-priming pump",
    "stainless steel submersible pump",
    "AODD pump",
    "WILDEN compatible pump",
    "ISG IRG IHG ISW centrifugal pump",
    "China pump supplier",
  ],
  authors: [{ name: company.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: company.shortName,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    url: company.url,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: company.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
  // Google Search Console ownership verification.
  verification: { google: "8tRFB2QF-m6vSDXQUkxA4seKvaRQAq8ZW7MkyMKTFFk" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  // Allow zooming for accessibility; cap initial layout to device width.
  maximumScale: 5,
};

// Google Translate rewrites text nodes (wrapping them in <font> tags). When
// React later reconciles the DOM during a client navigation it can try to
// remove/insert nodes whose parent has changed, throwing a NotFoundError and
// crashing the app ("client-side exception"). This guard makes removeChild /
// insertBefore no-op gracefully on a parent mismatch — the standard, safe fix
// for using a third-party translator alongside React. It runs before hydration.
const REACT_TRANSLATE_FIX = `
(function () {
  if (typeof Node !== 'function' || !Node.prototype) return;
  var removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) return child;
    return removeChild.apply(this, arguments);
  };
  var insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return insertBefore.apply(this, arguments);
  };
})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // English is the source language; the Google-powered switcher translates the
  // whole page on demand and manages text direction for RTL languages.
  return (
    <html
      lang={defaultLocale}
      dir="ltr"
      className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        {/* Runs before hydration — guards React against Google Translate's DOM edits. */}
        <script dangerouslySetInnerHTML={{ __html: REACT_TRANSLATE_FIX }} />
        <I18nProvider initialLocale={defaultLocale}>
          <Header />
          <main>{children}</main>
          <Footer />
          <GoogleTranslateLoader />
          {/* Corrects Google Translate's 哈昆 → 哈泉 brand mistranslation. */}
          <BrandTranslationFix />
        </I18nProvider>
      </body>
    </html>
  );
}
