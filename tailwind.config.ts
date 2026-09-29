import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      colors: {
        background: "#F3F5F9",
        surface: "#F7F8FB",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#356DF3",
          50: "#EFF4FE",
          100: "#DBE6FD",
          200: "#BFD3FB",
          300: "#93B5F8",
          400: "#6090F5",
          500: "#356DF3",
          600: "#2455DC",
          700: "#1D42B4",
          800: "#1C3891",
          900: "#1B3273",
          950: "#121F47",
        },
        electric: "#4B7BFF",
        cyan: {
          DEFAULT: "#06B6D4",
          50: "#ECFEFF",
          100: "#CFFAFE",
          500: "#06B6D4",
          600: "#0891B2",
        },
        purple: {
          DEFAULT: "#7548F5",
          50: "#F5F3FF",
          100: "#EDE9FE",
          500: "#8B5CF6",
          600: "#7548F5",
          700: "#6336DB",
        },
        violet: {
          DEFAULT: "#8B5CF6",
        },
        accent: {
          warm: "#FFB800",
        },
        slate: {
          850: "#151F32",
          900: "#101828",
          950: "#0A0E17",
        },
      },
      borderRadius: {
        sm: "0.5rem", // 8px
        md: "0.75rem", // 12px
        lg: "1rem", // 16px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        raised: "var(--shadow-raised)",
        floating: "var(--shadow-floating)",
        inset: "var(--shadow-inset)",
        pressed: "var(--shadow-pressed)",
        card: "var(--shadow-soft)",
        "card-hover": "var(--shadow-raised)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
