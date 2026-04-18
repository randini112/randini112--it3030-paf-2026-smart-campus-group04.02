import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import resourceService from '../../services/resourceService';
import { useActivityLog } from '../../hooks/useActivityLog';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ResourceFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addLog } = useActivityLog();
    const isEditMode = Boolean(id);

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditMode);
    const [formData, setFormData] = useState({
        name: '', type: 'HALL', capacity: '', location: '', building: '', floor: '',
        imageUrl: '', availStart: '08:00', availEnd: '20:00', description: '', status: 'ACTIVE'
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchResource = async () => {
                try {
                    const data = await resourceService.getResourceById(id);
                    if (data) {
                        setFormData({
                            name: data.name,
                            type: data.type,
                            capacity: data.capacity || '',
                            location: data.location || '',
                            building: data.building || '',
                            floor: data.floor || '',
                            imageUrl: data.imageUrl || '',
                            availStart: data.availStart || '08:00',
                            availEnd: data.availEnd || '20:00',
                            description: data.description || '',
                            status: data.status
                        });
                    }
                } catch (error) {
                    toast.error("Failed to load resource details");
                    navigate('/admin/facilities');
                } finally {
                    setIsFetching(false);
                }
            };
            fetchResource();
        }
    }, [id, navigate, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = { ...formData, capacity: formData.capacity ? parseInt(formData.capacity) : null };
            
            if (isEditMode) {
                await resourceService.updateResource(id, payload);
                addLog('Updated resource', formData.name, 'update');
                toast.success('Resource updated successfully');
            } else {
                await resourceService.createResource(payload);
                addLog('Created new resource', formData.name, 'create');
                toast.success('Resource created successfully');
            }
            navigate('/admin/facilities');
        } catch (error) {
            toast.error('Operation failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div></div>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto py-6">
            <Button variant="ghost" className="mb-6 text-slate-500 hover:text-slate-900" onClick={() => navigate('/admin/facilities')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
            </Button>

            <Card className="shadow-lg border-slate-200">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">{isEditMode ? 'Edit Resource' : 'Register Resource'}</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">
                            {isEditMode ? 'Update existing facility metadata' : 'Add a new facility to the campus database'}
                        </p>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Resource Name</label>
                            <input 
                                required type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g., Main Auditorium"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Category</label>
                                <select 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="HALL">Hall</option>
                                    <option value="LAB">Laboratory</option>
                                    <option value="MEETING_ROOM">Meeting Room</option>
                                    <option value="EQUIPMENT">Equipment</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Capacity (Pax)</label>
                                <input 
                                    type="number" min="1"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})}
                                    placeholder="Optional"
                                />
                            </div>
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <label className="text-sm font-semibold text-slate-700">Location (Detailed)</label>
                                <input 
                                    required type="text"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                                    placeholder="e.g., Block A, Level 1"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Building</label>
                                <input 
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})}
                                    placeholder="e.g., Block A"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Floor</label>
                                <input 
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})}
                                    placeholder="e.g., 1"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Available From</label>
                                <input 
                                    required type="time"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.availStart} onChange={e => setFormData({...formData, availStart: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Available Until</label>
                                <input 
                                    required type="time"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.availEnd} onChange={e => setFormData({...formData, availEnd: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Image URL</label>
                                <input 
                                    type="url"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                    placeholder="e.g., https://example.com/image.jpg"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea 
                                    rows="3"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                    placeholder="Provide detailed description of the facility or equipment..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Operational Status</label>
                            <select 
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="ACTIVE">ACTIVE - Ready for bookings</option>
                                <option value="OUT_OF_SERVICE">OUT OF SERVICE - Maintenance required</option>
                            </select>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-end gap-3 pt-6">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/facilities')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                            {isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Register Resource')}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </motion.div>
    );
};

export default ResourceFormPage;
