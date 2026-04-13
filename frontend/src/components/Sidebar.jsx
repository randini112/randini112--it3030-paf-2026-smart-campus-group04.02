import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Building, Calendar, Ticket, Bell, Settings } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAppContext()

  const menuItems = [
    { path: '/app/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/app/facilities', icon: Building, label: 'Facilities' },
    { path: '/app/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/app/tickets', icon: Ticket, label: 'Tickets' },
    { path: '/app/notifications', icon: Bell, label: 'Notifications' },
  ]
  
  if (user?.role === 'ADMIN') {
    menuItems.push({ path: '/app/admin', icon: Settings, label: 'Admin Hub' })
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="w-64 bg-dark-surface border-r border-dark-border min-h-screen">
      <div className="p-6">
        <div className="gradient-cyan-blue text-white font-bold text-xl px-3 py-1 rounded text-center">
          Smart Campus
        </div>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-300 hover:text-white hover:bg-dark-border transition-colors ${
                isActive(item.path) 
                  ? 'bg-dark-border text-accent-cyan border-l-4 border-l-accent-cyan' 
                  : ''
              }`}
            >
              <Icon className="mr-3 w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
