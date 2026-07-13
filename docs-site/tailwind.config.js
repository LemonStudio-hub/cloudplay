/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        sidebar: {
          bg: '#0f1117',
          hover: '#1a1d27',
          active: '#222533',
          border: '#2a2d3a',
        },
        content: {
          bg: '#0a0b10',
          code: '#1a1d27',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#d1d5db',
            h1: { color: '#f9fafb' },
            h2: { color: '#f9fafb' },
            h3: { color: '#f9fafb' },
            h4: { color: '#f9fafb' },
            strong: { color: '#f9fafb' },
            a: { color: '#22c55e', '&:hover': { color: '#16a34a' } },
            code: { color: '#22c55e', backgroundColor: '#1a1d27', padding: '0.2em 0.4em', borderRadius: '0.25rem' },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: { backgroundColor: '#1a1d27', borderColor: '#2a2d3a' },
            blockquote: { borderLeftColor: '#22c55e', color: '#9ca3af' },
            hr: { borderColor: '#2a2d3a' },
            'thead th': { color: '#f9fafb', borderBottomColor: '#2a2d3a' },
            'tbody td': { borderBottomColor: '#2a2d3a' },
          },
        },
      },
    },
  },
  plugins: [],
}
