import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type RevealTag = 'div' | 'section' | 'li' | 'article' | 'header' | 'footer' | 'span'

interface RevealProps<T extends RevealTag> {
  children: ReactNode
  /** Stagger in ms. Use small increments so a group cascades. */
  delay?: number
  className?: string
  /** Distance to travel, px. */
  distance?: number
  as?: T
}

/**
 * Fades and lifts its children into view once, when they first intersect the
 * viewport. Purely decorative — the content renders and is readable whether or
 * not this ever runs, and `prefers-reduced-motion` disables the movement.
 */
export default function Reveal<T extends RevealTag = 'div'>({
  children,
  delay = 0,
  className = '',
  distance = 16,
  as,
}: RevealProps<T>) {
  // The tag is chosen at runtime, so TS cannot narrow the resulting element and
  // ref types. `any` is the honest annotation here.
  const Tag = (as ?? 'div') as any
  const ref = useRef<any>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // No observer support: show it now rather than leaving it at opacity 0.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : `translateY(${distance}px)`,
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-[opacity,transform] duration-700 ease-out ${className}`}
    >
      {children}
    </Tag>
  )
}
