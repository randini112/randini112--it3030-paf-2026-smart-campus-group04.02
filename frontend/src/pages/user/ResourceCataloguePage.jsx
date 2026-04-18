import React, { useEffect, useState, useCallback } from 'react';
import { useUserResources } from '../../hooks/useUserResources';
import ResourceCard from '../../components/user/ResourceCard';
import SearchBar from '../../components/user/SearchBar';
import FilterSidebar from '../../components/user/FilterSidebar';
import ViewToggle from '../../components/user/ViewToggle';
import ResourceDetailModal from '../../components/user/ResourceDetailModal';
import CatalogueStats from '../../components/user/CatalogueStats';
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
    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden animate-pulse">
      <div className="h-40 bg-slate-200 dark:bg-slate-800"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section - Redesigned for "Next Level" */}
      <div className="relative pt-24 pb-32 md:pt-32 md:pb-48 bg-slate-950 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-8 px-4 py-1.5 border-blue-500/30 bg-blue-500/10 text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]">
              <Compass size={12} className="mr-2" /> Digital Campus Map
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              FIND YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 uppercase">SPACE.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Access the most comprehensive directory of Smart Campus facilities. Halls, Labs, and Tech Resources — all at your fingertips.
            </p>

            {/* Search Bar - Premium Upgrade */}
            <div className="flex justify-center px-4 mb-16">
              <div className="w-full max-w-2xl group">
                <SearchBar 
                  onSearch={handleSearchChange} 
                  placeholder="What are you looking for today?" 
                />
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
               <div className="flex items-center gap-3">
                  <span className="text-white text-lg">{pageInfo.totalElements || '25+'}</span>
                  <span>Assets</span>
               </div>
               <div className="w-px h-8 bg-white/10"></div>
               <div className="flex items-center gap-3">
                  <span className="text-white text-lg">04</span>
                  <span>Categories</span>
               </div>
               <div className="w-px h-8 bg-white/10"></div>
               <div className="flex items-center gap-3">
                  <span className="text-white text-lg">24/7</span>
                  <span>Access</span>
               </div>
            </div>
          </motion.div>
        </div>
        
        {/* Modern Geometric Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block w-72 shrink-0 space-y-6">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
            {!loading && resources.length > 0 && <CatalogueStats resources={resources} />}
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
            <AnimatePresence mode="wait">
              {view === 'grid' ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {resources.map((resource, index) => (
                    <ResourceCard key={resource.id} resource={resource} onClick={handleCardClick} index={index} />
                  ))}
                </motion.div>
              ) : (
                /* List View - Premium Upgrade */
                <motion.div 
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {resources.map((resource, index) => (
                    <motion.div 
                      key={resource.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleCardClick(resource)}
                      className="flex items-center gap-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl p-5 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
                    >
                      {/* Type Icon */}
                      <div className={`p-5 rounded-2xl shrink-0 shadow-lg ${
                        resource.type === 'HALL' ? 'bg-blue-600 text-white' :
                        resource.type === 'LAB' ? 'bg-purple-600 text-white' :
                        resource.type === 'MEETING_ROOM' ? 'bg-teal-600 text-white' :
                        'bg-orange-600 text-white'
                      }`}>
                        {resource.type === 'HALL' && <DoorOpen size={24} />}
                        {resource.type === 'LAB' && <Activity size={24} />}
                        {resource.type === 'MEETING_ROOM' && <Users size={24} />}
                        {resource.type === 'EQUIPMENT' && <Package size={24} />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1 truncate tracking-tight">{resource.name}</h3>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{resource.location}</p>
                      </div>

                      {/* Meta */}
                      <div className="hidden md:flex items-center gap-8 shrink-0">
                        <div className="flex flex-col items-center">
                           <Users size={16} className="text-slate-300 mb-1" />
                           <span className="text-xs font-black text-slate-700 dark:text-slate-300">{resource.capacity || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col items-center">
                           <Clock size={16} className="text-slate-300 mb-1" />
                           <span className="text-xs font-black text-slate-700 dark:text-slate-300">{resource.availStart?.substring(0,5)}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                         <ArrowUpRight size={18} className="text-blue-600" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

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
