/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669', // emerald-600
          hover: '#047857', // emerald-700
          light: '#a7f3d0', // emerald-200
          text: '#065f46', // emerald-800
        },
        secondary: {
          DEFAULT: '#f59e0b', // amber-500
          hover: '#d97706', // amber-600
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}