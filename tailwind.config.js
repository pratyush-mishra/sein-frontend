import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    // maxWidth: {
    //   'lg':'50rem'
    // },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#eff6ff",
              100: "#dbeafe", 
              200: "#bfdbfe",
              300: "#93c5fd",
              400: "#60a5fa",
              500: "#1e99a1", // Main primary color
              600: "#2563eb",
              700: "#1d4ed8",
              800: "#1e40af",
              900: "#1e3a8a",
              DEFAULT: "#1e99a1",
              foreground: "#ffffff",
            },
            secondary: {
              50: "#eff6ff",
              100: "#dbeafe", 
              200: "#bfdbfe",
              300: "#93c5fd",
              400: "#60a5fa",
              500: "#f13f21", // Main primary color
              600: "#2474b4",
              700: "#1d4ed8",
              800: "#1e40af",
              900: "#1e3a8a",
              DEFAULT: "#f13f21",
              foreground: "#ffffff",
            },
          },
        },
      },
    })],
}

module.exports = config;