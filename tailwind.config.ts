import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A1626",
          900: "#0A1626",
          800: "#0E2138",
          700: "#13314f",
        },
        navy: {
          DEFAULT: "#0B2545",
          50: "#eef4fb",
          100: "#d8e6f6",
          200: "#b3cdec",
          300: "#84acdd",
          400: "#5286c9",
          500: "#2f66b0",
          600: "#1f4f93",
          700: "#1a3f76",
          800: "#163461",
          900: "#0B2545",
        },
        brand: {
          DEFAULT: "#0E63C4",
          50: "#e9f2fd",
          100: "#cfe2fb",
          200: "#a0c6f6",
          300: "#6ba6ef",
          400: "#3585e4",
          500: "#0E63C4",
          600: "#0a4f9e",
          700: "#093f7e",
          800: "#0a3463",
          900: "#0b2c50",
        },
        aqua: {
          DEFAULT: "#16C7E0",
          50: "#e6fbfe",
          100: "#c2f4fb",
          200: "#8ae9f5",
          300: "#4cd9ec",
          400: "#16C7E0",
          500: "#06a6bf",
          600: "#087d92",
          700: "#0a6c7c",
        },
        // Primary brand accent — industrial orange #FF6B35 (per design brief)
        accent: {
          DEFAULT: "#FF6B35",
          50: "#fff3ee",
          100: "#ffe2d4",
          200: "#ffc1a8",
          300: "#ff9a72",
          400: "#ff7d4d",
          500: "#FF6B35",
          600: "#ed4d12",
          700: "#c43a0d",
          800: "#9b3013",
          900: "#7c2912",
        },
        // Charcoal surface scale for the dark theme
        charcoal: {
          DEFAULT: "#0B0F17",
          950: "#060910",
          900: "#0B0F17",
          850: "#0F1521",
          800: "#141B2A",
          700: "#1C2536",
          600: "#28344A",
          500: "#3A4860",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "var(--font-inter)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-up": "fade-up 0.7s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
        "spin-slow": "spin-slow 22s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
