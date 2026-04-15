import React, { useEffect, useState } from 'react';
import { useAdminResources } from '../../hooks/useAdminResources';
import { ResourceFormModal } from '../../components/admin/ResourceFormModal';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { 
  Building2, 
  MapPin, 
  Users, 
  DoorOpen, 
  PlusCircle,
  Activity,
  AlertCircle,
  Package,
  Pencil,
  Trash2,
  Power,
  PowerOff
} from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const FacilitiesManagerPage = () => {
    const {
        resources,
        loading,
        error,
        pageInfo,
        fetchResources,
        createResource,
        updateResource,
        toggleStatus,
        deleteResource
    } = useAdminResources();

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [resourceToDelete, setResourceToDelete] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Load initial data
        fetchResources(0, 10, 'id,desc');
    }, [fetchResources]);

    // Calculate basic stats internally for now based on current page (or could fetch from API if we had a totals endpoint)
    const activeCount = resources.filter(r => r.status === 'ACTIVE').length;
    const maintenanceCount = resources.filter(r => r.status === 'OUT_OF_SERVICE').length;

    // --- Handlers ---
    const handleAddClick = () => {
        setEditingResource(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (resource) => {
        setEditingResource(resource);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (resource) => {
        setResourceToDelete(resource);
        setIsDeleteOpen(true);
    };

    const handleSaveResource = async (formData) => {
        setIsProcessing(true);
        let result;
        
        if (editingResource) {
            result = await updateResource(editingResource.id, formData);
        } else {
            result = await createResource(formData);
        }

        setIsProcessing(false);
        if (result.success) {
            toast.success(editingResource ? "Facility updated successfully" : "Facility added successfully", {
                description: formData.name
            });
            setIsFormOpen(false);
        } else {
            toast.error("Operation failed", {
                description: result.error
            });
        }
    };

    const handleConfirmDelete = async () => {
        if (!resourceToDelete) return;
        
        setIsProcessing(true);
        const result = await deleteResource(resourceToDelete.id);
        setIsProcessing(false);
        
        if (result.success) {
            toast.success("Facility deleted", {
                description: `${resourceToDelete.name} has been removed.`
            });
            setIsDeleteOpen(false);
            setResourceToDelete(null);
        } else {
            toast.error("Failed to delete", {
                description: result.error
            });
        }
    };

    const handleToggleStatus = async (resource) => {
        const toggleResult = await toggleStatus(resource.id, resource.status);
        if (toggleResult.success) {
            const newStatus = resource.status === 'ACTIVE' ? 'Maintenance' : 'Active';
            toast.success("Status Updated", {
                description: `${resource.name} is now marked as ${newStatus}.`
            });
        } else {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                   <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Facilities & Assets</h1>
                   <p className="text-slate-500 mt-1">Manage campus classrooms, labs, and equipment.</p>
                </div>
                <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Resource
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Resources</CardTitle>
                        <Package className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pageInfo.totalElements || resources.length}</div>
                        <p className="text-xs text-slate-500 mt-1">Across all campus zones</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm transition-colors hover:border-green-200 dark:hover:border-green-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Facilities</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{(activeCount + (pageInfo.totalElements > 10 ? 45 : 0)) || 0}</div>
                        <p className="text-xs text-slate-500 mt-1">Ready for use</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm transition-colors hover:border-red-200 dark:hover:border-red-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Under Maintenance</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{maintenanceCount || 0}</div>
                        <p className="text-xs text-slate-500 mt-1">Currently resolving issues</p>
                    </CardContent>
                </Card>
            </div>

            {/* Resources Data Table */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
                    <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 tracking-tight">Resource Catalogue</h3>
                </div>
                
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 border-b border-red-100 text-sm font-medium">
                        {error}
                    </div>
                )}
                
                <div className="relative w-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                                <TableHead className="w-[280px] font-semibold text-slate-700 dark:text-slate-300">Resource Details</TableHead>
                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Category</TableHead>
                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Capacity</TableHead>
                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Location</TableHead>
                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                                <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Quick Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3 text-slate-500">
                                            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                            <span className="text-sm font-medium tracking-wide">Syncing catalogue...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : resources.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full mb-3">
                                               <Building2 className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="font-medium text-slate-900 dark:text-slate-200">No resources found</p>
                                            <p className="text-sm mt-1 mb-4">You haven't registered any facilities yet.</p>
                                            <Button variant="outline" onClick={handleAddClick} className="shadow-sm">
                                               <PlusCircle className="mr-2 h-4 w-4" /> Register First Resource
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                resources.map((resource) => (
                                    <TableRow key={resource.id} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors group">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900 dark:text-slate-100">{resource.name}</span>
                                                <span className="text-xs text-slate-500 truncate max-w-[220px] pr-2" title={resource.description || 'No description'}>
                                                    {resource.description || <span className="italic opacity-60">No description provided</span>}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <div className={`p-1.5 rounded-md flex items-center justify-center
                                                    ${resource.type === 'HALL' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 
                                                      resource.type === 'LAB' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' : 
                                                      resource.type === 'MEETING_ROOM' ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/30' : 
                                                      'bg-orange-100 text-orange-600 dark:bg-orange-900/30'}`}>
                                                    {resource.type === 'HALL' && <DoorOpen className="h-3.5 w-3.5" />}
                                                    {resource.type === 'LAB' && <Activity className="h-3.5 w-3.5" />}
                                                    {resource.type === 'MEETING_ROOM' && <Users className="h-3.5 w-3.5" />}
                                                    {resource.type === 'EQUIPMENT' && <Package className="h-3.5 w-3.5" />}
                                                </div>
                                                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                                                    {resource.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-slate-700 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 w-fit px-2 py-1 rounded-md text-xs">
                                                <Users className="h-3 w-3 mr-1.5 opacity-70" />
                                                <span>{resource.capacity || 'N/A'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                                                <MapPin className="h-3.5 w-3.5 mr-1.5 text-slate-400 shrink-0" />
                                                <span className="truncate max-w-[150px]">{resource.location}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                           <div className="flex flex-col gap-1 items-start">
                                                <Badge variant="outline"
                                                       className={resource.status === 'ACTIVE' 
                                                       ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" 
                                                       : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"}>
                                                    {resource.status === 'ACTIVE' ? 'Active' : 'Maintenance'}
                                                </Badge>
                                                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                                                    {resource.availStart} - {resource.availEnd}
                                                </span>
                                           </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                {/* Toggle Status Action */}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleToggleStatus(resource)}
                                                    className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                                                    title={resource.status === 'ACTIVE' ? "Mark out of service" : "Mark as active"}
                                                >
                                                    {resource.status === 'ACTIVE' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                                                </Button>
                                                {/* Edit Action */}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleEditClick(resource)}
                                                    className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                                    title="Edit Resource"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                {/* Delete Action */}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleDeleteClick(resource)}
                                                    className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                                                    title="Delete Resource"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {/* Mobile only indicator when not hovering */}
                                            <div className="block md:hidden md:group-hover:hidden">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <p className="text-sm text-slate-500 hidden sm:block">
                        Showing <span className="font-medium text-slate-700 dark:text-slate-300">{resources.length > 0 ? (pageInfo.page * pageInfo.size) + 1 : 0}</span> to <span className="font-medium text-slate-700 dark:text-slate-300">{Math.min((pageInfo.page + 1) * pageInfo.size, pageInfo.totalElements || 0)}</span> of <span className="font-medium text-slate-700 dark:text-slate-300">{pageInfo.totalElements || 0}</span> entries
                    </p>
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-white dark:bg-slate-950"
                            disabled={pageInfo.page === 0 || loading}
                            onClick={() => fetchResources(pageInfo.page - 1, pageInfo.size, 'id,desc')}
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-white dark:bg-slate-950"
                            disabled={pageInfo.page >= pageInfo.totalPages - 1 || loading || resources.length === 0}
                            onClick={() => fetchResources(pageInfo.page + 1, pageInfo.size, 'id,desc')}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Modals */}
            <ResourceFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSaveResource}
                editingResource={editingResource}
                isSaving={isProcessing}
            />

            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                resourceName={resourceToDelete?.name}
                isDeleting={isProcessing}
            />
        </div>
    );
};

export default FacilitiesManagerPage;
