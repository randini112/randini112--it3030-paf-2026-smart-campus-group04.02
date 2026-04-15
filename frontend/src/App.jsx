import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import FacilitiesManagerPage from './pages/admin/FacilitiesManagerPage'

function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/facilities" replace />} />
        <Route path="facilities" element={<FacilitiesManagerPage />} />
        {/* Placeholder routes for navigation */}
        <Route path="dashboard" element={<div className="p-4">Dashboard Coming Soon</div>} />
        <Route path="settings" element={<div className="p-4">Settings Coming Soon</div>} />
      </Route>

      {/* Redirect root to admin for now */}
      <Route path="/" element={<Navigate to="/admin/facilities" replace />} />
      <Route path="*" element={<Navigate to="/admin/facilities" replace />} />
    </Routes>
  )
}

export default App
