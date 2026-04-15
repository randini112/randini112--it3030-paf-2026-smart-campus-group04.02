import React, { useEffect, useState, useCallback } from 'react';
import { useUserResources } from '../../hooks/useUserResources';
import ResourceCard from '../../components/user/ResourceCard';
import SearchBar from '../../components/user/SearchBar';
import FilterSidebar from '../../components/user/FilterSidebar';
import ViewToggle from '../../components/user/ViewToggle';
import ResourceDetailModal from '../../components/user/ResourceDetailModal';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Compass, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  X,
  MapPin,
  Users,
  Clock,
  Activity,
  DoorOpen,
  Package
} from 'lucide-react';

const ResourceCataloguePage = () => {
  const { resources, loading, error, pageInfo, fetchFilteredResources } = useUserResources();
  const [view, setView] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    minCapacity: '',
    maxCapacity: '',
    location: '',
    status: ''
  });

  // Fetch data whenever filters or page changes
  useEffect(() => {
    fetchFilteredResources(filters, 0, 12, 'name,asc');
  }, [filters, fetchFilteredResources]);

  const handleSearchChange = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handlePageChange = (newPage) => {
    fetchFilteredResources(filters, newPage, 12, 'name,asc');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleCardClick = (resource) => {
    setSelectedResource(resource);
    setIsDetailOpen(true);
  };

  // Skeleton loading card
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-32 bg-slate-200 dark:bg-slate-800"></div>
      <div className="p-5 space-y-4">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="2" fill="white"></circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)"></rect>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Compass size={14} className="mr-2" />
              Explore Our Campus
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Facilities & Resources
            </h1>
            <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto leading-relaxed">
              Browse, search, and discover available lecture halls, labs, meeting rooms, and equipment across all campus zones.
            </p>

            {/* Search Bar */}
            <div className="flex justify-center px-4">
              <SearchBar onSearch={handleSearchChange} placeholder="Search by facility name..." />
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-white/70">
              <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">{pageInfo.totalElements || 0} Resources</span>
              <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">4 Categories</span>
              <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">All Buildings</span>
            </div>
          </div>
        </div>
        
        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60V30C360 0 1080 0 1440 30V60H0Z" className="fill-slate-50 dark:fill-slate-900"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block w-72 shrink-0">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Resource Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {loading ? 'Loading...' : `${pageInfo.totalElements || 0} Resources`}
                </h2>
                {filters.type && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.type.replace('_', ' ')}
                    <X size={12} className="cursor-pointer ml-1" onClick={() => handleFilterChange({ type: '' })} />
                  </Badge>
                )}
                {filters.status && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.status === 'ACTIVE' ? 'Active' : 'Maintenance'}
                    <X size={12} className="cursor-pointer ml-1" onClick={() => handleFilterChange({ status: '' })} />
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Button variant="outline" className="lg:hidden" onClick={() => setShowMobileFilters(!showMobileFilters)}>
                  <SlidersHorizontal size={16} className="mr-2" /> Filters
                </Button>
                <ViewToggle view={view} onViewChange={setView} />
              </div>
            </div>

            {/* Mobile Filter Panel */}
            {showMobileFilters && (
              <div className="lg:hidden mb-6">
                <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium">
                ⚠️ {error} — Showing cached data or try refreshing.
              </div>
            )}

            {/* Grid / List View */}
            {loading ? (
              <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : resources.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl mb-6">
                  <Building2 className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No resources found</h3>
                <p className="text-slate-500 max-w-sm mb-6">
                  No facilities match your current search criteria. Try adjusting your filters or clearing the search.
                </p>
                <Button variant="outline" onClick={() => setFilters({ search:'', type:'', minCapacity:'', maxCapacity:'', location:'', status:'' })}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                {view === 'grid' ? (
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {resources.map((resource, index) => (
                      <ResourceCard key={resource.id} resource={resource} onClick={handleCardClick} index={index} />
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="space-y-4">
                    {resources.map((resource) => (
                      <div 
                        key={resource.id} 
                        onClick={() => handleCardClick(resource)}
                        className="flex items-center gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group"
                      >
                        {/* Type Icon */}
                        <div className={`p-4 rounded-xl shrink-0 ${
                          resource.type === 'HALL' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          resource.type === 'LAB' ? 'bg-purple-100 dark:bg-purple-900/30' :
                          resource.type === 'MEETING_ROOM' ? 'bg-teal-100 dark:bg-teal-900/30' :
                          'bg-orange-100 dark:bg-orange-900/30'
                        }`}>
                          {resource.type === 'HALL' && <DoorOpen size={24} className="text-blue-600" />}
                          {resource.type === 'LAB' && <Activity size={24} className="text-purple-600" />}
                          {resource.type === 'MEETING_ROOM' && <Users size={24} className="text-teal-600" />}
                          {resource.type === 'EQUIPMENT' && <Package size={24} className="text-orange-600" />}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1 truncate">{resource.name}</h3>
                          <p className="text-sm text-slate-500 truncate">{resource.description || 'No description'}</p>
                        </div>

                        {/* Meta */}
                        <div className="hidden md:flex items-center gap-6 shrink-0 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Users size={14} />
                            <span>{resource.capacity || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            <span className="truncate max-w-[100px]">{resource.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>{resource.availStart?.substring(0,5)} - {resource.availEnd?.substring(0,5)}</span>
                          </div>
                        </div>

                        {/* Status */}
                        <Badge variant="outline" className={`shrink-0 ${
                          resource.status === 'ACTIVE' 
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400' 
                            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400'
                        }`}>
                          {resource.status === 'ACTIVE' ? 'Active' : 'Maintenance'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500">
                    Page <span className="font-bold text-slate-700 dark:text-slate-300">{pageInfo.page + 1}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{pageInfo.totalPages || 1}</span>
                    <span className="hidden sm:inline"> — {pageInfo.totalElements} total resources</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={pageInfo.page === 0 || loading}
                      onClick={() => handlePageChange(pageInfo.page - 1)}
                      className="rounded-xl"
                    >
                      <ChevronLeft size={16} className="mr-1" /> Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={pageInfo.page >= pageInfo.totalPages - 1 || loading}
                      onClick={() => handlePageChange(pageInfo.page + 1)}
                      className="rounded-xl"
                    >
                      Next <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Resource Detail Modal */}
      <ResourceDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        resource={selectedResource}
      />
    </div>
  );
};

export default ResourceCataloguePage;
