import React from 'react'
import { Link } from 'react-router-dom'
import { Bell, LogOut, User } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const DashboardHeader = ({ user, notifications }) => {
  const { logout } = useAppContext()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const displayName = user?.fullName || user?.username || 'Admin'
  const roleLabel = !user
    ? 'Guest'
    : user.role === 'ADMIN'
      ? 'ADMIN'
      : user.role

  return (
    <div className="bg-dark-surface border-b border-dark-border px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          {user && (
            <div>
              <p className="text-gray-400 text-sm">
                Welcome back, <span className="text-accent-cyan font-medium">{displayName}</span>
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-1">{roleLabel}</p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <Link
            to="/app/notifications"
            className="text-gray-400 hover:text-white relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-6 h-6" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </Link>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-cyan-blue rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
