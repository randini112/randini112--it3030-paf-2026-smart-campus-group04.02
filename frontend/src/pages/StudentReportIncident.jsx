import React from 'react'
import StudentHeader from '../components/StudentHeader'

/**
 * Student Report Incident Component
 * Module C: Maintenance - Incident reporting interface
 */
const StudentReportIncident = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <StudentHeader activeNav="dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Report Incident</h1>
          <p className="text-slate-400 mb-8">Report maintenance and facility issues</p>
          
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-12">
            <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 2.502-3.21V8.21c0-1.543-1.962-3.21-2.502-3.21H6.082c-1.54 0-2.502 1.667-2.502 3.21v6.58c0 1.543 1.962 3.21 2.502 3.21h6.856c1.54 0 2.502-1.667 2.502-3.21z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Incident Reporting</h2>
            <p className="text-slate-400">Module C: Maintenance reporting interface coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentReportIncident
