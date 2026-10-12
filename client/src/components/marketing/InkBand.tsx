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
}

/**
 * The dark surface the site uses for the dashboard header, the auth aside,
 * and the footer.
 *
 * Two details matter and are easy to lose in a refactor:
 *
 * 1. The `on-ink` class is what re-tints focus rings — the app-wide ring is
 *    tuned for the light ground and is invisible here. See index.css.
 * 2. The background sits on this element and the content is constrained by an
 *    inner `Container`. The naive `w-screen` approach forces a horizontal
 *    scrollbar at narrow widths, because 100vw includes the scrollbar gutter.
 *
 * There is deliberately no decorative glow wash: the band reads through its
 * flat off-black surface and hairline borders, not an accent blur-blob.
 */
export default function InkBand({
  children,
  as: Tag = 'section',
  className = '',
  flush = false,
}: InkBandProps) {
  return (
    <Tag className={`on-ink relative bg-surface-ink text-on-ink ${flush ? '' : 'py-20 lg:py-28'} ${className}`}>
      <Container>{children}</Container>
    </Tag>
  )
}