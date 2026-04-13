import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'

const BookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    // Simulate fetching bookings
    const mockBookings = [
      {
        id: '1',
        resourceName: 'Computer Lab A',
        userName: 'John Doe',
        startTime: '2024-04-07 10:00 AM',
        endTime: '2024-04-07 12:00 PM',
        status: 'ACTIVE',
        purpose: 'Programming Workshop'
      },
      {
        id: '2',
        resourceName: 'Conference Room 101',
        userName: 'Jane Smith',
        startTime: '2024-04-06 02:00 PM',
        endTime: '2024-04-06 04:00 PM',
        status: 'COMPLETED',
        purpose: 'Team Meeting'
      },
      {
        id: '3',
        resourceName: 'Classroom C203',
        userName: 'Mike Johnson',
        startTime: '2024-04-08 09:00 AM',
        endTime: '2024-04-08 11:00 AM',
        status: 'UPCOMING',
        purpose: 'Guest Lecture'
      },
      {
        id: '4',
        resourceName: 'Physics Lab',
        userName: 'Sarah Wilson',
        startTime: '2024-04-05 01:00 PM',
        endTime: '2024-04-05 03:00 PM',
        status: 'CANCELLED',
        purpose: 'Lab Session'
      }
    ]
    setBookings(mockBookings)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400'
      case 'COMPLETED': return 'text-blue-400'
      case 'UPCOMING': return 'text-yellow-400'
      case 'CANCELLED': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const tableHeaders = ['Resource', 'User', 'Start Time', 'End Time', 'Status', 'Purpose']

  const tableData = bookings.map(booking => [
    booking.resourceName,
    booking.userName,
    booking.startTime,
    booking.endTime,
    <span className={getStatusColor(booking.status)}>
      {booking.status}
    </span>,
    booking.purpose
  ])

  const statsCards = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: '📅',
      color: 'text-blue-400'
    },
    {
      title: 'Active Now',
      value: bookings.filter(b => b.status === 'ACTIVE').length,
      icon: '✅',
      color: 'text-green-400'
    },
    {
      title: 'Upcoming',
      value: bookings.filter(b => b.status === 'UPCOMING').length,
      icon: '⏰',
      color: 'text-yellow-400'
    },
    {
      title: 'Completed',
      value: bookings.filter(b => b.status === 'COMPLETED').length,
      icon: '✅',
      color: 'text-purple-400'
    }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Booking Management</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            + New Booking
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {statsCards.map((stat, index) => (
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

        {/* Create Booking Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Booking</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Resource
                </label>
                <select className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan">
                  <option>Computer Lab A</option>
                  <option>Conference Room 101</option>
                  <option>Classroom C203</option>
                  <option>Physics Lab</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Purpose
                </label>
                <input
                  type="text"
                  placeholder="Enter booking purpose"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="btn-primary">
                  Create Booking
                </button>
              </div>
            </form>
          </Card>
        )}
      </div>

      {/* Bookings Table */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
        <Table
          headers={tableHeaders}
          data={tableData}
        />
      </Card>
    </div>
  )
}

export default BookingsPage
