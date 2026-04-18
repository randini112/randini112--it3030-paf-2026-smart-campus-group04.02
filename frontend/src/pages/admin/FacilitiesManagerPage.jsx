import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminResources } from '../../hooks/useAdminResources';
import { useActivityLog } from '../../hooks/useActivityLog';
import { ActivityLog } from '../../components/admin/ActivityLog';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { motion } from 'framer-motion';
import { 
  Building2, MapPin, Users, DoorOpen, PlusCircle, Activity, 
  AlertCircle, Package, Pencil, Trash2, Power, PowerOff, LayoutDashboard, Eye, 
  Download, CheckSquare, Square
} from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

const FacilitiesManagerPage = () => {
    const navigate = useNavigate();
    const { addLog } = useActivityLog();
    const {
        resources, loading, error, pageInfo, fetchResources, toggleStatus, deleteResource
    } = useAdminResources();

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Bulk Operations State
    const [selectedIds, setSelectedIds] = useState(new Set());

    useEffect(() => {fetchResources(0, 50, 'id,desc');}, [fetchResources]);

    const activeCount = resources.filter(r => r.status === 'ACTIVE').length;
    const maintenanceCount = resources.filter(r => r.status === 'OUT_OF_SERVICE').length;

    // --- Bulk operation handlers ---
    const toggleSelect = (e, id) => {
        e.stopPropagation();
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === resources.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(resources.map(r => r.id)));
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedIds.size} resources?`)) return;
        setIsProcessing(true);
        let successCount = 0;
        for (let id of selectedIds) {
            const res = await deleteResource(id);
            if (res.success) successCount++;
        }
        setIsProcessing(false);
        setSelectedIds(new Set());
        if (successCount > 0) toast.success(`Deleted ${successCount} resources`);
        addLog(`Bulk deleted ${successCount} items`, 'Multiple', 'delete');
    };

    const handleBulkToggle = async () => {
        setIsProcessing(true);
        let successCount = 0;
        for (let id of selectedIds) {
            const resource = resources.find(r => r.id === id);
            const res = await toggleStatus(id, resource.status);
            if (res.success) successCount++;
        }
        setIsProcessing(false);
        setSelectedIds(new Set());
        if (successCount > 0) toast.success(`Updated status for ${successCount} resources`);
        addLog(`Bulk updated ${successCount} items`, 'Multiple', 'update');
    };

    const exportToCSV = () => {
        const headers = ['ID,Name,Type,Capacity,Building,Floor,Location,Status\n'];
        const dataToExport = selectedIds.size > 0 ? resources.filter(r => selectedIds.has(r.id)) : resources;
        
        const rows = dataToExport.map(r => {
            return `${r.id},"${r.name}",${r.type},${r.capacity || ''},"${r.building || ''}","${r.floor || ''}","${r.location}",${r.status}\n`;
        });
        
        const blob = new Blob([headers, ...rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resources_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("CSV Export downloaded");
    };

    const handleDeleteClick = (e, resource) => {
        e.stopPropagation();
        setResourceToDelete(resource);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!resourceToDelete) return;
        setIsProcessing(true);
        const result = await deleteResource(resourceToDelete.id);
        setIsProcessing(false);
        
        if (result.success) {
            addLog('Deleted resource', resourceToDelete.name, 'delete');
            toast.success("Facility deleted", { description: `${resourceToDelete.name} has been removed.` });
            setIsDeleteOpen(false);
            setResourceToDelete(null);
        } else {
            toast.error("Failed to delete", { description: result.error });
        }
    };

    const handleToggleStatus = async (e, resource) => {
        e.stopPropagation();
        const toggleResult = await toggleStatus(resource.id, resource.status);
        if (toggleResult.success) {
            const newStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
            addLog(`Changed status to ${newStatus}`, resource.name, 'update');
            toast.success("Status Updated");
        } else {
            toast.error("Failed to update status");
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col xl:flex-row gap-6">
            
            {/* Main Content Area */}
            <div className="flex-1 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Facilities Hub</h1>
                    <p className="text-slate-500 mt-1">Manage and provision campus assets.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={exportToCSV} variant="outline" className="border-slate-200">
                            <Download className="mr-2 h-4 w-4" /> Export CSV
                        </Button>
                        <Button onClick={() => navigate('/admin/dashboard')} variant="outline" className="border-slate-200">
                            <LayoutDashboard className="mr-2 h-4 w-4" /> Analytics
                        </Button>
                        <Button onClick={() => navigate('/admin/facilities/new')} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Resource
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Total Resources</CardTitle>
                            <Package className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{resources.length}</div></CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Active Facilities</CardTitle>
                            <Activity className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold text-green-600">{activeCount}</div></CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Under Maintenance</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold text-red-600">{maintenanceCount}</div></CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex justify-between items-center h-16">
                        {selectedIds.size > 0 ? (
                            <div className="flex items-center gap-4 w-full">
                                <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                                    {selectedIds.size} Selected
                                </span>
                                <Button size="sm" variant="outline" onClick={handleBulkToggle} disabled={isProcessing}>
                                    <Power className="mr-2 h-4 w-4" /> Toggle Status
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={handleBulkDelete} disabled={isProcessing}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Selection
                                </Button>
                            </div>
                        ) : (
                            <h3 className="font-semibold text-lg text-slate-800 tracking-tight">Resource Database</h3>
                        )}
                    </div>
                    {error && <div className="p-4 bg-red-50 text-red-600 font-medium">{error}</div>}
                    <div className="relative w-full overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead className="w-12 text-center">
                                        <button onClick={toggleSelectAll} className="text-slate-400 hover:text-blue-600">
                                            {selectedIds.size === resources.length && resources.length > 0 ? <CheckSquare className="mx-auto" size={18} /> : <Square className="mx-auto" size={18} />}
                                        </button>
                                    </TableHead>
                                    <TableHead className="w-[280px]">Resource Details</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={5} className="h-32 text-center">Loading...</TableCell></TableRow>
                                ) : resources.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="h-40 text-center text-slate-500">No resources found.</TableCell></TableRow>
                                ) : (
                                    resources.map((resource) => (
                                        <TableRow 
                                            key={resource.id} 
                                            onClick={() => navigate(`/admin/facilities/${resource.id}`)}
                                            className={`border-slate-200 cursor-pointer group transition-colors ${selectedIds.has(resource.id) ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50/80'}`}
                                        >
                                            <TableCell className="text-center" onClick={(e) => toggleSelect(e, resource.id)}>
                                                {selectedIds.has(resource.id) ? 
                                                    <CheckSquare className="mx-auto text-blue-600" size={18} /> : 
                                                    <Square className="mx-auto text-slate-300 group-hover:text-slate-400" size={18} />
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-slate-900 block">{resource.name}</span>
                                                <span className="text-xs text-slate-500">{resource.location}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-slate-100">{resource.type}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-slate-700 text-sm">
                                                    <Users className="h-3 w-3 mr-1.5 opacity-70" />
                                                    <span>{resource.capacity || 'N/A'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={resource.status === 'ACTIVE' ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}>
                                                    {resource.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); navigate(`/admin/facilities/${resource.id}`); }} className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={(e) => handleToggleStatus(e, resource)} className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50">
                                                        <Power className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); navigate(`/admin/facilities/${resource.id}/edit`); }} className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={(e) => handleDeleteClick(e, resource)} className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>

            {/* Sidebar Activity Panel */}
            <div className="w-full xl:w-80 h-[500px] xl:h-[calc(100vh-8rem)] shrink-0">
                <ActivityLog />
            </div>

            <DeleteConfirmModal
                isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete} resourceName={resourceToDelete?.name} isDeleting={isProcessing}
            />
        </motion.div>
    );
};

export default FacilitiesManagerPage;
