import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black:  '#040404',
        gold:   '#C4922A',
        'gold-light': '#E8B84A',
        orange: '#FF6A00',
        'orange-light': '#FF8533',
        cream:  '#F0E8D8',
        muted:  '#A1A1AA',
        dim:    '#6B7280',
        surface:  '#0A0A0A',
        surface2: '#111111',
        surface3: '#1A1A1A',
        border:   'rgba(196,146,42,0.18)',
        'border-h': 'rgba(196,146,42,0.45)',
      },
      fontFamily: {
        sans:  ['var(--font-dm-sans)', 'sans-serif'],
        mono:  ['var(--font-dm-mono)', 'monospace'],
        display: ['var(--font-bebas)', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':  'spin 8s linear infinite',
        'glow':       'glow 2s ease-in-out infinite',
        'scroll-log': 'scrollLog 0.3s ease-out',
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.7', transform: 'scale(1.03)' },
        },
        scrollLog: {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        gold:   '0 0 40px rgba(196,146,42,0.15)',
        'gold-lg': '0 0 80px rgba(196,146,42,0.25)',
        orange: '0 0 40px rgba(255,106,0,0.2)',
      },
    },
  },
  plugins: [],
}

export default config
