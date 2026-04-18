import React, { useState, useEffect, useMemo } from 'react';
import resourceService from '../services/resourceService';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, CheckCircle, Database, Edit, Trash2, Plus } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const AdminResourceManager = () => {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await resourceService.getAllResources();
        setResources(Array.isArray(data) ? data : (data?.content || []));
        setIsLoading(false);
    };

    const handleDelete = async (id) => {
        if(window.confirm('WARNING: Are you sure you want to delete this resource?')) {
            try {
                await resourceService.deleteResource(id);
                loadData();
            } catch (err) {
                alert('Failed to delete resource');
            }
        }
    };

    // Calculate Dashboard Stats
    const stats = useMemo(() => {
        const total = resources.length;
        const active = resources.filter(r => r.status === 'ACTIVE').length;
        const totalCapacity = resources.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
        const maintenance = total - active;
        return { total, active, maintenance, totalCapacity };
    }, [resources]);

    // Data for Chart
    const chartData = useMemo(() => {
        return resources
            .filter(r => r.capacity)
            .sort((a,b) => b.capacity - a.capacity)
            .slice(0, 7); // Top 7 largest facilities
    }, [resources]);

    const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between"
        >
            <div>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${colorClass}`}>
                <Icon className="w-8 h-8" />
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Management Panel</h1>
                        <p className="text-slate-500 mt-1">Monitor, configure, and provision campus assets</p>
                    </div>
                    <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-600/20">
                        <Plus className="w-5 h-5" />
                        Add New Resource
                    </button>
                </div>

                {/* Dashboard Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Resources" value={stats.total} icon={Database} colorClass="bg-blue-100 text-blue-600" delay={0.1} />
                    <StatCard title="Active & Online" value={stats.active} icon={CheckCircle} colorClass="bg-emerald-100 text-emerald-600" delay={0.2} />
                    <StatCard title="Needs Maintenance" value={stats.maintenance} icon={AlertTriangle} colorClass="bg-rose-100 text-rose-600" delay={0.3} />
                    <StatCard title="Total Capacity" value={`${stats.totalCapacity} Pax`} icon={Users} colorClass="bg-purple-100 text-purple-600" delay={0.4} />
                </div>

                {/* Chart & Summary Area */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Top Facilities by Capacity</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: '#F1F5F9'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="capacity" fill="#6366f1" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Data Table */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-800">Resource Database</h3>
                        <span className="text-sm font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                            Showing {resources.length} entries
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4 text-center">Capacity</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                        </td>
                                    </tr>
                                ) : (
                                    resources.map((resource, i) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                            key={resource.id} 
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="px-6 py-4 font-semibold text-slate-800">{resource.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold tracking-wide">
                                                    {resource.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-500">{resource.capacity ? `${resource.capacity} pax` : '-'}</td>
                                            <td className="px-6 py-4 text-slate-500">{resource.location}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${resource.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                    <span className={`text-xs font-bold ${resource.status === 'ACTIVE' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                                        {resource.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 flex justify-center gap-2">
                                                <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(resource.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {(!resources || resources.length === 0) && !isLoading && (
                            <div className="text-center py-10 text-slate-400">No resources found in the database.</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminResourceManager;
