import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, DoorOpen, Activity, Package, ExternalLink, Clock, ArrowUpRight } from 'lucide-react';

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 15,
        duration: 0.4, 
        delay: index * 0.05 
      }}
      onClick={() => onClick && onClick(resource)}
      className="group relative flex flex-col h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 overflow-hidden rounded-3xl shadow-sm cursor-pointer"
    >
      {/* Top Image / Gradient Area */}
      <div className={`h-36 w-full bg-gradient-to-br ${typeConfig.color} relative overflow-hidden`}>
        {/* Animated Background Pattern */}
        <motion.div 
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20 mix-blend-overlay"
        >
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`pattern-${resource.id}`} width="30" height="30" patternUnits="userSpaceOnUse">
                 <path d="M0 30L30 0" stroke="white" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern-resource.id)"></rect>
          </svg>
        </motion.div>

        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Status Indicator (Pulse) */}
        <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm border border-white/20">
          <span className="relative flex h-2 w-2">
            {isActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? 'bg-green-400' : 'bg-rose-500'}`}></span>
          </span>
          <span className="tracking-wide">{isActive ? 'LIVE' : 'DOWN'}</span>
        </div>

        {/* Type Badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center space-x-2 shadow-lg border border-white/20 dark:border-slate-800/50">
           {typeConfig.icon}
           <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.1em]">{typeConfig.label}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {name}
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
          {description || "Explore this state-of-the-art facility equipped for student success and research excellence."}
        </p>

        {/* Info Grid */}
        <div className="space-y-3 mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
              <Users size={16} className="text-slate-400 mr-2" />
              <span className="font-semibold">{capacity ? `${capacity} Pax` : 'N/A'}</span>
            </div>
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
              <MapPin size={16} className="text-slate-400 mr-2" />
              <span className="font-semibold truncate max-w-[100px]">{location}</span>
            </div>
          </div>
          
          <div className="flex items-center text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg justify-start">
            <Clock size={14} className="mr-2" />
            {availStart ? availStart.substring(0,5) : '08:00'} — {availEnd ? availEnd.substring(0,5) : '18:00'}
          </div>
        </div>
      </div>

      {/* Action Indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg">
            <ArrowUpRight size={16} className="text-blue-600" />
         </div>
      </div>
    </motion.div>
  );
};

export default ResourceCard;
