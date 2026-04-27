/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f2ca50",
        "on-primary": "#3c2f00",

        surface: "#131313",
        "surface-dim": "#131313",

        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",

        "on-surface": "#e5e2e1",
        "on-surface-variant": "#d0c5af",

        "primary-container": "#d4af37",
        "on-primary-container": "#554300",

        tertiary: "#3de1fc",
        error: "#ffb4ab",

        outline: "#99907c",
        "outline-variant": "#4d4635",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
      },
    },
  },
  plugins: [],
};
