import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Database, Menu, X, Home, Compass, Info, Phone, CalendarCheck } from 'lucide-react';

const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Catalogue', path: '/catalogue', icon: <Compass size={18} /> },
    { name: 'My Bookings', path: '/bookings', icon: <CalendarCheck size={18} /> },
    { name: 'About', path: '/about', icon: <Info size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Phone size={18} /> }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      
      {/* Public Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Database className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Campus Ops<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive ? 'text-blue-600' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <Link to="/admin/facilities" className="hidden md:flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-9 px-4 py-2">
              Admin Portal
            </Link>
            
            <button 
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 absolute top-16 left-0 right-0 z-40 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 py-2"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="h-px bg-slate-200 dark:bg-slate-800 w-full my-2"></div>
            <Link 
              to="/admin/facilities"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-center bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium py-2.5 rounded-md"
            >
              Go to Admin Portal
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full bg-slate-50 dark:bg-slate-900">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 py-12 mt-auto">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Campus OpsHub</span>
            </div>
            <p className="text-sm max-w-sm">
              The central operations platform for booking facilities, managing assets, and handling maintenance tracking for modern academic institutions.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalogue" className="hover:text-blue-600 transition-colors">Facilities Catalogue</Link></li>
              <li><Link to="/bookings" className="hover:text-blue-600 transition-colors">Make a Booking</Link></li>
              <li><Link to="/tickets" className="hover:text-blue-600 transition-colors">Report an Issue</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Campus Rules</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs">© {currentYear} IT3030 Group 04. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0 text-xs">
            <span>By Randini (Module A)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
