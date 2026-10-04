import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import ScrollToTop from './components/ScrollToTop'
import ScrollProgress from './components/ui/ScrollProgress'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BecomeConsultant from './pages/BecomeConsultant'
import Consultants from './pages/Consultants'
import ConsultantProfile from './pages/ConsultantProfile'
import ClientDashboard from './pages/client/ClientDashboard'
import ClientAppointments from './pages/client/ClientAppointments'

/**
 * Route table. Each layout keys its <main> on the pathname, so navigating
 * replays the page-fade animation.
 */
export default function App() {
  return (
    <>
      <ScrollProgress />
      <ScrollToTop />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="consultants" element={<Consultants />} />
          <Route path="consultants/:id" element={<ConsultantProfile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* Standalone opt-in: offering services is independent of registration. */}
          <Route path="become-a-consultant" element={<BecomeConsultant />} />
        </Route>

        {/* Client area is behind auth; RequireAuth preserves the intended path. */}
        <Route path="client" element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="appointments" element={<ClientAppointments />} />
          </Route>
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}
