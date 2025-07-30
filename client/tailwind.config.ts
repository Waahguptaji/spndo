import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
          light: "#D7FF4F", // optional for lighter hover
          dark: "#A6DB00", // hover or shade
          brand: "#C2FF00", // exact button green
        },
        
        secondary: {
          greenDark: "#014D40",
          greenLight: "#9BFD03",
          blueLight: "#394646",
          yellowLight: "#FCE588",
          redLight: "#FF3B3B", // exact from screenshot
          softOrange: "#FDE1CE",
          darkBrand: "#1F2828",
          redDark: "#AB091E",
          brown: "#B16F05",
        },
        neutral: {
          dark1: "#0F1111", // screen background
          dark2: "#1A1C1C", // card/input bg
          grey1: "#2B2F2F", // divider lines
          grey2: "#4B5563", // placeholder
          grey3: "#9CA3AF", // muted label
          softGrey1: "#D1D5DB", // used for borders (optional)
          softGrey2: "#EBEDFO", // unused
          softGrey3: "#FAFAFB", // unused
          white: "#FFFFFF", // text
        },
        system: {
          red: "#FF3B3B", // used for required * markers
          yellow: "#FFC53D",
          green: "#C1FF00", // consistent with primary.brand
          blue: "#00B2FF", // input border focus
        },
        gradient: {
          g01: "linear-gradient(90deg, #0B0E0E 0%, #1E1E1E 100%)", // background fade
          g02: "linear-gradient(90deg, #C1FF00 0%, #A6DB00 100%)", // button
          g03: "linear-gradient(90deg, #FFFFFF 0%, #C1FF00 100%)", // accent
          g04: "linear-gradient(90deg, #2B2F2F 0%, #0B0E0E 100%)", // section divider
          g05: "linear-gradient(90deg, #1E1E1E 0%, #0B0E0E 100%)", // input fields
          g06: "linear-gradient(90deg, #C1FF00 0%, #00B2FF 100%)", // glowing accent
          g07: "linear-gradient(90deg, #C1FF00 0%, #FFFFFF 100%)", // alt link glow
          g08: "linear-gradient(90deg, #0B0E0E 0%, #0B0E0E 100%)",
          g09: "linear-gradient(90deg, #FF3B3B 0%, #FF3B3B 100%)",
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