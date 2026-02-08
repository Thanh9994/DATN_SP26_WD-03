/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ea2a33",
        "background-light": "#f8f6f6",
        "background-dark": "#120a0a",
      },
      fontFamily: {
        display: ["'Be Vietnam Pro'", "sans-serif"],
      },
    },
  },
  plugins: [],
}

