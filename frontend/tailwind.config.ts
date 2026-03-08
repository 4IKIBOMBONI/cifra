import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C5CE7',
          light: '#A29BFE',
          dark: '#5141C9',
        },
        secondary: {
          DEFAULT: '#00D2D3',
          light: '#55E6C1',
        },
        accent: '#FECA57',
        success: '#00B894',
        warning: '#FDCB6E',
        error: '#FF6B6B',
        bg: {
          DEFAULT: '#0F0F1A',
          surface: '#1A1A2E',
          elevated: '#252540',
        },
        border: '#2D2D4A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0B8',
        'text-muted': '#6B6B80',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        accent: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(108, 92, 231, 0.3)',
        'glow-secondary': '0 0 20px rgba(0, 210, 211, 0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config;
