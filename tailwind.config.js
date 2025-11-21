/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      fontFamily:{
        'sans' : ['Roboto', 'sans-serif']
      }
      
    },
    extend: {
      backgroundImage:{
        "home": "url('/imagem/bg.png')"
      }
    },
  },
  plugins: [],
}

