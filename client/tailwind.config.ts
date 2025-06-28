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
          light: "#2880ED",
          dark: "#0B69A3",
          brand: "#F9503B",
        },
        secondary: {
          greenDark: "#014D40",
          greenLight: "#9BFD03",
          blueLight: "#D1F4FF",
          yellowLight: "#FCE588",
          redLight: "#AB091E",
          softOrange: "#FDE1CE",
          darkBrand: "#E85737",
          redDark: "#AB091E",
          brown: "#B16F05",
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
