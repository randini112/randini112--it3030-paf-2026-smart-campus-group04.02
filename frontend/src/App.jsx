import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import FacilitiesManagerPage from './pages/admin/FacilitiesManagerPage'
import ResourceCataloguePage from './pages/user/ResourceCataloguePage'

function App() {
  return (
    <Routes>
      {/* Public User Routes */}
      <Route path="/" element={<UserLayout />}>
        {/* Redirect root to catalogue for this module's scope */}
        <Route index element={<Navigate to="/catalogue" replace />} />
        <Route path="catalogue" element={<ResourceCataloguePage />} />
        {/* Placeholder pages */}
        <Route path="bookings" element={<div className="container mx-auto py-12 px-4 text-center">Bookings Module Coming Soon</div>} />
        <Route path="about" element={<div className="container mx-auto py-12 px-4 text-center">About Page Coming Soon</div>} />
        <Route path="contact" element={<div className="container mx-auto py-12 px-4 text-center">Contact Page Coming Soon</div>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/facilities" replace />} />
        <Route path="facilities" element={<FacilitiesManagerPage />} />
        {/* Placeholder routes for navigation */}
        <Route path="dashboard" element={<div className="p-4">Dashboard Coming Soon</div>} />
        <Route path="settings" element={<div className="p-4">Settings Coming Soon</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
