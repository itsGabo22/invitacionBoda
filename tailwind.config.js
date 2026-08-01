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
        goudy: ['"Goudy Bookletter 1911"', 'serif'],
      },
      keyframes: {
        // Lub-dub: dos golpes (uno fuerte, uno más suave) y una pausa larga, no un
        // pulso uniforme. El box-shadow lleva un halo champán capa por encima de la
        // sombra base del botón (para no perder su elevación mientras se anima) que
        // se expande y se desvanece hacia afuera en cada golpe, como una onda suave.
        heartbeat: {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1), 0 0 0 0 rgba(201, 173, 127, 0)',
          },
          '8%': {
            transform: 'scale(1.3)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1), 0 0 8px 4px rgba(201, 173, 127, 0.55)',
          },
          '16%': {
            transform: 'scale(1)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1), 0 0 32px 18px rgba(201, 173, 127, 0)',
          },
          '24%': {
            transform: 'scale(1)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1), 0 0 0 0 rgba(201, 173, 127, 0)',
          },
          '32%': {
            transform: 'scale(1.16)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1), 0 0 6px 3px rgba(201, 173, 127, 0.42)',
          },
          '40%': {
            transform: 'scale(1)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1), 0 0 24px 13px rgba(201, 173, 127, 0)',
          },
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
