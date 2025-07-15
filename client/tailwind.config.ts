import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#FFFFFF",
          dark: "#283232",
          green: "#ADFF00",
        },
        secondary: {
          blueLight: "#394646",
          darkBrand: "#1F2828",
        },
        neutral: {
          dark1: "#1F2933",
          dark2: "#323F4B",
          grey1: "#6B7580",
          grey2: "#9FA8B1",
          grey3: "#B0B8BF",
          softGrey1: "#DCF0E3",
          softGrey2: "#EBEDFO",
          softGrey3: "#FAFAFB",
          white: "#FFFFFF",
        },
        system: {
          red: "#EF4E4E",
          yellow: "#FBBE4A",
          green: "#3EBD93",
          blue: "#3EBD93",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config; // Changed from "export const config"
