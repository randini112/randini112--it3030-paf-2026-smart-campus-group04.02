import React from 'react'
import Sidebar from '../components/Sidebar'

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
