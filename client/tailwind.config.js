/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm neutral scale — the base of the "quiet premium" look.
        ink: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
        // Single restrained accent for actions + trust signals.
        accent: {
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
        gold: {
          300: '#E8C88A',
          400: '#D9A441',
          500: '#C08A2E',
          600: '#A16207',
        },
        // Flat semantic aliases so components read cleanly.
        surface: '#FFFFFF',
        'surface-subtle': '#FAFAF9',
        'surface-muted': '#F5F5F4',
        line: '#E7E5E4',
        'line-strong': '#D6D3D1',
        body: '#1C1917',
        muted: '#78716C',
        subtle: '#A8A29E',
        danger: '#B91C1C',
      },
      fontFamily: {
        // Editorial serif for display, neutral sans for everything else.
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 7vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2rem, 4.5vw, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.18', letterSpacing: '-0.01em' }],
        eyebrow: ['11px', { lineHeight: '16px', letterSpacing: '0.14em' }],
      },
      borderRadius: {
        // NOTE: intentionally not overriding DEFAULT/lg/xl/full so that
        // `rounded-full` resolves to 9999px (the previous config mapped it to
        // 0.75rem, which silently broke every pill/avatar in the app).
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(12, 10, 9, 0.04), 0 8px 24px -12px rgba(12, 10, 9, 0.10)',
        lift: '0 2px 4px rgba(12, 10, 9, 0.04), 0 18px 40px -16px rgba(12, 10, 9, 0.18)',
        ring: '0 0 0 1px rgba(12, 10, 9, 0.06)',
      },
      maxWidth: {
        shell: '1200px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) both',
      },
    },
  },
  plugins: [],
}
