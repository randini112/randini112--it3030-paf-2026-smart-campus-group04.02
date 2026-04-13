import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import FacilitiesPage from './pages/FacilitiesPage'
import BookingsPage from './pages/BookingsPage'
import TicketsPage from './pages/TicketsPage'
import NotificationsPage from './pages/NotificationsPage'
import AdminPage from './pages/AdminPage'
import StudentHub from './pages/StudentHub'
import StudentResources from './pages/StudentResources'
import StudentBook from './pages/StudentBook'
import StudentMyBookings from './pages/StudentMyBookings'
import StudentMyTickets from './pages/StudentMyTickets'
import StudentReportIncident from './pages/StudentReportIncident'
import StudentNotifications from './pages/StudentNotifications'
import StudentProfile from './pages/StudentProfile'
import Sidebar from './components/Sidebar'
import DashboardHeader from './components/DashboardHeader'

// Protected Route Component
const ProtectedRoute = () => {
  const { user } = useAppContext()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

const StudentRoute = () => {
  const { user } = useAppContext()
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'STUDENT' ? <Outlet /> : <Navigate to="/app/dashboard" replace />
}

const AdminRoute = () => {
  const { user } = useAppContext()
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'ADMIN' ? <Outlet /> : <Navigate to="/student/dashboard" replace />
}

// Persistent Layout Component
const PersistentLayout = () => {
  const { user, notifications } = useAppContext()
  
  return (
    <div className="flex min-h-screen bg-dark-bg">
      {/* Sidebar - Persistent */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - Persistent */}
        <DashboardHeader user={user} notifications={notifications} />
        
        {/* Page Content - Dynamic */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/app" element={<AdminRoute />}>
            <Route element={<PersistentLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="facilities" element={<FacilitiesPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>
          </Route>
          <Route path="/student" element={<StudentRoute />}>
            <Route path="dashboard" element={<StudentHub />} />
            <Route path="resources" element={<StudentResources />} />
            <Route path="book" element={<StudentBook />} />
            <Route path="my-bookings" element={<StudentMyBookings />} />
            <Route path="my-tickets" element={<StudentMyTickets />} />
            <Route path="report-incident" element={<StudentReportIncident />} />
            <Route path="notifications" element={<StudentNotifications />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>
          <Route path="/student-hub" element={<Navigate to="/student/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
