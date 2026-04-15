import React from 'react';
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
  CalendarPlus, AlertTriangle, Layers, ArrowUpRight, QrCode
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const ResourceDetailModal = ({ isOpen, onClose, resource }) => {
  if (!resource) return null;

  const { name, description, type, capacity, location, building, floor, status, availStart, availEnd } = resource;
  const isActive = status === 'ACTIVE';

  let typeConfig = { color: 'from-blue-500 to-indigo-600', icon: <DoorOpen size={20} />, label: 'Lecture Hall', tagBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
  if (type === 'LAB') typeConfig = { color: 'from-purple-500 to-fuchsia-600', icon: <Activity size={20} />, label: 'Laboratory', tagBg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' };
  if (type === 'MEETING_ROOM') typeConfig = { color: 'from-teal-500 to-emerald-600', icon: <Users size={20} />, label: 'Meeting Room', tagBg: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' };
  if (type === 'EQUIPMENT') typeConfig = { color: 'from-orange-500 to-amber-600', icon: <Package size={20} />, label: 'Equipment', tagBg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden rounded-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Hero Banner */}
        <div className={`relative h-44 bg-gradient-to-br ${typeConfig.color} overflow-hidden`}>
          <div className="absolute inset-0 opacity-15">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="detail-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="2" fill="white"></circle>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#detail-dots)"></rect>
            </svg>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold text-white border border-white/20">
            <span className="relative flex h-2.5 w-2.5">
              {isActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span>{isActive ? 'AVAILABLE' : 'MAINTENANCE'}</span>
          </div>

          {/* Type and title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
            <Badge className={`${typeConfig.tagBg} mb-2 font-bold`}>{typeConfig.label}</Badge>
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold text-white tracking-tight">
                {name}
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {description || "No description has been provided for this campus facility."}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoCard icon={<Users size={18} className="text-blue-500" />} label="Capacity" value={capacity ? `${capacity} People` : 'N/A'} />
            <InfoCard icon={<MapPin size={18} className="text-red-500" />} label="Location" value={location || 'Not specified'} />
            <InfoCard icon={<Building2 size={18} className="text-purple-500" />} label="Building" value={building || 'Not specified'} />
            <InfoCard icon={<Layers size={18} className="text-teal-500" />} label="Floor" value={floor || 'Not specified'} />
            <InfoCard 
              icon={<Clock size={18} className="text-amber-500" />} 
              label="Available From" 
              value={availStart ? availStart.substring(0,5) : '08:00'} 
            />
            <InfoCard 
              icon={<Clock size={18} className="text-orange-500" />} 
              label="Available Until" 
              value={availEnd ? availEnd.substring(0,5) : '18:00'} 
            />
          </div>

          {/* QR Code — Innovation Feature */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl">
            <div className="bg-white p-2 rounded-lg shadow-sm border">
              <QRCodeSVG 
                value={`${window.location.origin}/catalogue?resource=${resource.id}`}
                size={80}
                level="M"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <QrCode size={14} className="text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Quick Access QR</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan this code to quickly access or share this facility's detail page on any device.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base font-semibold" disabled={!isActive}>
              <CalendarPlus size={18} className="mr-2" />
              {isActive ? 'Book This Facility' : 'Currently Unavailable'}
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl py-6 text-base font-semibold border-slate-200 dark:border-slate-800">
              <AlertTriangle size={18} className="mr-2" />
              Report Issue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Small reusable info card component
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate" title={value}>{value}</p>
  </div>
);

export default ResourceDetailModal;
