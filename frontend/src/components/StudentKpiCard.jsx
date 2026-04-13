import React from 'react'

/**
 * Student-facing KPI card used on the dashboard summary grid.
 */
const StudentKpiCard = ({ title, value, icon: Icon, iconColor, iconBg, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20 hover:shadow-indigo-950/40 hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.01] transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </button>
  )
}

export default StudentKpiCard
