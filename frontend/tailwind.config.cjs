/** @type {import('tailwindcss').Config} */
const tailwindcssRtl = require('tailwindcss-rtl');

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [tailwindcssRtl],
}