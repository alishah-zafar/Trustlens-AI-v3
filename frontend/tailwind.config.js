/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0efff",
          200: "#b9ddff",
          300: "#7cc2ff",
          400: "#36a4ff",
          500: "#0c87f0",
          600: "#006acd",
          700: "#0054a6",
          800: "#054889",
          900: "#0a3d71",
          950: "#07264b",
        },
      },
    },
  },
  plugins: [],
};
