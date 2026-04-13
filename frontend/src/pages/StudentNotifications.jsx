import React from 'react'
import StudentHeader from '../components/StudentHeader'

/**
 * Student Notifications Component
 * Student's notification center and alerts
 */
const StudentNotifications = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <StudentHeader activeNav="dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Notifications</h1>
          <p className="text-slate-400 mb-8">View your campus alerts and updates</p>
          
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-12">
            <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 13.595c0-.395.217-.75.563-1.092l.008-.017l.008-.017c.246-.814.96-1.465 1.958l.008.017c.35.058.5.092.5.163.006.008.008.017.058.247.163.512.008.017.008.017zM16 8a1 1 0 11-2 0 1 1 0 012 0zM5 8a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Notification Center</h2>
            <p className="text-slate-400">Your notification management interface coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentNotifications
