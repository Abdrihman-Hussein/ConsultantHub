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
  /** Hide the terracotta glow, for stacked bands where it would be noise. */
  noGlow?: boolean
  /**
   * Which cream the band sits on. `subtle` is the page ground, `muted` steps
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
 * The light counterpart to `InkBand`: a full-bleed cream band with the inner
 * content held to the same `Container`.
 *
 * Extracted rather than added as a `tone` prop on `InkBand` because that
 * component's contract is inseparable from its dark surface — the `on-ink`
 * class re-tints focus rings, which is invisible the moment the background is
 * cream. Two components keep each one honest about the surface it renders on,
 * and leave `InkBand` untouched for the footer and the dashboard header.
 *
 * The glow is the same terracotta radial as the ink bands but at a tenth
 * opacity. On ink the accent sits on a dark ground and reads as light; the same
 * value over cream is a smudge, so it is reduced until it reads as ambient
 * warmth rather than dirt.
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
  noGlow = false,
  surface = 'subtle',
}: CreamBandProps) {
  return (
    <Tag className={`relative overflow-hidden ${surfaces[surface]} ${flush ? '' : 'py-20 lg:py-28'} ${className}`}>
      {!noGlow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-accent-500/10 blur-3xl"
        />
      )}
      <div className="relative">
        <Container>{children}</Container>
      </div>
    </Tag>
  )
}
