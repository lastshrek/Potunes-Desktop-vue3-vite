/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'album-hover': '#252525',
        'album-card': '#111111',
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}

