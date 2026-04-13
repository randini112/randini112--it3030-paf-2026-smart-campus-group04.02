import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Package, 
  Calendar, 
  BookOpen, 
  Ticket, 
  Plus, 
  Bell, 
  User 
} from 'lucide-react'

/**
 * Student Header Component
 * Student-facing interface header with dark mode and glassmorphism
 */
const StudentHeader = ({ activeNav = 'dashboard', userName = 'Student' }) => {
  const navigate = useNavigate()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/student/dashboard' },
    { id: 'resources', label: 'Resources', icon: Package, path: '/student/resources' },
    { id: 'book', label: 'Book', icon: BookOpen, path: '/student/book' },
    { id: 'bookings', label: 'My Bookings', icon: Calendar, path: '/student/my-bookings' },
    { id: 'tickets', label: 'My Tickets', icon: Ticket, path: '/student/my-tickets' },
  ]

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center mr-3 shadow-lg shadow-indigo-600/25">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <span className="text-xl font-bold text-white">Smart Campus</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeNav === item.id
                      ? 'text-white bg-indigo-600 shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
            
            {/* Report Incident Button */}
            <button
              onClick={() => navigate('/student/report-incident')}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-700/25"
            >
              <Plus className="h-4 w-4 mr-2" />
              Report Incident
            </button>
          </nav>

          {/* User Area */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              onClick={() => navigate('/student/notifications')}
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate('/student/profile')}
              className="flex items-center space-x-2 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center border border-slate-600">
                <span className="text-white font-medium text-sm">T</span>
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-300">
                {userName}
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 text-slate-400 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default StudentHeader
