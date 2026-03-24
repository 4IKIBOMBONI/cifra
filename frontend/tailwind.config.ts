import type { Config } from 'tailwindcss';

/** Helper: reference a CSS custom property as an RGB color with alpha support */
const rgb = (varName: string) => `rgb(var(--color-${varName}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: rgb('primary'),
          light: rgb('primary-light'),
          dark: rgb('primary-dark'),
          50: rgb('primary-50'),
          100: rgb('primary-100'),
          500: rgb('primary-500'),
          600: rgb('primary-600'),
          700: rgb('primary-700'),
          900: rgb('primary-900'),
        },
        secondary: {
          DEFAULT: rgb('secondary'),
          light: rgb('secondary-light'),
          dark: rgb('secondary-dark'),
        },
        accent: rgb('accent'),
        success: rgb('success'),
        warning: rgb('warning'),
        error: rgb('error'),
        info: rgb('info'),
        bg: {
          DEFAULT: rgb('bg'),
          surface: rgb('surface'),
          elevated: rgb('elevated'),
          hover: rgb('hover'),
        },
        border: {
          DEFAULT: rgb('border'),
          light: rgb('border-light'),
        },
        'text-primary': rgb('text'),
        'text-secondary': rgb('text-secondary'),
        'text-muted': rgb('text-muted'),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
        'glow-sm': 'var(--shadow-glow-sm)',
        'glow-secondary': 'var(--shadow-glow-secondary)',
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        soft: 'var(--shadow-soft)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-dark': 'var(--gradient-dark)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-hero': 'var(--gradient-hero)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
