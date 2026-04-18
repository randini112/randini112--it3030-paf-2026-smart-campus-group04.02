import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import FacilitiesManagerPage from './pages/admin/FacilitiesManagerPage'
import ResourceCataloguePage from './pages/user/ResourceCataloguePage'
import ResourceAnalyticsPage from './pages/admin/ResourceAnalyticsPage'
import ResourceFormPage from './pages/admin/ResourceFormPage'
import ResourceDetailPage from './pages/admin/ResourceDetailPage'
import MaintenanceTrackerPage from './pages/admin/MaintenanceTrackerPage'
import MaintenanceFormPage from './pages/admin/MaintenanceFormPage'
import MaintenanceDetailPage from './pages/admin/MaintenanceDetailPage'

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
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Dashboard Analytics */}
        <Route path="dashboard" element={<ResourceAnalyticsPage />} />
        
        {/* Facilities CRUD Routes */}
        <Route path="facilities" element={<FacilitiesManagerPage />} />
        <Route path="facilities/new" element={<ResourceFormPage />} />
        <Route path="facilities/:id/edit" element={<ResourceFormPage />} />
        <Route path="facilities/:id" element={<ResourceDetailPage />} />
        
        {/* Placeholder routes for navigation */}
        <Route path="settings" element={<div className="p-4">Settings Coming Soon</div>} />

        {/* Maintenance Tracker Routes */}
        <Route path="maintenance" element={<MaintenanceTrackerPage />} />
        <Route path="maintenance/new" element={<MaintenanceFormPage />} />
        <Route path="maintenance/:id/edit" element={<MaintenanceFormPage />} />
        <Route path="maintenance/:id" element={<MaintenanceDetailPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
