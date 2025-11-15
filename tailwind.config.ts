import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#f2eac5",
          light: "#f6f0d6",
        },
        gold: {
          DEFAULT: "#e1cf7a",
          dark: "#d0b42f",
        },
        yellow: "#ffe568",
        green: "#60d66a",
        teal: "#7ae1cf",
        purple: "#cf7ae1",
        orange: "#ffb551",
        red: {
          DEFAULT: "#ff4e4e",
          dark: "#900000",
        },
        brown: "#38310f",
      },
      fontFamily: {
        mukta: ["var(--font-mukta)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "4xl": ["64px", { lineHeight: "1.2" }],
        "3xl": ["48px", { lineHeight: "1.2" }],
        "2xl": ["36px", { lineHeight: "1.3" }],
        "xl": ["32px", { lineHeight: "1.4" }],
        "lg": ["24px", { lineHeight: "1.4" }],
        "base": ["20px", { lineHeight: "1.5" }],
        "sm": ["16px", { lineHeight: "1.5" }],
        "xs": ["14px", { lineHeight: "1.5" }],
      },
      borderRadius: {
        pill: "450px",
        input: "116px",
        card: "63px",
      },
      boxShadow: {
        card: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
