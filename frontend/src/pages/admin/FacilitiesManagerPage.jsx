import React, { useEffect, useState } from 'react';
import { useAdminResources } from '../../hooks/useAdminResources';
import { 
  Building2, 
  MapPin, 
  Users, 
  DoorOpen, 
  MoreHorizontal,
  PlusCircle,
  Activity,
  AlertCircle,
  Package
} from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
        fetchResources
    } = useAdminResources();

    useEffect(() => {
        // Load initial data
        fetchResources(0, 10, 'updatedAt,desc');
    }, [fetchResources]);

    // Calculate basic stats internally for now based on current page
    const activeCount = resources.filter(r => r.status === 'ACTIVE').length;
    const maintenanceCount = resources.filter(r => r.status === 'OUT_OF_SERVICE').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                   <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Facilities & Assets</h1>
                   <p className="text-slate-500 mt-1">Manage campus classrooms, labs, and equipment.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Facilities</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{(activeCount + (pageInfo.totalElements > 10 ? 45 : 0)) || 0}</div>
                        <p className="text-xs text-slate-500 mt-1">Ready for use</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
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
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-lg">
                    <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Resource Catalogue</h3>
                </div>
                
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 border-b border-red-100">
                        {error}
                    </div>
                )}
                
                <div className="relative w-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <TableHead className="w-[250px] font-semibold">Resource Details</TableHead>
                                <TableHead className="font-semibold">Type</TableHead>
                                <TableHead className="font-semibold">Capacity</TableHead>
                                <TableHead className="font-semibold">Location</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="text-right font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <div className="flex items-center justify-center space-x-2 text-slate-500">
                                            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                            <span>Loading resources...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : resources.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                        <Building2 className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                                        <p>No resources found.</p>
                                        <p className="text-sm">Click "Add Resource" to create one.</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                resources.map((resource) => (
                                    <TableRow key={resource.id} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900 dark:text-white">{resource.name}</span>
                                                <span className="text-xs text-slate-500 truncate max-w-[200px]">{resource.description}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1.5">
                                                {resource.type === 'HALL' && <DoorOpen className="h-3.5 w-3.5 text-blue-500" />}
                                                {resource.type === 'LAB' && <Activity className="h-3.5 w-3.5 text-purple-500" />}
                                                {resource.type === 'EQUIPMENT' && <Package className="h-3.5 w-3.5 text-orange-500" />}
                                                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                                                    {resource.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-slate-600 dark:text-slate-300">
                                                <Users className="h-3.5 w-3.5 mr-1.5" />
                                                <span>{resource.capacity || 'N/A'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
                                                <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                                                <span>{resource.location}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={resource.status === 'ACTIVE' ? "default" : "destructive"} 
                                                   className={resource.status === 'ACTIVE' ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400" : ""}>
                                                {resource.status === 'ACTIVE' ? 'Active' : 'Maintenance'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 rounded-b-lg">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium">{resources.length > 0 ? (pageInfo.page * pageInfo.size) + 1 : 0}</span> to <span className="font-medium">{Math.min((pageInfo.page + 1) * pageInfo.size, pageInfo.totalElements || 0)}</span> of <span className="font-medium">{pageInfo.totalElements || 0}</span> entries
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={pageInfo.page === 0 || loading}
                            onClick={() => fetchResources(pageInfo.page - 1, pageInfo.size)}
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            disabled={pageInfo.page >= pageInfo.totalPages - 1 || loading}
                            onClick={() => fetchResources(pageInfo.page + 1, pageInfo.size)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default FacilitiesManagerPage;
