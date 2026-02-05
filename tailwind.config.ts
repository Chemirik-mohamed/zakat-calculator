import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1F2A',
        gold: '#C9A44C',
        sand: '#F6F1E8',
        slate: '#475569',
      },
      fontFamily: {
        serif: ['"IBM Plex Serif"', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px rgba(11, 31, 42, 0.08)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
} satisfies Config
