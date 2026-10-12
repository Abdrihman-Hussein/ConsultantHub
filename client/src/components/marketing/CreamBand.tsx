import type { ElementType, ReactNode } from 'react'
import Container from '../ui/Container'

type Surface = 'subtle' | 'muted'

interface CreamBandProps {
  children: ReactNode
  /**
   * Which element to render as. Lets a band be a `<footer>` or `<aside>`
   * without losing its surface treatment.
   */
  as?: ElementType
  className?: string
  /** Remove the default vertical padding, for bands that hug their content. */
  flush?: boolean
  /**
   * Which ground the band sits on. `subtle` is the page ground, `muted` steps
   * down one tier. Passed as a prop rather than through `className` so a
   * background is never declared twice on the same element — two competing
   * `bg-*` utilities resolve by stylesheet order, not by the order written.
   */
  surface?: Surface
}

const surfaces: Record<Surface, string> = {
  subtle: 'bg-surface-subtle',
  muted: 'bg-surface-muted',
}

/**
 * The light counterpart to `InkBand`: a full-bleed band with the inner
 * content held to the same `Container`.
 *
 * Extracted rather than added as a `tone` prop on `InkBand` because that
 * component's contract is inseparable from its dark surface — the `on-ink`
 * class re-tints focus rings, which is invisible the moment the background is
 * light. Two components keep each one honest about the surface it renders on,
 * and leave `InkBand` untouched for the footer and the dashboard header.
 *
 * The band is deliberately flat: no accent blur wash. Sections separate
 * through hairline borders and ground-tier steps, not ambient glows.
 *
 * The background sits on this element and the content is constrained by an
 * inner `Container`. The naive `w-screen` approach forces a horizontal
 * scrollbar at narrow widths, because 100vw includes the scrollbar gutter.
 */
export default function CreamBand({
  children,
  as: Tag = 'section',
  className = '',
  flush = false,
  surface = 'subtle',
}: CreamBandProps) {
  return (
    <Tag className={`relative ${surfaces[surface]} ${flush ? '' : 'py-20 lg:py-28'} ${className}`}>
      <Container>{children}</Container>
    </Tag>
  )
}
