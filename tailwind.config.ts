import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--gssl-primary) / <alpha-value>)',
        'primary-fg': 'hsl(var(--gssl-primary-fg) / <alpha-value>)',
        accent: 'hsl(var(--gssl-accent) / <alpha-value>)',
        'accent-fg': 'hsl(var(--gssl-accent-fg) / <alpha-value>)',
        bg: 'hsl(var(--gssl-bg) / <alpha-value>)',
        surface: 'hsl(var(--gssl-surface) / <alpha-value>)',
        ink: 'hsl(var(--gssl-text) / <alpha-value>)',
        muted: 'hsl(var(--gssl-muted) / <alpha-value>)',
        border: 'hsl(var(--gssl-border) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      minHeight: {
        tap: '48px',
      },
      minWidth: {
        tap: '48px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(27,79,138,.07), 0 0 0 1px rgba(27,79,138,.07)',
        'card-hover': '0 6px 24px rgba(27,79,138,.13), 0 0 0 2px rgba(43,191,160,.45)',
        die: '0 8px 32px rgba(27,79,138,.18)',
        'die-rolling': '0 8px 40px rgba(43,191,160,.35), 0 0 0 3px rgba(43,191,160,.3)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '20%': { transform: 'rotate(-8deg) scale(1.05)' },
          '40%': { transform: 'rotate(7deg) scale(0.97)' },
          '60%': { transform: 'rotate(-5deg) scale(1.04)' },
          '80%': { transform: 'rotate(4deg) scale(0.98)' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        shake: 'shake 0.7s ease-in-out',
        pop: 'pop 0.25s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
