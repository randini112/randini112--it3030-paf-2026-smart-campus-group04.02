import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Building2, Settings, LayoutDashboard, Database, UserCircle, Wrench, Bell } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner"

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, color: 'text-blue-500' },
    { name: 'Facilities Hub', path: '/admin/facilities', icon: <Building2 size={20} />, color: 'text-indigo-500' },
    { name: 'System Settings', path: '/admin/settings', icon: <Settings size={20} />, color: 'text-slate-400' },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Database className="text-blue-500 mr-2" size={24} />
          <span className="text-lg font-bold text-white tracking-tight">Campus Ops<span className="text-blue-500">Hub</span></span>
        </div>
        
        <div className="flex-1 px-4 py-6 space-y-1">
          <p className="px-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Module A Core</p>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative ${
                  isActive
                    ? 'bg-white/10 text-white font-black shadow-inner'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 ${item.color || 'bg-blue-500'} bg-current rounded-r-full`} />
                )}
                <span className={isActive ? (item.color || 'text-blue-500') : 'text-slate-500 group-hover:text-slate-300 transition-colors'}>
                  {item.icon}
                </span>
                <span className="text-sm flex-1">{item.name}</span>
                {item.badge && !isActive && (
                  <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                A
             </div>
             <div>
               <p className="text-sm font-medium text-white">Admin User</p>
               <p className="text-xs text-slate-500">Administrator</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center md:hidden">
             <Database className="text-blue-600 mr-2" size={24} />
             <span className="font-bold">Campus OpsHub</span>
          </div>
          <div className="hidden md:block">
            {/* Context aware header text could go here */}
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <UserCircle size={24} />
            </button>
          </div>
        </header>

        {/* Scrollable Main View */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Global Toaster for Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default AdminLayout;
