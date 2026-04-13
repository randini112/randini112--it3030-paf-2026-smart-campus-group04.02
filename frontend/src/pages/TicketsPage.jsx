import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'

const TicketsPage = () => {
  const [tickets, setTickets] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    // Simulate fetching tickets
    const mockTickets = [
      {
        id: '1',
        ticketNumber: '#001',
        title: 'AC Not Working',
        description: 'Air conditioning unit not functioning properly',
        location: 'Room A101',
        priority: 'HIGH',
        status: 'OPEN',
        category: 'MAINTENANCE',
        createdAt: '2024-04-07 09:00 AM'
      },
      {
        id: '2',
        ticketNumber: '#002',
        title: 'Projector Issue',
        description: 'Projector not displaying content correctly',
        location: 'Lab B203',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        category: 'IT',
        createdAt: '2024-04-06 02:30 PM'
      },
      {
        id: '3',
        ticketNumber: '#003',
        title: 'WiFi Problem',
        description: 'No internet connectivity in conference hall',
        location: 'Conference Hall',
        priority: 'HIGH',
        status: 'RESOLVED',
        category: 'IT',
        createdAt: '2024-04-05 11:00 AM'
      },
      {
        id: '4',
        ticketNumber: '#004',
        title: 'Light Flickering',
        description: 'Fluorescent lights flickering intermittently',
        location: 'Room C305',
        priority: 'LOW',
        status: 'OPEN',
        category: 'FACILITY',
        createdAt: '2024-04-07 08:30 AM'
      }
    ]
    setTickets(mockTickets)
  }, [])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-400'
      case 'MEDIUM': return 'text-yellow-400'
      case 'LOW': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'text-blue-400'
      case 'IN_PROGRESS': return 'text-yellow-400'
      case 'RESOLVED': return 'text-green-400'
      case 'CLOSED': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const tableHeaders = ['Ticket #', 'Title', 'Location', 'Priority', 'Status', 'Category', 'Created']

  const tableData = tickets.map(ticket => [
    ticket.ticketNumber,
    ticket.title,
    ticket.location,
    <span className={getPriorityColor(ticket.priority)}>
      {ticket.priority}
    </span>,
    <span className={getStatusColor(ticket.status)}>
      {ticket.status}
    </span>,
    ticket.category
  ])

  const statsCards = [
    {
      title: 'Total Tickets',
      value: tickets.length,
      icon: '🎫',
      color: 'text-blue-400'
    },
    {
      title: 'Open',
      value: tickets.filter(t => t.status === 'OPEN').length,
      icon: '📂',
      color: 'text-yellow-400'
    },
    {
      title: 'In Progress',
      value: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      icon: '⚙️',
      color: 'text-orange-400'
    },
    {
      title: 'Resolved',
      value: tickets.filter(t => t.status === 'RESOLVED').length,
      icon: '✅',
      color: 'text-green-400'
    }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Ticket Management</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            + Create Ticket
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

        {/* Create Ticket Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Ticket</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ticket Title
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the issue"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Room number or area"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan">
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="IT">IT Support</option>
                  <option value="FACILITY">Facility</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Detailed Description
                </label>
                <textarea
                  rows="4"
                  placeholder="Provide detailed information about the issue..."
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="btn-primary">
                  Submit Ticket
                </button>
              </div>
            </form>
          </Card>
        )}
      </div>

      {/* Tickets Table */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">All Tickets</h2>
        <Table
          headers={tableHeaders}
          data={tableData}
        />
      </Card>
    </div>
  )
}

export default TicketsPage
