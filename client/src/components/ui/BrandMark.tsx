interface BrandMarkProps {
  /** Visual size of the square mark. */
  size?: 'sm' | 'md'
  /** Render for a dark surface. */
  onInk?: boolean
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
}

/**
 * The Lataliye wordmark: a terracotta rounded square carrying the L initial,
 * paired with the name in tight semibold type.
 *
 * One component rather than three copies so the mark cannot drift between the
 * navbar, the footer and the auth aside. The letter is L for Lataliye — the
 * previous C initial stood for nothing in the product name.
 */
export default function BrandMark({ size = 'sm', onInk = false }: BrandMarkProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`grid place-items-center rounded-lg font-display font-bold text-white ${
          sizes[size]
        } ${onInk ? 'bg-accent-on-ink text-ink-950' : 'bg-accent-500'}`}
      >
        L
      </span>
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
