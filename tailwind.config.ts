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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Cinematic warm dark palette from reference image
        cinema: {
          950: "#0C0B0A",
          900: "#131211",
          850: "#1A1816",
          800: "#22201D",
          750: "#2C2925",
          700: "#38342F",
          600: "#524D46",
          500: "#78716C",
          400: "#A8A29E",
          300: "#D6D3D1",
          200: "#E7E5E4",
          100: "#F5F5F4",
          50: "#FAFAF9",
        },
        warmGlow: {
          DEFAULT: "rgba(245, 230, 211, 0.12)",
          amber: "rgba(217, 119, 6, 0.15)",
          lamp: "#EAD7C0",
        },
        terracotta: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        forest: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
        },
        coral: {
          500: "#F43F5E",
          600: "#E11D48",
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-jakarta)", "sans-serif"],
      },
      boxShadow: {
        glass: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.1) inset",
        "card-cinematic": "0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.12)",
        "capsule-glow": "0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 15px 0 rgba(234, 215, 192, 0.08)",
        glow: "0 0 25px -5px rgba(234, 88, 12, 0.4)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.4)",
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        '5xl': '2.75rem',
      }
    },
  },
  plugins: [],
};
export default config;
