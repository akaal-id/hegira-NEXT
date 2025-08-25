/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './HegiraApp.tsx',
    './index.tsx',
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'hegra-deep-navy': '#18093b',
        'hegra-turquoise': '#4b998e',
        'hegra-yellow': '#ebaf4c',
        'hegra-chino': '#d0cea9'
      }
    },
  },
  plugins: [],
};
