import React, { useState, useEffect, useMemo } from 'react';
import resourceService from '../services/resourceService';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertTriangle, CheckCircle, Database, Edit, Trash2, Plus, X, Download, QrCode, Moon, Sun } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Toaster, toast } from 'sonner';
import { QRCodeCanvas } from 'qrcode.react';

const AdminResourceManager = () => {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Form Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', type: 'HALL', capacity: '', location: '', status: 'ACTIVE'
    });

    // QR Modal State
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrResource, setQrResource] = useState(null);

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
                toast.success('Resource deleted successfully!');
                loadData();
            } catch (err) {
                toast.error('Failed to delete resource');
            }
        }
    };

    const openModal = (resource = null) => {
        if (resource) {
            setEditingId(resource.id);
            setFormData({
                name: resource.name, type: resource.type, capacity: resource.capacity || '', location: resource.location, status: resource.status
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', type: 'HALL', capacity: '', location: '', status: 'ACTIVE' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, capacity: formData.capacity ? parseInt(formData.capacity) : null };
            if (editingId) {
                await resourceService.updateResource(editingId, payload);
                toast.success('Resource updated successfully');
            } else {
                await resourceService.createResource(payload);
                toast.success('Resource created successfully');
            }
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            toast.error('Operation failed. Please try again.');
        }
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Name', 'Type', 'Capacity', 'Location', 'Status'];
        const rows = resources.map(r => [
            r.id, `"${r.name}"`, r.type, r.capacity || 'N/A', `"${r.location}"`, r.status
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "campus_resources_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.info('CSV Report Exported Successfully!');
    };

    const openQr = (resource) => {
        setQrResource(resource);
        setIsQrModalOpen(true);
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
        return resources.filter(r => r.capacity).sort((a,b) => b.capacity - a.capacity).slice(0, 7);
    }, [resources]);

    // Dynamic Styling Variables for Dark Mode
    const _pageBg = isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50/50 text-slate-900';
    const _cardBg = isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100';
    const _textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
    const _textNormal = isDarkMode ? 'text-slate-200' : 'text-slate-800';

    const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
            className={`${_cardBg} rounded-2xl p-6 shadow-sm border flex items-center justify-between`}
        >
            <div>
                <p className={`${_textMuted} text-sm font-medium uppercase tracking-wider`}>{title}</p>
                <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} mt-2`}>{value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${colorClass}`}>
                <Icon className="w-8 h-8" />
            </div>
        </motion.div>
    );

    return (
        <div className={`min-h-screen p-6 md:p-8 font-sans transition-colors duration-300 ${_pageBg}`}>
            <Toaster position="top-right" richColors />
            
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Subsystem */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Management Panel</h1>
                        <p className={`${_textMuted} mt-1`}>Monitor, configure, and provision campus assets</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button 
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-3 rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-yellow-400' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button 
                            onClick={handleExportCSV}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-100/50 text-slate-700'}`}
                        >
                            <Download className="w-5 h-5 text-indigo-500" />
                            Export CSV
                        </button>
                        <button 
                            onClick={() => openModal()}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-600/20"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Resource
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Resources" value={stats.total} icon={Database} colorClass={isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'} delay={0.1} />
                    <StatCard title="Active & Online" value={stats.active} icon={CheckCircle} colorClass={isDarkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600'} delay={0.2} />
                    <StatCard title="Needs Maintenance" value={stats.maintenance} icon={AlertTriangle} colorClass={isDarkMode ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-600'} delay={0.3} />
                    <StatCard title="Total Capacity" value={`${stats.totalCapacity} Pax`} icon={Users} colorClass={isDarkMode ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-600'} delay={0.4} />
                </div>

                {/* Chart Area */}
                <div className={`${_cardBg} rounded-3xl p-6 shadow-sm border`}>
                    <h3 className={`text-lg font-bold ${_textNormal} mb-6`}>Top Facilities by Capacity</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12}} />
                                <RechartsTooltip 
                                    cursor={{fill: isDarkMode ? '#1e293b' : '#F1F5F9'}}
                                    contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', color: isDarkMode ? '#fff' : '#000', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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
                    className={`${_cardBg} rounded-3xl shadow-sm border overflow-hidden relative z-10`}
                >
                    <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'} flex justify-between items-center`}>
                        <h3 className={`text-lg font-bold ${_textNormal}`}>Resource Database</h3>
                        <span className={`text-sm font-medium border px-3 py-1 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-white text-slate-500 border-slate-200'}`}>
                            Showing {resources.length} entries
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className={`text-xs uppercase font-semibold border-b ${isDarkMode ? 'bg-slate-800/80 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4 text-center">Capacity</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                        </td>
                                    </tr>
                                ) : (
                                    resources.map((resource, i) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                            key={resource.id} 
                                            className={`transition-colors group ${isDarkMode ? 'hover:bg-slate-700/50 text-slate-300' : 'hover:bg-slate-50/50 text-slate-600'}`}
                                        >
                                            <td className={`px-6 py-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{resource.name}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                                    {resource.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">{resource.capacity ? `${resource.capacity} pax` : '-'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${resource.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                    <span className={`text-xs font-bold ${resource.status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {resource.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 flex justify-center gap-2">
                                                <button onClick={() => openQr(resource)} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-800'}`} title="QR Code">
                                                    <QrCode className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => openModal(resource)} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-indigo-400 hover:bg-indigo-900/30' : 'text-indigo-600 hover:bg-indigo-50'}`} title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(resource.id)} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-rose-400 hover:bg-rose-900/30' : 'text-rose-600 hover:bg-rose-50'}`} title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Glassmorphism Main Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        ></motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white/20'} p-6 rounded-3xl shadow-2xl relative z-10 w-full max-w-lg border`}
                        >
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                {editingId ? 'Edit Resource' : 'Add New Resource'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Resource Name</label>
                                    <input 
                                        type="text" required
                                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Type</label>
                                        <select 
                                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                            value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                                        >
                                            <option value="HALL">Hall</option>
                                            <option value="LAB">Lab</option>
                                            <option value="ROOM">Room</option>
                                            <option value="EQUIPMENT">Equipment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Capacity</label>
                                        <input 
                                            type="number"
                                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                            value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Location</label>
                                    <input 
                                        type="text" required
                                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                        value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Status</label>
                                    <select 
                                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                        value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                                    >
                                        <option value="ACTIVE">ACTIVE - Available</option>
                                        <option value="OUT_OF_SERVICE">OUT OF SERVICE - Maintenance</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button 
                                        type="button" onClick={() => setIsModalOpen(false)}
                                        className={`flex-1 px-4 py-2.5 font-semibold rounded-xl transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
                                    >
                                        {editingId ? 'Save Changes' : 'Create Resource'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* QR Modal Overlay */}
            <AnimatePresence>
                {isQrModalOpen && qrResource && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                            onClick={() => setIsQrModalOpen(false)}
                        ></motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-white p-8 rounded-3xl shadow-2xl relative z-10 flex flex-col items-center border border-white"
                        >
                            <button 
                                onClick={() => setIsQrModalOpen(false)} 
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-xl font-bold text-slate-800 mb-2">Scan Resource</h2>
                            <p className="text-sm text-slate-500 mb-6 text-center">{qrResource.name}</p>

                            <div className="p-4 bg-white border border-slate-100 shadow-sm rounded-2xl">
                                <QRCodeCanvas 
                                    value={JSON.stringify({id: qrResource.id, type: qrResource.type, location: qrResource.location})} 
                                    size={200} 
                                    bgColor={"#ffffff"}
                                    fgColor={"#0f172a"}
                                    level={"H"}
                                />
                            </div>

                            <div className="mt-6 text-center space-y-1">
                                <span className="block text-xs font-bold text-indigo-500 tracking-widest uppercase">{qrResource.type}</span>
                                <span className="block text-sm text-slate-600">ID: {qrResource.id}</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminResourceManager;
