/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/components/*.{jsx, js}",
    "./src/components/*/*.{jsx, js}",
    "./src/components/editor/*.{jsx, js}",
    "./src/components/admin/*.{jsx, js}",
    "./src/components/setting/*.{jsx, js}",
    "./src/components/policy/*.{jsx, js}",
    "./src/components/admin/farm/*.{jsx, js}",
    "./src/components/authMiddleware/*.{jsx, js}",
    "./src/components/notification/*.{jsx,js}",
    "./src/components/analysis/*.{jsx, js}",
    "./src/components/static_data/*.{jsx, js}",

    "./src/components/admin/exporter/*.{jsx, js}",
    "./src/components/admin/purchase/*.{jsx, js}",
    "./src/components/admin/farm/*.{jsx, js}",
    "./src/components/admin/sales/*.{jsx, js}",
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
