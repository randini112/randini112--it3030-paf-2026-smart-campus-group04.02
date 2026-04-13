import React from 'react'
import StudentHeader from '../components/StudentHeader'

/**
 * Student My Bookings Component
 * Student's personal booking history and management
 */
const StudentMyBookings = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <StudentHeader activeNav="bookings" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">My Bookings</h1>
          <p className="text-slate-400 mb-8">View and manage your campus reservations</p>
          
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-12">
            <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Booking History</h2>
            <p className="text-slate-400">Your personal booking management interface coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentMyBookings
