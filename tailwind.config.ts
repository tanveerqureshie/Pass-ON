import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Stitch Design System Tokens */
        mint: {
          DEFAULT: '#26C289',
          dark: '#005236',
          light: '#e8faf3',
        },
        lavender: {
          DEFAULT: '#E2DFFF',
          dark: '#4a4294',
          light: '#f4f2ff',
        },
        'surface-bg': '#F8FAFC',
        'surface-card': '#FFFFFF',
        'surface-muted': '#F1F5F9',
        'outline-soft': '#E2E8F0',
        'text-main': '#0F172A',
        'text-muted': '#64748B',

        /* Compatibility tokens for secondary routes */
        brand: {
          50: '#e8faf3',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#26C289',
          600: '#26C289',
          700: '#006c49',
          800: '#005236',
          900: '#004930',
          950: '#002113',
        },
        blue: {
          DEFAULT: '#26C289',
          50: '#e8faf3',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#26C289',
          600: '#26C289',
          700: '#006c49',
          800: '#005236',
          900: '#004930',
          950: '#002113',
        },
        emerald: {
          DEFAULT: '#26C289',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#26C289',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        ink: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Space Grotesk', 'Manrope', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 10px 24px -4px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 12px 28px -4px rgba(38, 194, 137, 0.14), 0 18px 36px -6px rgba(15, 23, 42, 0.08)',
        lift: '0 8px 24px -4px rgba(123, 113, 245, 0.12), 0 16px 36px -8px rgba(30, 36, 48, 0.12)',
        chip: '0 2px 4px rgba(15, 23, 42, 0.06)',
        header: '0 2px 12px rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(.96) translateY(6px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        kenburns: 'kenburns 7s ease-out forwards',
        'fade-in': 'fadeIn .3s ease-out both',
        'fade-up': 'fadeUp .4s ease-out both',
        'slide-in-right': 'slideInRight .3s cubic-bezier(.32,.72,0,1) both',
        'pop-in': 'popIn .18s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
