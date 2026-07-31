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
        'envelope-fall': {
          '0%': { transform: 'translateY(-110px) rotate(var(--fall-rot-a, -6deg))', opacity: '0' },
          '15%': { opacity: 'var(--fall-opacity, 0.4)' },
          '85%': { opacity: 'var(--fall-opacity, 0.4)' },
          '100%': { transform: 'translateY(110px) rotate(var(--fall-rot-b, 6deg))', opacity: '0' },
        },
      },
      animation: {
        heartbeat: 'heartbeat 2.4s ease-in-out infinite',
        'envelope-fall': 'envelope-fall linear infinite',
      },
    },
  },
  plugins: [],
};
