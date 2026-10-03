import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

/** Chrome for all public/marketing routes. */
export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
