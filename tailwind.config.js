/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      'sans':['Reboto', 'sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('assets/hamb.jpg')"
      }
    },
  },
  plugins: [],
}

