interface BrandMarkProps {
  /** Visual size of the square mark. */
  size?: 'sm' | 'md'
  /** Render for a dark surface. */
  onInk?: boolean
}

const sizes = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
}

/**
 * The Lataliye mark: an L whose foot flicks up into a check.
 *
 * The check does two jobs at once — it finishes the L of Lataliye, and it
 * nods at what the product promises (a confirmed booking, a verified
 * consultant). One continuous round-capped stroke, so it stays legible down
 * to favicon size.
 *
 * Colours come from the token system (`fill-*` / `stroke-*` utilities), never
 * hardcoded hex, so a palette change flows through here automatically. The
 * tile is `rounded` via the SVG rect itself rather than a CSS class, because
 * `overflow: hidden` rounding on an `<svg>` clips inconsistently across
 * browsers.
 *
 * One component rather than three copies so the mark cannot drift between the
 * navbar, the footer and the auth aside.
 */
export default function BrandMark({ size = 'sm', onInk = false }: BrandMarkProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" aria-hidden="true" className={`${sizes[size]} shrink-0`}>
        <rect
          width="64"
          height="64"
          rx="15"
          className={onInk ? 'fill-accent-on-ink' : 'fill-accent-500'}
        />
        <path
          d="M19 15 V45 H34 L46 29"
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={onInk ? 'stroke-ink-950' : 'stroke-white'}
        />
      </svg>
      <span
        className={`text-[15px] font-semibold tracking-tight ${
          onInk ? 'text-on-ink' : 'text-ink-950'
        }`}
      >
        Lataliye
      </span>
    </span>
  )
}
