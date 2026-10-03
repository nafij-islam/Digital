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
        sans: ["var(--font-heading)", "var(--font-ui)", "sans-serif"],
        display: ["var(--font-heading)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
        ui: ["var(--font-ui)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      colors: {
        background: "#0B0F19",
        secondary: "#0F1424",
        surface: {
          DEFAULT: "#141A2E",
          light: "#1C233D",
          dark: "#0D1220",
        },
        card: "#141A2E",
        primary: {
          DEFAULT: "#6366F1",
          bright: "#818CF8",
          50: "#0F1424",
          100: "#1C233D",
          200: "#312E81",
          300: "#4338CA",
          400: "#4F46E5",
          500: "#6366F1",
          600: "#818CF8",
          700: "#A5B4FC",
          800: "#C7D2FE",
          900: "#E0E7FF",
          950: "#EEF2FF",
        },
        accent: {
          DEFAULT: "#6366F1",
          bright: "#818CF8",
        },
        neu: {
          bg: "#0B0F19",
          surface: "#141A2E",
          light: "#1C233D",
          dark: "#0F1424",
          accent: "#6366F1",
          bright: "#818CF8",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#CBD5E1",
          muted: "#94A3B8",
        },
        success: "#10B981",
        danger: "#F43F5E",
      },
      borderRadius: {
        sm: "0.5rem", // 8px
        md: "0.75rem", // 12px
        lg: "1rem", // 16px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "2rem", // 32px
      },
      boxShadow: {
        raised: "10px 10px 24px rgba(16,16,35,.55), -7px -7px 18px rgba(73,73,118,.16)",
        "raised-sm": "5px 5px 14px rgba(16,16,35,.55), -4px -4px 10px rgba(73,73,118,.16)",
        "raised-lg": "14px 14px 30px rgba(16,16,35,.6), -9px -9px 22px rgba(73,73,118,.18)",
        pressed: "inset 6px 6px 14px rgba(16,16,35,.55), inset -5px -5px 12px rgba(78,78,128,.14)",
        "pressed-sm": "inset 3px 3px 8px rgba(16,16,35,.55), inset -2px -2px 6px rgba(78,78,128,.14)",
        soft: "10px 10px 24px rgba(16,16,35,.55), -7px -7px 18px rgba(73,73,118,.16)",
        floating: "14px 14px 32px rgba(16,16,35,.6), -8px -8px 20px rgba(73,73,118,.18)",
        card: "10px 10px 24px rgba(16,16,35,.55), -7px -7px 18px rgba(73,73,118,.16)",
        "card-hover": "12px 12px 28px rgba(16,16,35,.6), -8px -8px 20px rgba(73,73,118,.2)",
        "accent-glow": "0 0 24px rgba(113, 109, 255, 0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
