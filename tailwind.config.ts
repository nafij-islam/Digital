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
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      colors: {
        background: "#F8FAFC",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#2563EB",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        electric: "#3B82F6",
        cyan: {
          DEFAULT: "#06B6D4",
          50: "#ECFEFF",
          100: "#CFFAFE",
          500: "#06B6D4",
          600: "#0891B2",
        },
        purple: {
          DEFAULT: "#7C3AED",
          50: "#F5F3FF",
          100: "#EDE9FE",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },
        violet: {
          DEFAULT: "#8B5CF6",
        },
        pink: {
          DEFAULT: "#EC4899",
          500: "#EC4899",
          600: "#DB2777",
        },
        orange: {
          DEFAULT: "#F97316",
          500: "#F97316",
          600: "#EA580C",
        },
        green: {
          DEFAULT: "#10B981",
          500: "#10B981",
          600: "#059669",
        },
        slate: {
          850: "#151F32",
          900: "#0F172A",
          950: "#020617",
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px -1px rgba(15, 23, 42, 0.04), 0 1px 3px -1px rgba(15, 23, 42, 0.02)',
        'card-hover': '0 10px 25px -4px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        'glow': '0 0 25px -5px rgba(37, 99, 235, 0.25)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
