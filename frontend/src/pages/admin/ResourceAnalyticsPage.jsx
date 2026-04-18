import React, { useEffect, useState } from 'react';
import { useAdminResources } from '../../hooks/useAdminResources';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Activity, Database, DoorOpen, Package, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

const ResourceAnalyticsPage = () => {
    const { resources, fetchResources, loading } = useAdminResources();
    const [stats, setStats] = useState({ total: 0, active: 0, capacity: 0 });

    useEffect(() => {
        fetchResources(0, 100); // Fetch a large batch for analytics
    }, [fetchResources]);

    useEffect(() => {
        if (resources.length > 0) {
            setStats({
                total: resources.length,
                active: resources.filter(r => r.status === 'ACTIVE').length,
                capacity: resources.reduce((acc, r) => acc + (r.capacity || 0), 0)
            });
        }
    }, [resources]);

    // Data for Distribution Pie
    const distributionData = React.useMemo(() => {
        const counts = resources.reduce((acc, r) => {
            acc[r.type] = (acc[r.type] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    }, [resources]);

    // Data for Top Capacity
    const capacityData = React.useMemo(() => {
        return [...resources]
            .filter(r => r.capacity)
            .sort((a,b) => b.capacity - a.capacity)
            .slice(0, 5);
    }, [resources]);

    if (loading) {
        return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div></div>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-slate-500 mt-1">Real-time usage and capacity analytics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Infrastructure</CardTitle>
                        <Database className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total}</div>
                        <p className="text-xs text-slate-500">Registered assets</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Facilities</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.active}</div>
                        <p className="text-xs text-slate-500">Currently operational</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Global Capacity</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{stats.capacity}</div>
                        <p className="text-xs text-slate-500">Maximum occupants</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-slate-200 overflow-hidden shadow-sm">
                    <CardHeader className="bg-slate-50/50">
                        <CardTitle className="text-base">Resource Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 overflow-hidden shadow-sm">
                    <CardHeader className="bg-slate-50/50">
                        <CardTitle className="text-base">Top Capacity Venues</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={capacityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 12}} />
                                <YAxis tick={{fontSize: 12}} />
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="capacity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default ResourceAnalyticsPage;
