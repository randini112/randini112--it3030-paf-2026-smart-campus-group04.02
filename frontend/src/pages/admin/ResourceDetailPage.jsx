import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import resourceService from '../../services/resourceService';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { 
    ArrowLeft, MapPin, Users, Activity, Edit, Trash2, ShieldCheck, DoorOpen, Package 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const ResourceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const data = await resourceService.getResourceById(id);
                setResource(data);
            } catch (err) {
                toast.error("Resource not found");
                navigate('/admin/facilities');
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            try {
                await resourceService.deleteResource(id);
                toast.success("Resource deleted");
                navigate('/admin/facilities');
            } catch (err) {
                toast.error("Failed to delete resource");
            }
        }
    };

    if (loading) {
        return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div></div>;
    }

    if (!resource) return null;

    const qrPayload = JSON.stringify({ id: resource.id, type: resource.type, loc: resource.location });

    const getIcon = () => {
        switch(resource.type) {
            case 'HALL': return <DoorOpen className="h-8 w-8 text-blue-500" />;
            case 'LAB': return <Activity className="h-8 w-8 text-purple-500" />;
            case 'EQUIPMENT': return <Package className="h-8 w-8 text-orange-500" />;
            default: return <Users className="h-8 w-8 text-teal-500" />;
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto py-6 space-y-6">
            
            {/* Nav and Actions */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <Button variant="ghost" className="text-slate-500 w-fit" onClick={() => navigate('/admin/facilities')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Directory
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-slate-200 text-blue-600 hover:bg-blue-50" onClick={() => navigate(`/admin/facilities/${id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                    </Button>
                    <Button variant="outline" className="border-slate-200 text-red-600 hover:bg-red-50" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </div>

            {/* Hero Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500"></div>
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            {getIcon()}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{resource.name}</h1>
                                <Badge variant="outline" className={resource.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}>
                                    {resource.status}
                                </Badge>
                            </div>
                            <p className="text-slate-500 font-medium">Type: {resource.type}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Details */}
            <div className="grid md:grid-cols-3 gap-6">
                
                {/* Specs */}
                <Card className="md:col-span-2 border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-6 text-slate-800">Operational Specifications</h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-1 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="flex items-center text-slate-500 mb-1"><MapPin size={16} className="mr-2" /> Global Location</span>
                                <span className="font-semibold text-slate-800 text-base block">{resource.location}</span>
                            </div>
                            <div className="space-y-1 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="flex items-center text-slate-500 mb-1"><Users size={16} className="mr-2" /> Max Capacity</span>
                                <span className="font-semibold text-slate-800 text-base block">{resource.capacity ? `${resource.capacity} Occupants` : 'N/A'}</span>
                            </div>
                            <div className="space-y-1 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 sm:col-span-2">
                                <span className="flex items-center text-slate-500 mb-1"><ShieldCheck size={16} className="mr-2" /> System ID Reference</span>
                                <span className="font-mono bg-white px-2 py-1 border border-slate-200 rounded text-slate-600 block w-fit mt-1">{resource.id}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* QR Code */}
                <Card className="border-slate-200 shadow-sm flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-slate-50">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Scan Identifier</h3>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <QRCodeCanvas value={qrPayload} size={150} level="H" />
                    </div>
                    <p className="text-xs text-center text-slate-400 mt-4 max-w-[200px]">
                        Scan this code at the facility entrance to view digital records.
                    </p>
                </Card>

            </div>

        </motion.div>
    );
};

export default ResourceDetailPage;
