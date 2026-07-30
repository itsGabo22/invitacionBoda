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
      keyframes: {
        heartbeat: {
          '0%, 40%, 100%': { transform: 'scale(1)' },
          '10%': { transform: 'scale(1.14)' },
          '20%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.08)' },
        },
      },
      animation: {
        heartbeat: 'heartbeat 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
