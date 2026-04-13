import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  BookOpen,
  Calendar,
  Home,
  Package,
  Plus,
  Ticket,
  User
} from 'lucide-react'

/**
 * Student-facing header for the Smart Campus Operations Hub.
 */
const StudentPortalHeader = ({ activeNav = 'dashboard', userName = 'Student' }) => {
  const navigate = useNavigate()
  const displayName = (userName || '').trim() || 'Student'
  const profileInitial = displayName.charAt(0).toUpperCase()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/student/dashboard', icon: Home },
    { id: 'resources', label: 'Resources', path: '/student/resources', icon: Package },
    { id: 'book', label: 'Book', path: '/student/book', icon: BookOpen },
    { id: 'bookings', label: 'My Bookings', path: '/student/my-bookings', icon: Calendar },
    { id: 'tickets', label: 'My Tickets', path: '/student/my-tickets', icon: Ticket }
  ]

  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
              <span className="text-white text-sm font-bold">SC</span>
            </div>
            <span className="text-white font-semibold text-lg">Smart Campus</span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeNav === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}

            <button
              onClick={() => navigate('/student/report-incident')}
              className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
            >
              <Plus className="h-4 w-4" />
              Report Incident
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/student/notifications')}
              className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Bell className="h-4 w-4" />
            </button>

            <button
              onClick={() => navigate('/student/profile')}
              className="inline-flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center">
                {profileInitial}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-200">{displayName}</span>
              <User className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default StudentPortalHeader
