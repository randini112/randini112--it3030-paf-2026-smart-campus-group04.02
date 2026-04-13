import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-dark-surface border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="gradient-cyan-blue text-white font-bold text-xl px-3 py-1 rounded">
                Smart Campus
              </div>
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link to="/dashboard" className="btn-primary">
              Get Started as Student
            </Link>
            <button className="btn-secondary">
              Get Started as Admin
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
