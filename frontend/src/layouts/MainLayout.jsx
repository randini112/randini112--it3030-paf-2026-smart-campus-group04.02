import React, { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { apiService } from '../services/api'

const MainLayout = () => {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    notifications: 0
  })
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      navigate('/login')
      return
    }

    const fetchStats = async () => {
      try {
        const response = await apiService.get('/test')
        console.log('Backend connected:', response.data)
        
        // Simulate stats update
        setStats({
          notifications: 3
        })
      } catch (error) {
        console.error('Backend connection failed:', error)
      }
    }

    fetchStats()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const menuItems = [
    { path: '/app/dashboard', icon: '', label: 'Dashboard' },
    { path: '/app/facilities', icon: '', label: 'Facilities' },
    { path: '/app/bookings', icon: '', label: 'Bookings' },
    { path: '/app/tickets', icon: '', label: 'Tickets' },
    { path: '/app/notifications', icon: '', label: 'Notifications' },
  ]

  if (user?.role === 'ADMIN') {
    menuItems.push({ path: '/app/admin', icon: '', label: 'Admin Panel' })
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex min-h-screen bg-dark-bg">
      {/* Sidebar */}
      <div className="w-64 bg-dark-surface border-r border-dark-border min-h-screen">
        <div className="p-6">
          <Link to="/app/dashboard" className="block">
            <div className="gradient-cyan-blue text-white font-bold text-xl px-3 py-1 rounded text-center">
              Smart Campus
            </div>
          </Link>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-300 hover:text-white hover:bg-dark-border transition-colors ${
                isActive(item.path) 
                  ? 'bg-dark-border text-accent-cyan border-l-4 border-l-accent-cyan' 
                  : ''
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-dark-surface border-b border-dark-border px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              {user && (
                <p className="text-gray-400 text-sm">
                  Welcome back, <span className="text-accent-cyan font-medium">{user.fullName}</span>
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <Link
                to="/app/notifications"
                className="text-gray-400 hover:text-white relative transition-colors"
                title="Notifications"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707a1 1 0 00-.293.707l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 00.293-.707L10 11.586V8z" />
                  <path d="M10 18a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                {stats.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Link>
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-cyan-blue rounded-full"></div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white text-sm"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
