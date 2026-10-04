import { useEffect, useRef, useState } from 'react'
import { useScrollProgress } from './useScrollProgress'

/**
 * A hairline terracotta bar that tracks reading progress through the page.
 * Fixed to the very top, above the sticky navbar.
 */
export default function ScrollProgress() {
  const [target, setTarget] = useState(0)
  const progress = useScrollProgress({ target })
  const raf = useRef(0)

  // Measure on mount and whenever the content height changes.
  useEffect(() => {
    const measure = () => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        setTarget(Math.max(document.body.scrollHeight - window.innerHeight, 0))
      })
    }

    measure()
    window.addEventListener('resize', measure)

    // Watch for async content (images, filters) changing the page height.
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure)
      observer.observe(document.body)
      return () => {
        observer.disconnect()
        window.removeEventListener('resize', measure)
        cancelAnimationFrame(raf.current)
      }
    }

    return () => {
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  if (target <= 0) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent-500"
      style={{ transform: `scaleX(${progress})` }}
    />
  )
}
