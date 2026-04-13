import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock3,
  Plus,
  Ticket,
  ArrowRight
} from 'lucide-react'
import StudentPortalHeader from '../components/StudentPortalHeader'
import StudentKpiCard from '../components/StudentKpiCard'
import { useAppContext } from '../context/AppContext'

/**
 * Student-facing dashboard interface for Smart Campus Operations Hub.
 */
const StudentHub = () => {
  const navigate = useNavigate()
  const { user: contextUser } = useAppContext()
  const [recentTickets] = useState([])
  const [recentBookings] = useState([])

  const user = useMemo(() => {
    if (contextUser) {
      return contextUser
    }

    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  }, [contextUser])

  const userName = (user?.username || user?.fullName || '').trim() || 'Student'

  const kpis = [
    {
      id: 'total-tickets',
      title: 'Total Tickets',
      value: '0',
      icon: Ticket,
      iconColor: 'text-blue-300',
      iconBg: 'bg-blue-500/20',
      onClick: () => navigate('/student/my-tickets')
    },
    {
      id: 'open-tickets',
      title: 'Open Tickets',
      value: '0',
      icon: AlertTriangle,
      iconColor: 'text-orange-300',
      iconBg: 'bg-orange-500/20',
      onClick: () => navigate('/student/my-tickets')
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      value: '0',
      icon: Clock3,
      iconColor: 'text-blue-300',
      iconBg: 'bg-blue-500/20',
      onClick: () => navigate('/student/my-tickets')
    },
    {
      id: 'resolved',
      title: 'Resolved',
      value: '0',
      icon: CheckCircle2,
      iconColor: 'text-green-300',
      iconBg: 'bg-green-500/20',
      onClick: () => navigate('/student/my-tickets')
    },
    {
      id: 'total-bookings',
      title: 'Total Bookings',
      value: '0',
      icon: CalendarDays,
      iconColor: 'text-violet-300',
      iconBg: 'bg-violet-500/20',
      onClick: () => navigate('/student/my-bookings')
    },
    {
      id: 'pending-bookings',
      title: 'Pending Bookings',
      value: '0',
      icon: CircleDot,
      iconColor: 'text-orange-300',
      iconBg: 'bg-orange-500/20',
      onClick: () => navigate('/student/my-bookings')
    },
    {
      id: 'unread-notifications',
      title: 'Unread Notifications',
      value: '0',
      icon: Bell,
      iconColor: 'text-blue-300',
      iconBg: 'bg-blue-500/20',
      onClick: () => navigate('/student/notifications')
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <StudentPortalHeader activeNav="dashboard" userName={userName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userName}</h1>
          <p className="text-slate-400">Here&apos;s an overview of your campus activities and resources.</p>
        </section>

        <section className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/student/notifications')}
            className="inline-flex items-center px-5 py-2.5 rounded-lg border border-slate-700 text-slate-200 bg-transparent hover:bg-slate-800 transition-all"
          >
            View Notifications
          </button>
          <button
            onClick={() => navigate('/student/book')}
            className="inline-flex items-center px-5 py-2.5 rounded-lg border border-slate-700 text-slate-200 bg-transparent hover:bg-slate-800 transition-all"
          >
            Book Resource
          </button>
          <button
            onClick={() => navigate('/student/report-incident')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
          >
            <Plus className="h-4 w-4" />
            Report Incident
          </button>
        </section>

        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <StudentKpiCard
                key={kpi.id}
                title={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                iconColor={kpi.iconColor}
                iconBg={kpi.iconBg}
                onClick={kpi.onClick}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Tickets</h2>
              <button
                onClick={() => navigate('/student/my-tickets')}
                className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200 text-sm font-medium transition-all"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {recentTickets.length === 0 ? (
              <div className="text-slate-400 py-6">No tickets yet</div>
            ) : (
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="border-b border-slate-800 pb-3 last:border-0">
                    <p className="font-medium text-white">{ticket.title}</p>
                    <p className="text-sm text-slate-400">{ticket.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
              <button
                onClick={() => navigate('/student/my-bookings')}
                className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200 text-sm font-medium transition-all"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-slate-400 py-6">No bookings yet</div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="border-b border-slate-800 pb-3 last:border-0">
                    <p className="font-medium text-white">{booking.resource}</p>
                    <p className="text-sm text-slate-400">{booking.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default StudentHub
