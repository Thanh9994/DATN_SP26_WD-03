/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../../shared/**/*.{js,ts,jsx,tsx}",  
  ],
  theme: {
    extend: {
      colors: {
      primary: {
        DEFAULT: "#ea2a33",
        hover: "#ff3d46", // Màu đỏ sáng hơn khi hover
        dark: "#b91c1c",  // Màu đỏ tối hơn
      },
      "background-dark": "#120a0a",
      "surface-dark": "#1a1212", // Màu cho các thẻ Card, Table Header
    },
      },
      fontFamily: {
        display: ["'Be Vietnam Pro'", "sans-serif"],
      },
    },
    plugins: []
  };

