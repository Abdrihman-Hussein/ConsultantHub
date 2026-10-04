import { useEffect, useRef, useState } from 'react'

interface ScrollProgressOptions {
  /** Total scrollable height at which progress reaches 1. */
  target: number
}

/**
 * Returns a 0 → 1 progress value representing how far the user has scrolled
 * through `target` pixels. Drives the thin terracotta bar under the navbar.
 */
export function useScrollProgress({ target }: ScrollProgressOptions) {
  const [progress, setProgress] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    if (target <= 0) {
      setProgress(0)
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Snap rather than animate.
      const update = () => setProgress(Math.min(window.scrollY / target, 1))
      update()
      window.addEventListener('scroll', update, { passive: true })
      return () => window.removeEventListener('scroll', update)
    }

    const handle = () => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        setProgress(Math.min(window.scrollY / target, 1))
      })
    }

    handle()
    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle)

    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [target])

  return progress
}
