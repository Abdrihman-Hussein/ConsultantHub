import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll position on navigation and honours #hash anchors. Paired with a
 * route-keyed fade so transitions feel intentional rather than abrupt.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Clerk's hash-routed sign-in and sign-up forms put their internal step in
    // the fragment (`/login#/continue`), which is not an element id. Passing
    // that to querySelector throws a DOMException, which would take the whole
    // page down, so the anchor is only honoured when it actually looks like an
    // id. Anything else falls through to the scroll reset, which is the right
    // behaviour on those routes anyway.
    if (hash && /^#[A-Za-z][\w-]*$/.test(hash)) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}
