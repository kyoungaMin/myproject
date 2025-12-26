import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // TradingView-inspired color system
        tv: {
          // Background colors
          'bg-primary': 'var(--tv-bg-primary)',
          'bg-secondary': 'var(--tv-bg-secondary)',
          'bg-tertiary': 'var(--tv-bg-tertiary)',
          'bg-elevated': 'var(--tv-bg-elevated)',

          // Text colors
          'text-primary': 'var(--tv-text-primary)',
          'text-secondary': 'var(--tv-text-secondary)',
          'text-tertiary': 'var(--tv-text-tertiary)',
          'text-muted': 'var(--tv-text-muted)',

          // Border colors
          'border': 'var(--tv-border-primary)',
          'border-secondary': 'var(--tv-border-secondary)',
          'border-hover': 'var(--tv-border-hover)',

          // Accent colors
          'accent': 'var(--tv-accent-primary)',
          'accent-hover': 'var(--tv-accent-hover)',

          // Semantic colors
          'positive': 'var(--tv-positive)',
          'positive-bg': 'var(--tv-positive-bg)',
          'negative': 'var(--tv-negative)',
          'negative-bg': 'var(--tv-negative-bg)',
          'neutral': 'var(--tv-neutral)',

          // Status colors
          'warning': 'var(--tv-warning)',
          'warning-bg': 'var(--tv-warning-bg)',
          'info': 'var(--tv-info)',
          'info-bg': 'var(--tv-info-bg)',

          // Interactive states
          'hover': 'var(--tv-hover-overlay)',
          'active': 'var(--tv-active-overlay)',
        },
        // Legacy support - maps to new system
        stock: {
          up: 'var(--tv-positive)',
          down: 'var(--tv-negative)',
          neutral: 'var(--tv-neutral)',
        },
        dark: {
          bg: 'var(--tv-bg-primary)',
          card: 'var(--tv-bg-elevated)',
          border: 'var(--tv-border-primary)',
        },
        light: {
          bg: 'var(--tv-bg-primary)',
          card: 'var(--tv-bg-elevated)',
          border: 'var(--tv-border-primary)',
        },
      },
      fontFamily: {
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Trebuchet MS', 'Roboto', 'Ubuntu', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'tv-sm': 'var(--tv-radius-sm)',
        'tv-md': 'var(--tv-radius-md)',
        'tv-lg': 'var(--tv-radius-lg)',
        'tv-xl': 'var(--tv-radius-xl)',
      },
      boxShadow: {
        'tv-sm': 'var(--tv-shadow-sm)',
        'tv-md': 'var(--tv-shadow-md)',
        'tv-lg': 'var(--tv-shadow-lg)',
        'tv-xl': 'var(--tv-shadow-xl)',
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-live': 'pulse-live 2s ease-in-out infinite',
        'shimmer': 'skeleton-shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-live': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'skeleton-shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      transitionDuration: {
        '150': '150ms',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      gridTemplateColumns: {
        'auto-fill-280': 'repeat(auto-fill, minmax(280px, 1fr))',
        'auto-fill-320': 'repeat(auto-fill, minmax(320px, 1fr))',
      },
    },
  },
  plugins: [],
};

export default config;
