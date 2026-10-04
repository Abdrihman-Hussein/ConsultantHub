import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import ScrollToTop from './components/ScrollToTop'
import ScrollProgress from './components/ui/ScrollProgress'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Consultants from './pages/Consultants'
import ConsultantProfile from './pages/ConsultantProfile'
import ClientDashboard from './pages/client/ClientDashboard'
import ClientAppointments from './pages/client/ClientAppointments'
import DesignOptions from './pages/DesignOptions'

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
        {/* DEV ONLY — visual direction review surface. */}
        <Route path="design-options" element={<DesignOptions />} />

        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="consultants" element={<Consultants />} />
          <Route path="consultants/:id" element={<ConsultantProfile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="client" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="appointments" element={<ClientAppointments />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}
