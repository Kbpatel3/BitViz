/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '128' : '41rem',
      },
      backgroundColor: {
        'illicit-yellow': '#FFA400FF',
        'licit-blue': '#3138B2FF',
        'unknown-grey': '#434343',
      },
    },
  },
  plugins: [],
}
