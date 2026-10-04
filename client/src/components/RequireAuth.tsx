import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

/**
 * Gate for the client area. Sends anonymous visitors to the login page and
 * remembers where they were heading, so login can return them there.
 */
export default function RequireAuth() {
  const { session } = useApp();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
