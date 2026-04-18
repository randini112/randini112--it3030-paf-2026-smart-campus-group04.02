import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Users, Clock, Building2, DoorOpen, Activity, Package, 
  CalendarPlus, AlertTriangle, Layers, ArrowUpRight, QrCode, Share2, Info, BookOpen
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const ResourceDetailModal = ({ isOpen, onClose, resource }) => {
  const [activeTab, setActiveTab] = useState('specs');
  
  if (!resource) return null;

  const { name, description, type, capacity, location, building, floor, status, availStart, availEnd } = resource;
  const isActive = status === 'ACTIVE';

  const copyShareLink = () => {
    const link = `${window.location.origin}/catalogue?id=${resource.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!", {
      description: "You can now share this facility with others."
    });
  };

  let typeConfig = { 
    color: 'from-blue-600 to-indigo-700', 
    icon: <DoorOpen size={20} />, 
    label: 'Lecture Hall', 
    tagBg: 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
  };
  
  if (type === 'LAB') typeConfig = { color: 'from-purple-600 to-fuchsia-700', icon: <Activity size={20} />, label: 'Laboratory', tagBg: 'bg-purple-100/80 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' };
  if (type === 'MEETING_ROOM') typeConfig = { color: 'from-teal-600 to-emerald-700', icon: <Users size={20} />, label: 'Meeting Room', tagBg: 'bg-teal-100/80 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' };
  if (type === 'EQUIPMENT') typeConfig = { color: 'from-orange-600 to-amber-700', icon: <Package size={20} />, label: 'Equipment', tagBg: 'bg-orange-100/80 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-0 bg-white dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl">
        
        {/* Header Section with Gradient Hero */}
        <div className={`relative h-56 bg-gradient-to-br ${typeConfig.color} p-8 flex flex-col justify-end overflow-hidden`}>
          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
               <Badge className={`${typeConfig.tagBg} border-0 px-3 py-1 font-black uppercase text-[10px] tracking-widest`}>
                 {typeConfig.label}
               </Badge>
               <div className="flex items-center space-x-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white border border-white/10">
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-400' : 'bg-rose-500'}`}></span>
                <span>{isActive ? 'LIVE' : 'MAINTENANCE'}</span>
              </div>
            </div>
            
            <DialogHeader className="text-left">
              <DialogTitle className="text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-sm">
                {name}
              </DialogTitle>
            </DialogHeader>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={copyShareLink}
            className="absolute top-4 right-12 text-white hover:bg-white/20 rounded-full h-10 w-10 transition-colors"
          >
            <Share2 size={20} />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 bg-slate-50/50 dark:bg-slate-900/50">
          <TabButton active={activeTab === 'specs'} onClick={() => setActiveTab('specs')} icon={<Info size={16} />} label="General" />
          <TabButton active={activeTab === 'location'} onClick={() => setActiveTab('location')} icon={<MapPin size={16} />} label="Location" />
          <TabButton active={activeTab === 'access'} onClick={() => setActiveTab('access')} icon={<QrCode size={16} />} label="Digital Access" />
        </div>

        {/* Content Area */}
        <div className="p-8">
           <AnimatePresence mode="wait">
             {activeTab === 'specs' && (
               <motion.div 
                 key="specs"
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 10 }}
                 className="space-y-6"
               >
                 <div>
                    <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">About This Resource</h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                      {description || "Explore this modern campus facility designed to support academic excellence and collaboration. This resource is managed by the Smart Campus Operations Hub to ensure maximum availability for students and faculty."}
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <DetailItem icon={<Users className="text-indigo-500" />} label="Capacity" value={capacity ? `${capacity} Occupants` : 'Open Area'} />
                    <DetailItem icon={<Clock className="text-amber-500" />} label="Window" value={`${availStart?.substring(0,5) || '08:00'} - ${availEnd?.substring(0,5) || '18:00'}`} />
                 </div>
               </motion.div>
             )}

             {activeTab === 'location' && (
               <motion.div 
                 key="location"
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 10 }}
                 className="space-y-6"
               >
                 <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                    <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                       <MapPin size={32} />
                    </div>
                    <div>
                       <h4 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{building || "Main Campus"}</h4>
                       <p className="text-sm text-slate-500">{floor ? `Level ${floor}` : 'Base Floor'} — Room {location}</p>
                    </div>
                 </div>
                 <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                    <ArrowUpRight size={18} className="text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Use the interactive campus map for turn-by-turn directions to this facility.</p>
                 </div>
               </motion.div>
             )}

             {activeTab === 'access' && (
               <motion.div 
                 key="access"
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 10 }}
                 className="flex flex-col items-center text-center space-y-4"
               >
                 <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
                    <QRCodeSVG 
                      value={`${window.location.origin}/catalogue?id=${resource.id}`}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                 </div>
                 <div>
                    <h4 className="font-black text-slate-800 dark:text-white tracking-tight">Virtual Entrance Card</h4>
                    <p className="text-xs text-slate-500 max-w-[250px] mt-2">Scan this code to instantly check-in or view more technical equipment documentation.</p>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-8 pt-0 flex flex-col sm:flex-row gap-4">
           <Button 
            className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 font-black tracking-tight text-lg shadow-xl shadow-blue-500/20"
            disabled={!isActive}
           >
              <CalendarPlus size={20} className="mr-2" />
              {isActive ? 'SECURE BOOKING' : 'UNDER REPAIR'}
           </Button>
           <Button 
            variant="outline" 
            className="flex-1 rounded-2xl h-14 font-bold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            onClick={copyShareLink}
           >
              <Share2 size={20} className="mr-2" />
              SHARE
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 py-4 px-6 border-b-2 transition-all font-black text-[11px] uppercase tracking-widest ${
      active 
        ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
        : 'border-transparent text-slate-400 hover:text-slate-600'
    }`}
  >
    {icon}
    {label}
  </button>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50">
    <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{value}</p>
    </div>
  </div>
);

export default ResourceDetailModal;
