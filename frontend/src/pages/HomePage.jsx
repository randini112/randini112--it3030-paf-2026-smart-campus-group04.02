import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building, Calendar, Ticket, Bell, ChevronRight, Menu, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const serviceCards = [
    {
      icon: Building,
      title: 'Facilities',
      description: 'Browse and book available campus facilities with real-time availability tracking.',
      path: '/app/facilities'
    },
    {
      icon: Calendar,
      title: 'Bookings',
      description: 'Manage your bookings and reservations with intelligent scheduling.',
      path: '/app/bookings'
    },
    {
      icon: Ticket,
      title: 'Tickets',
      description: 'Create and track support tickets with priority management.',
      path: '/app/tickets'
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Stay updated with instant notifications and alerts for all activities.',
      path: '/app/notifications'
    }
  ]

  const stats = [
    { value: '50+', label: 'Rooms' },
    { value: '1000+', label: 'Students' },
    { value: '99%', label: 'Success Rate' },
    { value: '24/7', label: 'Support' }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sticky Navbar with transparent-to-solid transition */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glassmorphism shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="gradient-noir text-white font-bold text-xl px-3 py-1 rounded">
                Smart Campus
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <Link to="/login" className="border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-800 transition-all">
                Login
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glassmorphism">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" className="block text-gray-300 hover:text-white px-3 py-2">Home</a>
              <a href="#services" className="block text-gray-300 hover:text-white px-3 py-2">Services</a>
              <a href="#about" className="block text-gray-300 hover:text-white px-3 py-2">About</a>
              <a href="#contact" className="block text-gray-300 hover:text-white px-3 py-2">Contact</a>
              <Link to="/login" className="block border border-slate-600 text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-800 mt-2">
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Large centered typography */}
      <section id="home" className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Elevate Your Campus Operations
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Streamline campus management with intelligent booking systems, real-time notifications, and comprehensive support services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary">
              Get Started as Student
            </Link>
            <Link to="/login" className="btn-secondary">
              Get Started as Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="py-12 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Grid - 4 cards with Lucide icons */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-slate-400 text-lg">Comprehensive solutions for modern campus management</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCards.map((service, index) => {
              const Icon = service.icon
              return (
                <Link key={index} to={service.path}>
                  <Card className="card-noir hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <div className="p-6">
                      <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-600 transition-colors">
                        <Icon className="w-6 h-6 text-slate-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                      <p className="text-slate-400 text-sm mb-4">{service.description}</p>
                      <div className="flex items-center text-slate-400 hover:text-white transition-colors">
                        <span className="text-sm font-medium">Learn More</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="gradient-noir text-white font-bold text-xl px-3 py-1 rounded inline-block mb-4">
            Smart Campus
          </div>
          <p className="text-slate-400">
            © 2024 Smart Campus Operations Hub. Empowering university management.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
