import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

/** Chrome for all public/marketing routes. */
export default function PublicLayout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle">
      <Navbar />
      <main key={pathname} className="flex-1 animate-fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
