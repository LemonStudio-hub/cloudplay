/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#050506',
        panel: '#0e0e11',
        raised: '#16161a',
        line: '#23232a',
        mute: '#71717a',
        ink: '#fafafa',
        accent: {
          DEFAULT: '#d4d4d8',
          dim: '#a1a1aa',
          soft: 'rgba(212, 212, 216, 0.08)',
        },
        signal: {
          ok: '#34d399',
          warn: '#fbbf24',
          bad: '#f87171',
          info: '#38bdf8',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      maxWidth: {
        site: '72rem',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  future: { hoverOnlyWhenSupported: true },
  plugins: [],
};
