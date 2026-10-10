import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@clerk/react'

/**
 * Gate for the client area. Sends anonymous visitors to the login page and
 * remembers where they were heading, so login can return them there.
 *
 * The gate is Clerk's `useAuth`, not a local session object. The one subtlety
 * is `isLoaded`: Clerk resolves the session asynchronously, and redirecting
 * before it has would bounce a signed-in visitor to the login page on every
 * hard refresh. So while it is still loading nothing is rendered and no
 * decision is made.
 */
export default function RequireAuth() {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()

  if (!isLoaded) return null

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}