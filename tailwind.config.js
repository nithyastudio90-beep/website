/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          black: '#07080a',
          dark: '#0d0e12',
          card: '#14161d',
          surface: '#1c1f2b',
          border: '#272b3c',
          muted: '#8e93a6',
          light: '#f3f4f6',
        },
        gold: {
          100: '#fdf6e2',
          200: '#faeabf',
          300: '#f4dc8f',
          400: '#e8c558',
          500: '#d4af37', // Official primary gold
          600: '#b89228',
          700: '#946f1e',
          800: '#75541c',
          900: '#5c411a',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f5d77f 0%, #d4af37 50%, #aa821c 100%)',
        'dark-gradient': 'linear-gradient(180deg, #07080a 0%, #10121a 100%)',
        'radial-gold': 'radial-gradient(circle at center, rgba(212, 175, 55, 0.12) 0%, rgba(7, 8, 10, 0) 70%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.3)',
        'gold-glow-sm': '0 0 15px -3px rgba(212, 175, 55, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
