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
        joy: 'hsl(var(--gssl-joy) / <alpha-value>)',
        'joy-fg': 'hsl(var(--gssl-joy-fg) / <alpha-value>)',
        bg: 'hsl(var(--gssl-bg) / <alpha-value>)',
        surface: 'hsl(var(--gssl-surface) / <alpha-value>)',
        ink: 'hsl(var(--gssl-text) / <alpha-value>)',
        muted: 'hsl(var(--gssl-muted) / <alpha-value>)',
        border: 'hsl(var(--gssl-border) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Nunito"', '"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
      },
      minHeight: {
        tap: '48px',
      },
      minWidth: {
        tap: '48px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        die: 'var(--shadow-die)',
        'die-rolling': 'var(--shadow-die-rolling)',
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
        'flip-out': {
          '0%': { transform: 'perspective(600px) rotateY(0deg)' },
          '100%': { transform: 'perspective(600px) rotateY(90deg)' },
        },
        'flip-in': {
          '0%': { transform: 'perspective(600px) rotateY(-90deg)' },
          '100%': { transform: 'perspective(600px) rotateY(0deg)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        shake: 'shake 0.7s ease-in-out',
        pop: 'pop 0.25s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'flip-out': 'flip-out 180ms ease-in forwards',
        'flip-in': 'flip-in 180ms ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
