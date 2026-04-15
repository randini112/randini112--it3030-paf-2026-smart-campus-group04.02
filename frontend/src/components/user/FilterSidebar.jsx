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
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 overflow-y-auto max-h-[calc(100vh-100px)] sticky top-24">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center text-slate-900 dark:text-white font-bold text-lg">
          <Filter className="mr-2" size={20} />
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs py-0.5 px-2 rounded-full font-bold">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        {getActiveFilterCount() > 0 && (
          <button 
            onClick={clearAllFilters}
            className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Resource Type */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">Facility Type</h3>
        <div className="grid grid-cols-2 gap-3">
          <FilterButton 
            active={filters.type === 'HALL'} 
            onClick={() => handleTypeChange('HALL')}
            icon={<DoorOpen size={18} className={filters.type === 'HALL' ? 'text-blue-600' : 'text-slate-500'} />} 
            label="Halls" 
            activeColor="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
          />
          <FilterButton 
            active={filters.type === 'LAB'} 
            onClick={() => handleTypeChange('LAB')}
            icon={<Activity size={18} className={filters.type === 'LAB' ? 'text-purple-600' : 'text-slate-500'} />} 
            label="Labs" 
            activeColor="bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800/50 dark:text-purple-400"
          />
          <FilterButton 
            active={filters.type === 'MEETING_ROOM'} 
            onClick={() => handleTypeChange('MEETING_ROOM')}
            icon={<Users size={18} className={filters.type === 'MEETING_ROOM' ? 'text-teal-600' : 'text-slate-500'} />} 
            label="Rooms" 
            activeColor="bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/20 dark:border-teal-800/50 dark:text-teal-400"
          />
          <FilterButton 
            active={filters.type === 'EQUIPMENT'} 
            onClick={() => handleTypeChange('EQUIPMENT')}
            icon={<Package size={18} className={filters.type === 'EQUIPMENT' ? 'text-orange-600' : 'text-slate-500'} />} 
            label="Equip." 
            activeColor="bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800/50 dark:text-orange-400"
          />
        </div>
      </div>

      {/* Availability Status */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">Status</h3>
        <RadioGroup value={filters.status || "ALL"} onValueChange={handleStatusChange} className="space-y-3">
          <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-transparent hover:border-slate-200 transition-colors">
            <RadioGroupItem value="ALL" id="status-all" />
            <Label htmlFor="status-all" className="cursor-pointer font-medium">All Statuses</Label>
          </div>
          <div className="flex items-center space-x-3 bg-green-50 dark:bg-green-900/10 p-2.5 rounded-lg border border-transparent hover:border-green-200 transition-colors">
            <RadioGroupItem value="ACTIVE" id="status-active" />
            <Label htmlFor="status-active" className="cursor-pointer font-medium text-green-700 dark:text-green-500 flex items-center">
              <span className="relative flex h-2 w-2 mr-2">
                 <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Active & Ready
            </Label>
          </div>
          <div className="flex items-center space-x-3 bg-red-50 dark:bg-red-900/10 p-2.5 rounded-lg border border-transparent hover:border-red-200 transition-colors">
            <RadioGroupItem value="OUT_OF_SERVICE" id="status-oos" />
            <Label htmlFor="status-oos" className="cursor-pointer font-medium text-red-700 dark:text-red-500 flex items-center">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 mr-2"></span>
              Maintenance
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Capacity Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Capacity (Min)</h3>
           <SlidersHorizontal size={14} className="text-slate-400" />
        </div>
        <div className="relative">
          <input 
            type="number" 
            min="0"
            placeholder="E.g. 50"
            value={filters.minCapacity || ''}
            onChange={handleCapacityChange}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-sm">
            Pax
          </div>
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">Location / Block</h3>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search location..."
            value={filters.location || ''}
            onChange={handleLocationChange}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
        active 
          ? activeColor 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300'
      }`}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

export default FilterSidebar;
