import React from 'react';
import { Filter, DoorOpen, Activity, Users, Package, SlidersHorizontal, MapPin } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FilterSidebar = ({ filters, onFilterChange }) => {
  
  const handleTypeChange = (type) => {
    // If clicking the current type, clear it. Otherwise, set it.
    onFilterChange({ ...filters, type: filters.type === type ? '' : type });
  };

  const handleStatusChange = (value) => {
    onFilterChange({ ...filters, status: value === 'ALL' ? '' : value });
  };

  const handleLocationChange = (e) => {
    onFilterChange({ ...filters, location: e.target.value });
  };

  const handleCapacityChange = (e) => {
    const value = e.target.value;
    onFilterChange({ ...filters, minCapacity: value ? parseInt(value) : '' });
  };

  const clearAllFilters = () => {
    onFilterChange({
      type: '',
      minCapacity: '',
      maxCapacity: '',
      location: '',
      status: ''
    });
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, val]) => key !== 'search' && val !== '').length;
  };

  return (
    <div className="w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-3xl shadow-xl p-8 sticky top-24 overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>

      <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100 dark:border-slate-800 relative z-10">
        <div className="flex items-center text-slate-900 dark:text-white font-black text-xl tracking-tighter uppercase">
          <SlidersHorizontal className="mr-3 text-blue-600" size={20} />
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="ml-3 bg-blue-600 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-black">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        {getActiveFilterCount() > 0 && (
          <button 
            onClick={clearAllFilters}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Resource Type */}
      <div className="mb-10 relative z-10">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-5 uppercase tracking-[0.2em]">Facility Type</h3>
        <div className="grid grid-cols-2 gap-4">
          <FilterButton 
            active={filters.type === 'HALL'} 
            onClick={() => handleTypeChange('HALL')}
            icon={<DoorOpen size={18} />} 
            label="Halls" 
            activeColor="bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
          />
          <FilterButton 
            active={filters.type === 'LAB'} 
            onClick={() => handleTypeChange('LAB')}
            icon={<Activity size={18} />} 
            label="Labs" 
            activeColor="bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20"
          />
          <FilterButton 
            active={filters.type === 'MEETING_ROOM'} 
            onClick={() => handleTypeChange('MEETING_ROOM')}
            icon={<Users size={18} />} 
            label="Rooms" 
            activeColor="bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-500/20"
          />
          <FilterButton 
            active={filters.type === 'EQUIPMENT'} 
            onClick={() => handleTypeChange('EQUIPMENT')}
            icon={<Package size={18} />} 
            label="Equip." 
            activeColor="bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/20"
          />
        </div>
      </div>

      {/* Availability Status */}
      <div className="mb-10 relative z-10">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-5 uppercase tracking-[0.2em]">Status</h3>
        <RadioGroup value={filters.status || "ALL"} onValueChange={handleStatusChange} className="space-y-3">
          <StatusOption value="ALL" label="View All" active={filters.status === '' || filters.status === 'ALL'} />
          <StatusOption value="ACTIVE" label="Active Only" active={filters.status === 'ACTIVE'} color="bg-green-500" />
          <StatusOption value="OUT_OF_SERVICE" label="Maintenance" active={filters.status === 'OUT_OF_SERVICE'} color="bg-rose-500" />
        </RadioGroup>
      </div>

      {/* Capacity Filter */}
      <div className="mb-10 relative z-10">
        <div className="flex items-center justify-between mb-5">
           <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Capacity (Min)</h3>
           <Users size={14} className="text-slate-300" />
        </div>
        <div className="relative group">
          <input 
            type="number" 
            min="0"
            placeholder="E.g. 50"
            value={filters.minCapacity || ''}
            onChange={handleCapacityChange}
            className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
          />
          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400 text-[10px] font-black uppercase">
            PAX
          </div>
        </div>
      </div>

      {/* Location Filter */}
      <div className="relative z-10">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-5 uppercase tracking-[0.2em]">Location</h3>
        <div className="relative group">
          <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search block..."
            value={filters.location || ''}
            onChange={handleLocationChange}
            className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
          />
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ icon, label, active, onClick, activeColor }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-300 ${
        active 
          ? activeColor 
          : 'bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:scale-105 hover:border-slate-200'
      }`}
    >
      <div className={`mb-3 transition-transform ${active ? 'scale-110' : ''}`}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

const StatusOption = ({ value, label, active, color = "bg-blue-500" }) => (
  <div className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all ${
    active 
      ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm' 
      : 'bg-transparent border-transparent opacity-60'
  }`}>
    <RadioGroupItem value={value} id={`status-${value}`} />
    <Label htmlFor={`status-${value}`} className="cursor-pointer font-bold text-xs flex items-center gap-3 flex-1 uppercase tracking-wider">
      {color && <span className={`h-2 w-2 rounded-full ${color}`}></span>}
      {label}
    </Label>
  </div>
);

export default FilterSidebar;
