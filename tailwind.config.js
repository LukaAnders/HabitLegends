/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#090B12',
        surface: '#111522',
        card: '#171D2C',
        'card-hover': '#242B3E',
        line: '#343C52',
        ivory: '#F5EEDF',
        parchment: '#F5EEDF',
        muted: '#A9B0C2',
        mist: '#A9B0C2',
        gold: '#F2B84B',
        xp: '#A855F7',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 28px rgba(245, 185, 66, 0.16)',
        purple: '0 0 28px rgba(168, 85, 247, 0.18)',
      },
    },
  },
  plugins: [],
}
