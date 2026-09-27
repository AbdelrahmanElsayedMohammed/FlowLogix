/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '360px',
      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        success: {
          50:  '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
        danger: {
          50:  '#fef2f2',
          200: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        warning: {
          50:  '#fffbeb',
          200: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        surface: {
          DEFAULT: '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          500: '#64748b',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.10)',
        modal:      '0 20px 60px -10px rgb(0 0 0 / 0.25)',
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left':  'slideInLeft  0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in':        'fadeIn        0.2s ease-out',
        'scale-in':       'scaleIn       0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-in':      'bounceIn      0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        slideInRight: {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        slideInLeft: {
          '0%':   { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',      opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        bounceIn: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          md: '2rem',
          lg: '2.5rem',
          xl: '3rem',
          '2xl': '4rem',
          '3xl': '5rem',
        },
        screens: {
          'xs': '100%',
          'sm': '480px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
          '3xl': '1920px',
        },
      },
      fontSize: {
        'fluid-xs':   'clamp(0.625rem, 0.55rem + 0.32vw, 0.75rem)',
        'fluid-sm':   'clamp(0.75rem, 0.65rem + 0.43vw, 0.875rem)',
        'fluid-base': 'clamp(0.8125rem, 0.72rem + 0.49vw, 0.9375rem)',
        'fluid-lg':   'clamp(0.9375rem, 0.81rem + 0.61vw, 1.0625rem)',
        'fluid-xl':   'clamp(1.0625rem, 0.87rem + 0.85vw, 1.25rem)',
        'fluid-2xl':  'clamp(1.25rem, 0.97rem + 1.22vw, 1.5rem)',
        'fluid-3xl':  'clamp(1.5rem, 1.1rem + 1.74vw, 1.875rem)',
        'fluid-4xl':  'clamp(1.75rem, 1.19rem + 2.44vw, 2.25rem)',
      },
      minHeight: {
        'screen-safe': '100dvh',
        'screen-dynamic': '100dvh',
      },
      height: {
        'screen-safe': '100dvh',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        'safe-x': 'env(safe-area-inset-right) env(safe-area-inset-left)',
        'safe-y': 'env(safe-area-inset-top) env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.content-auto': {
          'content-visibility': 'auto',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.tap-highlight-transparent': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.contain-layout': {
          'contain': 'layout paint',
        },
        '.overscroll-contain': {
          'overscroll-behavior': 'contain',
        },
        '.min-touch': {
          'min-height': '44px',
          'min-width': '44px',
        },
        '.min-touch-sm': {
          'min-height': '40px',
          'min-width': '40px',
        },
        '.text-clamp-1': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '1',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden',
        },
        '.text-clamp-2': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden',
        },
        '.text-clamp-3': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden',
        },
      });

      const fluidSpacing = {};
      const spacingScale = [
        { key: 'fluid-1', min: '0.25rem', max: '0.375rem' },
        { key: 'fluid-2', min: '0.375rem', max: '0.5rem' },
        { key: 'fluid-3', min: '0.5rem', max: '0.75rem' },
        { key: 'fluid-4', min: '0.75rem', max: '1rem' },
        { key: 'fluid-5', min: '1rem', max: '1.25rem' },
        { key: 'fluid-6', min: '1.25rem', max: '1.5rem' },
        { key: 'fluid-8', min: '1.5rem', max: '2rem' },
        { key: 'fluid-10', min: '2rem', max: '2.5rem' },
        { key: 'fluid-12', min: '2.5rem', max: '3rem' },
        { key: 'fluid-16', min: '3rem', max: '4rem' },
      ];
      spacingScale.forEach(({ key, min, max }) => {
        const minPx = parseFloat(min) * 16;
        fluidSpacing[`.p-${key}`] = { padding: `clamp(${min}, ${minPx - 4}px + 1vw, ${max})` };
        fluidSpacing[`.px-${key}`] = { 'padding-left': `clamp(${min}, ${minPx - 4}px + 1vw, ${max})`, 'padding-right': `clamp(${min}, ${minPx - 4}px + 1vw, ${max})` };
        fluidSpacing[`.py-${key}`] = { 'padding-top': `clamp(${min}, ${minPx - 4}px + 1vw, ${max})`, 'padding-bottom': `clamp(${min}, ${minPx - 4}px + 1vw, ${max})` };
        fluidSpacing[`.m-${key}`] = { margin: `clamp(${min}, ${minPx - 4}px + 1vw, ${max})` };
        fluidSpacing[`.mx-${key}`] = { 'margin-left': `clamp(${min}, ${minPx - 4}px + 1vw, ${max})`, 'margin-right': `clamp(${min}, ${minPx - 4}px + 1vw, ${max})` };
        fluidSpacing[`.my-${key}`] = { 'margin-top': `clamp(${min}, ${minPx - 4}px + 1vw, ${max})`, 'margin-bottom': `clamp(${min}, ${minPx - 4}px + 1vw, ${max})` };
        fluidSpacing[`.gap-${key}`] = { gap: `clamp(${min}, ${minPx - 4}px + 1vw, ${max})` };
      });
      addUtilities(fluidSpacing);
    },
  ],
};
