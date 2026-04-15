import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, DoorOpen, Activity, Package, ExternalLink, Clock } from 'lucide-react';

const ResourceCard = ({ resource, onClick, index = 0 }) => {
  const { name, description, type, capacity, location, status, availStart, availEnd } = resource;

  const isActive = status === 'ACTIVE';

  // Determine styling based on type
  let typeConfig = {
    color: 'from-blue-500 to-indigo-600',
    icon: <DoorOpen size={16} className="text-blue-600" />,
    badgeBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    label: 'Hall'
  };
  
  if (type === 'LAB') {
    typeConfig = {
      color: 'from-purple-500 to-fuchsia-600',
      icon: <Activity size={16} className="text-purple-600" />,
      badgeBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      label: 'Laboratory'
    };
  } else if (type === 'MEETING_ROOM') {
    typeConfig = {
      color: 'from-teal-500 to-emerald-600',
      icon: <Users size={16} className="text-teal-600" />,
      badgeBg: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
      label: 'Meeting Room'
    };
  } else if (type === 'EQUIPMENT') {
    typeConfig = {
      color: 'from-orange-500 to-amber-600',
      icon: <Package size={16} className="text-orange-600" />,
      badgeBg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      label: 'Equipment'
    };
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      onClick={() => onClick && onClick(resource)}
      className="group relative flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 overflow-hidden rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Top Image / Gradient Area */}
      <div className={`h-32 w-full bg-gradient-to-br ${typeConfig.color} relative overflow-hidden`}>
        {/* Abstract pattern inside gradient */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                 <circle cx="2" cy="2" r="1.5" fill="currentColor"></circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)"></rect>
          </svg>
        </div>

        {/* Status Indicator (Pulse) */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-white/20 dark:bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm border border-white/20">
          <span className="relative flex h-2 w-2">
            {isActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </span>
          <span className="tracking-wide shadow-sm">{isActive ? 'AVAILABLE' : 'MAINTENANCE'}</span>
        </div>

        {/* Type Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm border border-white/20 dark:border-slate-800/50">
           {typeConfig.icon}
           <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{typeConfig.label}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {name}
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 min-h-[40px]">
          {description || "No description provided for this campus facility."}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
            <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-md mr-2">
              <Users size={14} className="text-slate-500 dark:text-slate-400" />
            </div>
            <span className="font-medium">{capacity ? `${capacity} Pax` : 'N/A'}</span>
          </div>

          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
            <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-md mr-2">
              <MapPin size={14} className="text-slate-500 dark:text-slate-400" />
            </div>
            <span className="font-medium truncate" title={location}>{location}</span>
          </div>
          
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 col-span-2">
            <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-md mr-2">
              <Clock size={14} className="text-slate-500 dark:text-slate-400" />
            </div>
            <span className="font-medium text-xs tracking-wide">
              {availStart ? availStart.substring(0,5) : '08:00'} — {availEnd ? availEnd.substring(0,5) : '18:00'}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Action Overlay Overlay on desktop */}
      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-300 pointer-events-none rounded-2xl"></div>
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
        <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
          <ExternalLink size={16} />
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceCard;
