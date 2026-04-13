import React from 'react'
import StudentHeader from '../components/StudentHeader'

/**
 * Student Profile Component
 * Student's personal profile and settings
 */
const StudentProfile = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <StudentHeader activeNav="dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Profile</h1>
          <p className="text-slate-400 mb-8">Manage your personal information and preferences</p>
          
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-12">
            <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Profile Management</h2>
            <p className="text-slate-400">Your profile interface coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentProfile
