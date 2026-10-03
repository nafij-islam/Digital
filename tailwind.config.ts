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
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      colors: {
        background: "#29294D",
        secondary: "#2C2C52",
        surface: {
          DEFAULT: "#303057",
          light: "#353560",
          dark: "#262647",
        },
        card: "#303057",
        primary: {
          DEFAULT: "#5754D8",
          bright: "#716DFF",
          50: "#2C2C52",
          100: "#353560",
          200: "#4340A0",
          300: "#504CC0",
          400: "#5754D8",
          500: "#5754D8",
          600: "#716DFF",
          700: "#8682FF",
          800: "#A3A0FF",
          900: "#C6C4FF",
          950: "#EBEAFF",
        },
        accent: {
          DEFAULT: "#5754D8",
          bright: "#716DFF",
        },
        neu: {
          bg: "#29294D",
          surface: "#303057",
          light: "#353560",
          dark: "#2C2C52",
          accent: "#5754D8",
          bright: "#716DFF",
        },
        text: {
          primary: "#F5F5FA",
          secondary: "#AAAAC1",
          muted: "#777790",
        },
        success: "#6CD6B3",
        danger: "#EF7B98",
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
