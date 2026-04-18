import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminResources } from '../../hooks/useAdminResources';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Search, PlusCircle, Activity, 
  AlertCircle, Pencil, Trash2, Power, Eye, 
  QrCode, ShieldCheck, Download, Layers
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"

const EquipmentManagerPage = () => {
    const navigate = useNavigate();
    // Use the admin hook but we will filter it down to equipment only
    const { resources, loading, error, fetchResources } = useAdminResources();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    useEffect(() => {
        // Fetch all resources. We will filter equipment on the client to avoid backend changes.
        fetchResources(0, 100, 'id,desc');
    }, [fetchResources]);

    // Filter logic
    const equipmentList = resources.filter(r => r.type === 'EQUIPMENT' && 
        (r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    const activeCount = equipmentList.filter(r => r.status === 'ACTIVE').length;
    const maintenanceCount = equipmentList.filter(r => r.status === 'OUT_OF_SERVICE').length;

    // Helper to extract Serial Number from description (SN: XXXXX) if it exists
    const extractSN = (desc) => {
        if (!desc) return 'N/A';
        const match = desc.match(/SN:\s*([A-Z0-9-]+)/i);
        return match ? match[1] : 'N/A';
    };

    const toggleSelect = (e, id) => {
        e.stopPropagation();
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === equipmentList.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(equipmentList.map(r => r.id)));
    };

    const handlePrintRequest = () => {
        if (selectedIds.size === 0) {
            alert("Please select at least one asset to print tags for.");
            return;
        }
        setIsPrintModalOpen(true);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-6"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/50">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Hardware & IT Assets</Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
                        <Package className="mr-3 h-8 w-8 text-orange-500" />
                        Equipment Inventory
                    </h1>
                    <p className="text-slate-500 mt-1">Track bio-lab scopes, networking gear, and A/V equipment.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-slate-200" onClick={handlePrintRequest}>
                        <QrCode className="mr-2 h-4 w-4" /> Print Asset Tags
                    </Button>
                    <Button onClick={() => navigate('/admin/facilities/new')} className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                        <PlusCircle className="mr-2 h-4 w-4" /> Register Asset
                    </Button>
                </div>
            </div>

            {/* Quick Stats Ribbon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-slate-200 shadow-sm overflow-hidden relative">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <CardContent className="p-6 relative z-10 flex items-center gap-4">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                            <Layers size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Hardware Assets</p>
                            <h3 className="text-3xl font-bold text-slate-900">{equipmentList.length}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm overflow-hidden relative">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <CardContent className="p-6 relative z-10 flex items-center gap-4">
                        <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Deployed & Active</p>
                            <h3 className="text-3xl font-bold text-slate-900">{activeCount}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm overflow-hidden relative">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-rose-100 dark:bg-rose-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <CardContent className="p-6 relative z-10 flex items-center gap-4">
                        <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">In Repair / Offline</p>
                            <h3 className="text-3xl font-bold text-slate-900">{maintenanceCount}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Table */}
            <Card className="border-slate-200 shadow-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input 
                            placeholder="Search by SN or model name..." 
                            className="pl-10 border-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="relative w-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="w-12 text-center">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-slate-300"
                                        checked={selectedIds.size === equipmentList.length && equipmentList.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="w-[80px]">Format</TableHead>
                                <TableHead className="w-[300px]">Asset Name</TableHead>
                                <TableHead>Serial Number</TableHead>
                                <TableHead>Current Location</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">Loading equipment inventory...</TableCell>
                                </TableRow>
                            ) : equipmentList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">No equipment found matching criteria.</TableCell>
                                </TableRow>
                            ) : (
                                equipmentList.map((asset) => {
                                    const serial = extractSN(asset.description);
                                    return (
                                        <TableRow key={asset.id} className={`border-slate-200 hover:bg-slate-50/80 group ${selectedIds.has(asset.id) ? 'bg-orange-50/30' : ''}`}>
                                            <TableCell className="text-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-slate-300"
                                                    checked={selectedIds.has(asset.id)}
                                                    onChange={(e) => toggleSelect(e, asset.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                                    <Package size={20} />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-slate-900 block">{asset.name}</span>
                                                <span className="text-xs text-slate-500 line-clamp-1">{asset.description?.replace(/SN:\s*[A-Z0-9-]+\.?\s*/i, '')}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <QrCode size={14} className="text-slate-400" />
                                                    <code className="text-xs bg-slate-100 px-2 py-1 rounded-md font-mono text-slate-700">
                                                        {serial}
                                                    </code>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium text-slate-700">{asset.building || 'Campus'}</span>
                                                <span className="text-xs text-slate-500 block">{asset.location}</span>
                                            </TableCell>
                                            <TableCell>
                                                {asset.status === 'ACTIVE' ? (
                                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">Deployed</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">Maintenance</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/facilities/${asset.id}`)}>
                                                        <Eye className="h-4 w-4 text-slate-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Asset Tag Print Modal */}
            <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-2xl">
                            <QrCode className="mr-3 h-6 w-6 text-slate-700" />
                            Print Format Preview
                        </DialogTitle>
                        <DialogDescription>
                            Review the generated tracking tags for the {selectedIds.size} selected assets. These can be printed on standard heavy-duty adhesive labels.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-slate-100 p-8 rounded-xl border border-dashed border-slate-300 mt-4">
                        <div id="print-area" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 shadow-sm mx-auto max-w-5xl rounded-md">
                            {equipmentList.filter(a => selectedIds.has(a.id)).map((asset) => {
                                const sn = extractSN(asset.description);
                                const qrcodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=ASS-${asset.id}-${sn}`;
                                
                                return (
                                    <div key={`tag-${asset.id}`} className="border-2 border-slate-800 rounded-lg p-4 flex gap-4 bg-white shadow-sm overflow-hidden relative">
                                        {/* Orange accent line */}
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>
                                        
                                        <div className="flex-1 min-w-0 pt-2">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Campus OpsHub</p>
                                            <h4 className="font-bold text-slate-900 text-sm leading-tight mb-2 truncate">{asset.name}</h4>
                                            
                                            <div className="space-y-1 mt-3">
                                                <div className="flex text-[10px]">
                                                    <span className="text-slate-500 w-10">SN:</span>
                                                    <span className="font-mono font-bold text-slate-800 truncate">{sn}</span>
                                                </div>
                                                <div className="flex text-[10px]">
                                                    <span className="text-slate-500 w-10">LOC:</span>
                                                    <span className="font-medium text-slate-800 truncate">{asset.building}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 shrink-0 bg-white border border-slate-200 mt-2 p-1">
                                            <img src={qrcodeUrl} alt="QR Code" className="w-full h-full object-cover mix-blend-multiply" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>Cancel</Button>
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white" onClick={() => {
                            window.print();
                            setIsPrintModalOpen(false);
                        }}>
                            Send to Printer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default EquipmentManagerPage;
