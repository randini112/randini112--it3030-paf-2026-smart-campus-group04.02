import React from 'react'

/**
 * KPI Card Component
 * Student-facing KPI summary card with dark mode glassmorphism and hover effects
 */
const KpiCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'text-blue-400', 
  bgColor = 'bg-blue-500/10',
  borderColor = 'border-slate-700'
}) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border ${borderColor} p-6 hover:shadow-lg hover:shadow-slate-900/25 hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-slate-800/70 group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}

export default KpiCard
