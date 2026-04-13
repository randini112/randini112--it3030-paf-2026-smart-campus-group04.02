import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle, Eye, ShieldAlert, XCircle } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'
import RejectionReasonModal from '../components/RejectionReasonModal'
import { apiService } from '../services/api'
import { useAppContext } from '../context/AppContext'

const statusOrder = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  CANCELLED: 3,
  COMPLETED: 4,
}

const AdminPage = () => {
  const { user } = useAppContext()
  const [activeTab, setActiveTab] = useState('bookings')
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 342,
    totalBookings: 89,
    openTickets: 23,
    systemHealth: 'GOOD',
  })
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [rejectBooking, setRejectBooking] = useState(null)
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [busyAction, setBusyAction] = useState(false)

  const canManageBookings = user?.role === 'ADMIN'

  const readOnlySections = [
    {
      key: 'facilities',
      title: 'Facilities Overview',
      summary: 'Read-only visibility into room availability and facility status.',
      stats: [
        { label: 'Rooms Online', value: 28 },
        { label: 'Equipment Available', value: 44 },
        { label: 'Maintenance Flags', value: 3 },
      ],
      rows: [
        ['Lab 1', 'Computer Lab', 'Available', '45 seats'],
        ['Hall A', 'Lecture Hall', 'Occupied', '120 seats'],
        ['Room 204', 'Tutorial Room', 'Available', '30 seats'],
      ],
      headers: ['Facility', 'Type', 'Status', 'Capacity'],
    },
    {
      key: 'tickets',
      title: 'Ticketing Overview',
      summary: 'View-only ticket pipeline with no edit or delete controls.',
      stats: [
        { label: 'Open', value: 7 },
        { label: 'In Progress', value: 5 },
        { label: 'Resolved Today', value: 11 },
      ],
      rows: [
        ['#T-104', 'Wi-Fi outage', 'Open', 'High'],
        ['#T-105', 'Projector issue', 'In Progress', 'Medium'],
        ['#T-106', 'Broken chair', 'Resolved', 'Low'],
      ],
      headers: ['Ticket', 'Issue', 'Status', 'Priority'],
    },
    {
      key: 'notifications',
      title: 'Notifications Overview',
      summary: 'Read-only notification digest for global visibility.',
      stats: [
        { label: 'Unread', value: 12 },
        { label: 'Booking Alerts', value: 6 },
        { label: 'System Alerts', value: 4 },
      ],
      rows: [
        ['Booking', 'New request submitted', 'Unread'],
        ['Ticket', 'Issue escalated', 'Unread'],
        ['System', 'Backup completed', 'Read'],
      ],
      headers: ['Type', 'Message', 'State'],
    },
  ]

  useEffect(() => {
    const fetchBookings = async () => {
      setLoadingBookings(true)
      try {
        const response = await apiService.getBookings()
        setBookings(response.data.data || [])
      } catch (error) {
        setBookings([])
      } finally {
        setLoadingBookings(false)
      }
    }

    fetchBookings()
  }, [])

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((left, right) => {
      const leftOrder = statusOrder[left.status] ?? 99
      const rightOrder = statusOrder[right.status] ?? 99

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder
      }

      return new Date(right.createdAt || 0) - new Date(left.createdAt || 0)
    })
  }, [bookings])

  const bookingRows = useMemo(() => {
    return sortedBookings.map((booking) => {
      const isPending = booking.status === 'PENDING'
      const canWrite = canManageBookings && isPending

      return [
        <span key={`${booking.id}-timestamp`} className="text-gray-200">{formatTimestamp(booking.createdAt)}</span>,
        <span key={`${booking.id}-user`} className="text-gray-200">{booking.userId || 'Unknown User'}</span>,
        <span key={`${booking.id}-resource`} className="text-gray-200">{booking.resourceName}</span>,
        <span key={`${booking.id}-status`} className={statusBadgeClass(booking.status)}>{booking.status}</span>,
        <div key={`${booking.id}-actions`} className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedBooking(booking)}
            className="inline-flex items-center gap-1 rounded border border-dark-border px-3 py-1 text-xs text-gray-200 hover:bg-dark-border"
          >
            <Eye size={14} />
            Review
          </button>
          <button
            type="button"
            onClick={() => handleApprove(booking.id)}
            disabled={!canWrite || busyAction}
            className="inline-flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle size={14} />
            Approve
          </button>
          <button
            type="button"
            onClick={() => setRejectBooking(booking)}
            disabled={!canWrite || busyAction}
            className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <XCircle size={14} />
            Reject
          </button>
        </div>,
      ]
    })
  }, [busyAction, canManageBookings, sortedBookings])

  const handleApprove = async (bookingId) => {
    setBusyAction(true)
    try {
      await apiService.approveBooking(bookingId)
      const response = await apiService.getBookings()
      setBookings(response.data.data || [])
    } finally {
      setBusyAction(false)
    }
  }

  const handleRejectConfirm = async (bookingId, reason) => {
    setBusyAction(true)
    try {
      await apiService.rejectBooking(bookingId, reason)
      setRejectBooking(null)
      const response = await apiService.getBookings()
      setBookings(response.data.data || [])
    } finally {
      setBusyAction(false)
    }
  }

  const bookingSummaryCards = [
    { label: 'Pending Requests', value: sortedBookings.filter((booking) => booking.status === 'PENDING').length },
    { label: 'Approved', value: sortedBookings.filter((booking) => booking.status === 'APPROVED').length },
    { label: 'Rejected', value: sortedBookings.filter((booking) => booking.status === 'REJECTED').length },
    { label: 'Cancelled', value: sortedBookings.filter((booking) => booking.status === 'CANCELLED').length },
  ]

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Admin Management Hub</p>
          <h1 className="text-3xl font-bold text-white">Module-aware dashboard</h1>
          <p className="mt-2 text-sm text-gray-400">
            {canManageBookings
              ? 'You have write access across the admin modules.'
              : 'You have view-only visibility across shared modules.'}
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-dark-border bg-dark-surface px-4 py-3">
          <ShieldAlert className="text-accent-cyan" size={20} />
          <div>
            <p className="text-sm font-medium text-white">{user?.fullName || user?.username || 'Admin'}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{user?.role === 'ADMIN' ? 'ADMIN' : user?.role || 'USER'}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-dark-border pb-4">
        {[
          { id: 'bookings', label: 'Booking Management', editable: canManageBookings },
          { id: 'facilities', label: 'Facilities Overview', editable: false },
          { id: 'tickets', label: 'Ticketing Overview', editable: false },
          { id: 'notifications', label: 'Notifications Overview', editable: false },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan'
                : 'border-dark-border text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
            <span className="ml-2 text-[10px] uppercase tracking-[0.2em]">{tab.editable ? 'Management' : 'Overview'}</span>
          </button>
        ))}
      </div>

      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {bookingSummaryCards.map((card) => (
              <Card key={card.label}>
                <p className="text-sm text-gray-400">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
              </Card>
            ))}
          </div>

          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">Booking Requests</h2>
                <p className="text-sm text-gray-400">
                  Pending requests are shown first. Admin users can review, approve, or reject.
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${canManageBookings ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                {canManageBookings ? 'Write Enabled' : 'View Only'}
              </span>
            </div>

            {loadingBookings ? (
              <div className="py-10 text-center text-gray-400">Loading booking requests...</div>
            ) : (
              <Table
                headers={['Timestamp', 'Requester', 'Resource', 'Status', 'Actions']}
                data={bookingRows}
              />
            )}
          </Card>

          {selectedBooking && (
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Review Request</h3>
                  <p className="text-sm text-gray-400">Detailed read-only request summary</p>
                </div>
                <button className="text-sm text-gray-400 hover:text-white" onClick={() => setSelectedBooking(null)}>
                  Close
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Detail label="Requester" value={selectedBooking.userId || 'Unknown'} />
                <Detail label="Resource" value={selectedBooking.resourceName} />
                <Detail label="Status" value={selectedBooking.status} />
                <Detail label="Purpose" value={selectedBooking.purpose || '-'} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Detail label="Requested At" value={formatTimestamp(selectedBooking.createdAt)} />
                <Detail label="Time Range" value={`${formatTimestamp(selectedBooking.startTime)} → ${formatTimestamp(selectedBooking.endTime)}`} />
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab !== 'bookings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.totalUsers}</p>
            </Card>
            <Card>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.activeUsers}</p>
            </Card>
            <Card>
              <p className="text-gray-400 text-sm">Total Bookings</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.totalBookings}</p>
            </Card>
            <Card>
              <p className="text-gray-400 text-sm">Open Tickets</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.openTickets}</p>
            </Card>
          </div>

          {readOnlySections
            .filter((section) => section.key === activeTab)
            .map((section) => (
              <Card key={section.key}>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                    <p className="text-sm text-gray-400">{section.summary}</p>
                  </div>
                  <span className="rounded-full bg-gray-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gray-400">View Only</span>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {section.stats.map((stat) => (
                    <Card key={stat.label} className="bg-dark-bg/40">
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                    </Card>
                  ))}
                </div>

                <Table headers={section.headers} data={section.rows} />
              </Card>
            ))}
        </div>
      )}

      <RejectionReasonModal
        isOpen={Boolean(rejectBooking)}
        booking={rejectBooking}
        isSubmitting={busyAction}
        onCancel={() => setRejectBooking(null)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  )
}

const Detail = ({ label, value }) => (
  <div className="rounded-lg border border-dark-border bg-dark-bg/40 p-4">
    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{label}</p>
    <p className="mt-2 text-sm text-white">{value}</p>
  </div>
)

const formatTimestamp = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

const statusBadgeClass = (status) => {
  switch (status) {
    case 'APPROVED':
      return 'inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400'
    case 'REJECTED':
      return 'inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400'
    case 'CANCELLED':
      return 'inline-flex items-center rounded-full bg-gray-500/10 px-3 py-1 text-xs font-medium text-gray-400'
    default:
      return 'inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400'
  }
}

export default AdminPage
