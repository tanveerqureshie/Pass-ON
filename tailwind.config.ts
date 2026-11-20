import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Primary — Teal #0F766E */
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0F766E', // Primary Teal
          700: '#0D645D',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2C',
        },
        teal: {
          DEFAULT: '#0F766E',
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0F766E',
          700: '#0D645D',
          800: '#115E59',
          900: '#134E4A',
        },
        /* Accent — Emerald #10B981 */
        emerald: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        /* Base Background — Cream #FFF8F0 */
        cream: {
          DEFAULT: '#FFF8F0',
          50: '#FFFCF7',
          100: '#FFF8F0',
          200: '#F7EFE5',
          300: '#EDE0D0',
          400: '#DFCDB8',
        },
        /* Secondary — rich black / neutral greys */
        ink: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Manrope', 'Inter', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(17,17,20,0.05), 0 12px 32px -16px rgba(17,17,20,0.14)',
        lift: '0 2px 4px rgba(17,17,20,0.06), 0 24px 48px -20px rgba(17,17,20,0.25)',
        chip: '0 1px 2px rgba(17,17,20,0.06)',
        header: '0 1px 0 rgba(17,17,20,0.06), 0 8px 24px -18px rgba(17,17,20,0.20)',
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
