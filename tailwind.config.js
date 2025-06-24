/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/components/*.{jsx, js}",
    "./src/components/*/*.{jsx, js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        comic: ['"Comic Neue"', 'cursive'],
        fancy: ['"Dancing Script"', 'cursive'],
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        heading: ['"Poppins"', 'sans-serif']
      }

    },
  },
  plugins: [],
}
