/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Black + Red minimal palette */
        base: {
          DEFAULT: "#0A0A0A",
          dark: "#050505",
          card: "#141414",
          hover: "#1C1C1C",
        },
        accent: {
          DEFAULT: "#E53E3E",
          light: "#FC8181",
          dark: "#9B2C2C",
        },
        safe: "#48BB78",
        warn: "#ECC94B",
        txt: {
          DEFAULT: "#FFFFFF",
          muted: "#A0A0A0",
          dim: "#6B6B6B",
        },
        line: "#2A2A2A",
        /* Legacy tokens — remapped */
        navy: "#0A0A0A",
        ivory: "#FFFFFF",
        crimson: "#E53E3E",
        gold: "#ECC94B",
        cool: "#E53E3E",
        "cool-light": "#FC8181",
        warm: "#E53E3E",
        "warm-light": "#FC8181",
        emerald: { 400: "#48BB78", 500: "#48BB78" },
      },
      fontFamily: {
        sans: ['"Inter"', '"Manrope"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "0.5rem",
        "3xl": "0.75rem",
      },
    },
  },
  plugins: [],
};
