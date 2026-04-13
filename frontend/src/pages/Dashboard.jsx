import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Table from '../components/Table'
import { apiService } from '../services/api'
import { useAppContext } from '../context/AppContext'

const Dashboard = () => {
  const { user, notifications } = useAppContext()
  const [stats, setStats] = useState({
    totalResources: 0,
    activeBookings: 0,
    openTickets: 0,
  })

  const [recentBookings] = useState([
    ['Room A101', 'John Doe', '2024-04-07', 'Active'],
    ['Lab B203', 'Jane Smith', '2024-04-06', 'Completed'],
    ['Conference Hall', 'Mike Johnson', '2024-04-05', 'Active'],
    ['Computer Lab', 'Sarah Wilson', '2024-04-04', 'Completed'],
  ])

  const [recentTickets] = useState([
    ['#001', 'AC Not Working', 'Room A101', 'Open'],
    ['#002', 'Projector Issue', 'Lab B203', 'In Progress'],
    ['#003', 'WiFi Problem', 'Conference Hall', 'Resolved'],
    ['#004', 'Light Flickering', 'Room C305', 'Open'],
  ])

  const displayName = user?.fullName || user?.username || 'Admin'
  const roleLabel = user?.role === 'ADMIN' ? 'ADMIN' : user?.role || ''

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.get('/test')
        console.log('Backend connected:', response.data)
        
        // Simulate stats update
        setStats({
          totalResources: 45,
          activeBookings: 12,
          openTickets: 8
        })
      } catch (error) {
        console.error('Backend connection failed:', error)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Resources',
      value: stats.totalResources,
      icon: '',
      color: 'text-blue-400'
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings,
      icon: '',
      color: 'text-green-400'
    },
    {
      title: 'Open Tickets',
      value: stats.openTickets,
      icon: '',
      color: 'text-yellow-400'
    },
    {
      title: 'Notifications',
      value: notifications,
      icon: '',
      color: 'text-purple-400'
    }
  ]

  const quickAccessCards = [
    {
      title: 'Facilities',
      description: 'Browse and book available facilities',
      icon: '',
      route: '/app/facilities',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Booking',
      description: 'Manage your bookings and reservations',
      icon: '',
      route: '/app/bookings',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Ticketing',
      description: 'Create and track support tickets',
      icon: '',
      route: '/app/tickets',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Notifications',
      description: 'View your notifications and updates',
      icon: '',
      route: '/app/notifications',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="text-accent-cyan">{displayName}</span>
        </h1>
        {roleLabel && (
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">{roleLabel}</p>
        )}
        <p className="text-gray-400">
          Here's an overview of your campus activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`text-3xl ${stat.color}`}>{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickAccessCards.map((card, index) => (
          <Link key={index} to={card.route}>
            <Card className="hover:transform hover:scale-105 transition-transform cursor-pointer">
              <div className={`bg-gradient-to-r ${card.color} p-4 rounded-lg text-white text-center`}>
                <div className="text-3xl mb-2">{card.icon}</div>
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm opacity-90">{card.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          <Table
            headers={['Resource', 'User', 'Date', 'Status']}
            data={recentBookings}
          />
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
          <Table
            headers={['Ticket #', 'Title', 'Location', 'Status']}
            data={recentTickets}
          />
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
