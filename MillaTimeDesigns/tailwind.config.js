/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,css}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Roboto', 'sans-serif'],
        display: ['Bebas Neue', 'cursive'],
        body: ['Inter', 'sans-serif'],
        retro: ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  plugins: [],
}

