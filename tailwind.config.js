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
          DEFAULT: '#1e40af',
          dark: '#1e3a8a'
        },
        basketball: {
          orange: '#f97316',
          court: '#22c55e'
        }
      }
    },
  },
  plugins: [],
}