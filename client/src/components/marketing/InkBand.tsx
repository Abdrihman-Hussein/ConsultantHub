import type { ElementType, ReactNode } from 'react'
import Container from '../ui/Container'

interface InkBandProps {
  children: ReactNode
  /**
   * Which element to render as. Lets a band be a `<footer>` or `<aside>`
   * without losing its surface treatment.
   */
  as?: ElementType
  className?: string
  /** Remove the default vertical padding, for bands that hug their content. */
  flush?: boolean
  /** Hide the terracotta glow, for stacked bands where it would be noise. */
  noGlow?: boolean
}

/**
 * The dark surface the redesign uses for the hero, the closing call to action,
 * the dashboard header, the auth aside, and the footer.
 *
 * Two details matter and are easy to lose in a refactor:
 *
 * 1. The `on-ink` class is what re-tints focus rings — the app-wide ring is
 *    tuned for cream and is invisible here. See index.css.
 * 2. The background sits on this element and the content is constrained by an
 *    inner `Container`. The naive `w-screen` approach forces a horizontal
 *    scrollbar at narrow widths, because 100vw includes the scrollbar gutter.
 */
export default function InkBand({
  children,
  as: Tag = 'section',
  className = '',
  flush = false,
  noGlow = false,
}: InkBandProps) {
  return (
    <Tag className={`on-ink relative overflow-hidden bg-surface-ink text-on-ink ${flush ? '' : 'py-20 lg:py-28'} ${className}`}>
      {!noGlow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-accent-500/20 blur-3xl"
        />
      )}
      <div className="relative">
        <Container>{children}</Container>
      </div>
    </Tag>
  )
}