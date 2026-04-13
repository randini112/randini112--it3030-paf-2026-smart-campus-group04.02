import React from 'react'
import StudentHeader from '../components/StudentHeader'

/**
 * Student Resources Component
 * Module A: Catalogue - Resource browsing and management
 */
const StudentResources = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <StudentHeader activeNav="resources" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Resources</h1>
          <p className="text-slate-400 mb-8">Browse and search available campus facilities</p>
          
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-12">
            <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Resources Catalog</h2>
            <p className="text-slate-400">Module A: Resource browsing interface coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentResources
