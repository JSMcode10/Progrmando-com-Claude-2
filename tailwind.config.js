/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        jsm: {
          bg: '#0B0E11',
          card: '#151A1F',
          teal: '#00D9C0',
          tealDeep: '#0891B2',
          gold: '#F2C14E',
          label: '#9CA8B3',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
