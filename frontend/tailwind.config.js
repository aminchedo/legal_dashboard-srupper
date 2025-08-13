/** @type {import('tailwindcss').Config} */
import tailwindcssRtl from 'tailwindcss-rtl';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [tailwindcssRtl],
}