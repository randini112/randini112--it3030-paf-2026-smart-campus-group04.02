import React, { useState, useEffect } from 'react';
import resourceService from '../services/resourceService';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Users, Box, Radio } from 'lucide-react';

const ResourceCatalogue = () => {
    const [resources, setResources] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);

    const filterTypes = ['ALL', 'HALL', 'LAB', 'ROOM', 'EQUIPMENT'];

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            const data = await resourceService.getAllResources();
            const resData = Array.isArray(data) ? data : (data?.content || []);
            setResources(resData);
            setFilteredData(resData);
            setIsLoading(false);
        };
        fetchResources();
    }, []);

    useEffect(() => {
        let result = resources;
        if (activeFilter !== 'ALL') {
            result = result.filter(r => r.type === activeFilter);
        }
        if (search) {
            result = result.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase()));
        }
        setFilteredData(result);
    }, [search, activeFilter, resources]);

    // Type to Icon Mapping
    const getIconForType = (type) => {
        switch(type) {
            case 'HALL': return <Users className="w-5 h-5 text-indigo-500" />;
            case 'LAB': return <Radio className="w-5 h-5 text-emerald-500" />;
            case 'EQUIPMENT': return <Box className="w-5 h-5 text-amber-500" />;
            default: return <MapPin className="w-5 h-5 text-slate-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-8 font-sans transition-colors duration-500 selection:bg-indigo-300">
            {/* Header / Hero */}
            <div className="max-w-7xl mx-auto mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900"
                    >
                        Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Catalogue</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="text-slate-500 mt-2 text-lg"
                    >
                        Discover and interact with University Facilities and Assets
                    </motion.p>
                </div>
                
                {/* Search Bar */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                    className="relative w-full md:w-96 group"
                >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border-2 border-slate-200 rounded-2xl leading-5 bg-white/50 backdrop-blur-md placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all sm:text-sm shadow-sm hover:shadow-md"
                        placeholder="Search resources..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </motion.div>
            </div>

            {/* Filter Pills */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="max-w-7xl mx-auto flex flex-wrap gap-3 mb-10"
            >
                <Filter className="w-5 h-5 text-slate-400 mt-2 mr-2" />
                {filterTypes.map(type => (
                    <button
                        key={type}
                        onClick={() => setActiveFilter(type)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                            activeFilter === type 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105' 
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-indigo-300'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </motion.div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <motion.div 
                        layout 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence>
                            {filteredData.map((resource) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    key={resource.id}
                                    className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 group cursor-pointer relative overflow-hidden"
                                >
                                    {/* Decorative Background Blob */}
                                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                                            {getIconForType(resource.type)}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                                            resource.status === 'ACTIVE' 
                                            ? 'bg-emerald-100 text-emerald-700' 
                                            : 'bg-rose-100 text-rose-700'
                                        }`}>
                                            {resource.status === 'ACTIVE' ? 'AVAILABLE' : 'OFFLINE'}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-slate-800 mb-1 relative z-10 group-hover:text-indigo-600 transition-colors">{resource.name}</h3>
                                    
                                    <div className="space-y-2 mt-4">
                                        <div className="flex items-center text-slate-500 text-sm">
                                            <MapPin className="w-4 h-4 mr-2 opacity-70" />
                                            {resource.location}
                                        </div>
                                        {resource.capacity && (
                                            <div className="flex items-center text-slate-500 text-sm">
                                                <Users className="w-4 h-4 mr-2 opacity-70" />
                                                Capacity: {resource.capacity} pax
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Interaction bar (Appears on hover) */}
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-sm font-semibold text-indigo-600 flex items-center gap-1">
                                            View Details <span className="text-lg leading-none">&rarr;</span>
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {filteredData.length === 0 && (
                            <div className="col-span-full text-center py-20 text-slate-400">
                                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-xl">No resources found matching your criteria</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ResourceCatalogue;
