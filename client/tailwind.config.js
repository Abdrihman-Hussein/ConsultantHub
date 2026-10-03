/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm neutral scale — cream-tinted rather than grey, to sit with the
        // terracotta accent.
        ink: {
          50: '#FDF8F3',
          100: '#F9F1E8',
          200: '#F5EBE0',
          300: '#EADFD2',
          400: '#D6C4B2',
          500: '#B79E88',
          600: '#9C8069',
          700: '#7A6A5B',
          800: '#5A4A3E',
          900: '#3D3229',
          950: '#2A2118',
        },
        // Terracotta — the single accent for actions and trust signals.
        accent: {
          50: '#FDF4EF',
          100: '#FAE6DA',
          200: '#F2C9B2',
          300: '#E7A483',
          400: '#DB8259',
          500: '#C2622D',
          600: '#A9521F',
          700: '#8A4219',
          800: '#6B3414',
          900: '#4C2510',
        },
        gold: {
          300: '#E8C88A',
          400: '#D9A441',
          500: '#C08A2E',
          600: '#A16207',
        },
        // Flat semantic aliases so components read cleanly.
        surface: '#FFFFFF',
        'surface-subtle': '#FDF8F3',
        'surface-muted': '#F9F1E8',
        line: '#EADFD2',
        'line-strong': '#D6C4B2',
        body: '#2A2118',
        muted: '#7A6A5B',
        subtle: '#9C8069',
        danger: '#B4231C',
        'danger-soft': '#FCEBE9',
        // Matches the Badge 'accent' fill — used to knock shapes out of a seal.
        'on-accent-soft': '#FDF4EF',
      },
      fontFamily: {
        // Soft, slightly wonky serif for display; neutral sans for UI.
        display: ['Fraunces', 'Georgia', 'serif'],
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
        // `rounded-full` resolves to 9999px. Soft, generous radii are the
        // signature of this direction.
        sm: '0.5rem',
        DEFAULT: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        card: '0 2px 4px rgba(42, 33, 24, 0.03), 0 18px 36px -20px rgba(42, 33, 24, 0.18)',
        lift: '0 4px 8px rgba(42, 33, 24, 0.04), 0 28px 56px -24px rgba(42, 33, 24, 0.28)',
        ring: '0 0 0 1px rgba(42, 33, 24, 0.07)',
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
