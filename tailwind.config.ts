import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        monograph: {
          canvas: "#F7F5F0",
          surface: "#F0EDE4",
          olive: "#283826",
          sage: "#6C7D64",
          ochre: "#B07D4F",
          border: "#E1DDD2",
          ink: "#1A2219",
          muted: "#556052",
        },
        olive: {
          primary: "#283826",
          deep: "#364A33",
          dark: "#1A2219",
          muted: "#6C7D64",
          accent: "#8A9A5B",
          DEFAULT: "#283826",
        },
        beige: {
          warm: "#F7F5F0",
          soft: "#F0EDE4",
          light: "#FAF8F5",
          DEFAULT: "#F7F5F0",
        },
        brand: {
          dark: "#1A2219",
          muted: "#556052",
          light: "#FAF8F5",
          bg: "#F7F5F0",
          bgSoft: "#F0EDE4",
          olive: "#283826",
          oliveDeep: "#364A33",
          sage: "#6C7D64",
          ochre: "#B07D4F",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Source Serif 4", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "-apple-system", "sans-serif"],
        display: ["var(--font-serif)", "Source Serif 4", "Georgia", "serif"],
      },
      borderRadius: {
        "card": "16px",
        "pill": "9999px",
      },
      boxShadow: {
        "olive-glow": "0 8px 30px rgba(85, 107, 47, 0.25)",
        "soft-shadow": "0 10px 40px -10px rgba(40, 48, 29, 0.08)",
        "card-hover": "0 20px 40px -15px rgba(85, 107, 47, 0.15)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 25s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
