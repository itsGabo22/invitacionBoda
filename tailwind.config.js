/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bone: '#F7F5F0',
        ink: '#161513',
        stone: '#8C8478',
        sage: '#818C78',
        champagne: '#C9AD7F',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'serif'],
        accent: ['"Playfair Display"', 'serif'],
        utility: ['"Jost"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
