/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm neutral scale — stone-based rather than the cream/paper tint this
        // replaced. One warm-gray family throughout, so nothing mixes warm and
        // cool grays. The `ink-*` naming is kept from the prior system so the
        // component tree does not have to be renamed to stay legible.
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
        // Terracotta — the single accent for actions and trust signals. Deepened
        // from the prior clay so white-on-accent clears AA (5.7:1) and accent-as-
        // text clears AA on the light ground (5.9:1). Saturation sits near 69%,
        // under the 80% ceiling, so it reads considered rather than loud. This is
        // the one accent the whole page is locked to.
        accent: {
          50: '#FAF3EF',
          100: '#F3E2D9',
          200: '#E7C6B4',
          300: '#D6A184',
          400: '#C47C54',
          500: '#A9501F',
          600: '#8C4118',
          700: '#74340F',
          800: '#5B290C',
          900: '#421E08',
        },
        // Flat semantic aliases so components read cleanly.
        surface: '#FFFFFF',
        'surface-subtle': '#FAFAF9',
        'surface-muted': '#F5F5F4',
        line: '#E7E5E4',
        'line-strong': '#D6D3D1',
        body: '#1C1917',
        muted: '#57534E',
        subtle: '#78716C',
        danger: '#B4231C',
        'danger-soft': '#FDECEA',
        // Matches the Badge 'accent' fill — used to knock shapes out of a seal.
        'on-accent-soft': '#FAF3EF',
        // Ink surface family. Deep terracotta is unreadable on the dark bands, so
        // they get their own lifted accent (`accent-on-ink`) rather than reusing
        // `accent-500`. Every pairing is pinned by the contrast checks in
        // check-logic.ts.
        'surface-ink': '#1C1917',
        'surface-ink-soft': '#292524',
        'on-ink': '#F5F5F4',
        'on-ink-muted': '#A8A29E',
        'accent-on-ink': '#E9965E',
        'ink-line': 'rgba(245, 245, 244, 0.14)',
      },
      fontFamily: {
        // Cabinet Grotesk (display) is a proportionally-spaced grotesk with real
        // presence at large sizes; Satoshi (UI/body) is a clean, warm neo-grotesk.
        // A sans-led pairing rather than the Fraunces/Inter default this replaced.
        display: ['"Cabinet Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        'display-xl': ['clamp(2.75rem, 7vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2rem, 4.5vw, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.18', letterSpacing: '-0.01em' }],
        eyebrow: ['11px', { lineHeight: '16px', letterSpacing: '0.14em' }],
      },
      borderRadius: {
        // NOTE: intentionally not overriding `full` so `rounded-full` resolves
        // to 9999px. Soft, generous radii are the signature of this direction.
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
        // Tinted to the new ink hue (28,25,23) rather than pure black, so shadows
        // read as depth on the warm ground instead of a grey smudge.
        card: '0 2px 4px rgba(28, 25, 23, 0.03), 0 18px 36px -20px rgba(28, 25, 23, 0.16)',
        lift: '0 4px 8px rgba(28, 25, 23, 0.04), 0 28px 56px -24px rgba(28, 25, 23, 0.26)',
        glow: '0 10px 30px -12px rgba(169, 80, 31, 0.45)',
        ring: '0 0 0 1px rgba(28, 25, 23, 0.07)',
      },
      maxWidth: {
        shell: '1200px',
      },
      // Tailwind's default transition scale jumps 300 → 500. The nav sheet and
      // specialty cards want a 400ms step, so it is added here rather than left
      // to fall back to no transition at all.
      transitionDuration: {
        400: '400ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        blob: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
            borderRadius: '58% 42% 46% 54% / 46% 52% 48% 54%',
          },
          '33%': {
            transform: 'translate(14px, -18px) scale(1.06)',
            borderRadius: '46% 54% 38% 62% / 58% 42% 58% 42%',
          },
          '66%': {
            transform: 'translate(-12px, 12px) scale(.96)',
            borderRadius: '52% 48% 60% 40% / 42% 60% 40% 58%',
          },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(.9)', opacity: '.7' },
          '70%': { transform: 'scale(1.9)', opacity: '0' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        float: 'float 6s ease-in-out infinite',
        blob: 'blob 18s ease-in-out infinite',
        shimmer: 'shimmer 2.2s infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite',
      },
    },
  },
  plugins: [],
}
