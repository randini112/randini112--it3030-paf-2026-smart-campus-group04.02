import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMaintenanceTickets } from '../../hooks/useMaintenanceTickets';
import { toast } from 'sonner';
import {
  Wrench, Plus, Trash2, Pencil, Eye, AlertTriangle, Clock, CheckCircle2,
  Search, Filter, AlertCircle, ChevronDown, Flame, ArrowUpRight, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// --- Config Maps ---
const PRIORITY_CONFIG = {
  CRITICAL: { label: 'Critical', color: 'bg-red-600 text-white', dot: 'bg-red-500', glow: 'shadow-red-500/30' },
  HIGH: { label: 'High', color: 'bg-orange-500 text-white', dot: 'bg-orange-400', glow: 'shadow-orange-500/30' },
  MEDIUM: { label: 'Medium', color: 'bg-amber-500 text-white', dot: 'bg-amber-400', glow: 'shadow-amber-500/30' },
  LOW: { label: 'Low', color: 'bg-slate-500 text-white', dot: 'bg-slate-400', glow: 'shadow-slate-500/20' },
};

const STATUS_CONFIG = {
  OPEN: { label: 'Open', icon: <AlertCircle size={14} />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  IN_PROGRESS: { label: 'In Progress', icon: <RefreshCw size={14} className="animate-spin" />, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  RESOLVED: { label: 'Resolved', icon: <CheckCircle2 size={14} />, color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
};

const PRIORITY_ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const MaintenanceTrackerPage = () => {
  const navigate = useNavigate();
  const { tickets, loading, error, pageInfo, fetchTickets, deleteTicket, updateStatus } = useMaintenanceTickets();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchTickets({ search, status: filterStatus, priority: filterPriority });
  }, [fetchTickets, search, filterStatus, filterPriority]);

  const handleDelete = async (ticket) => {
    const result = await deleteTicket(ticket.id);
    if (result.success) {
      toast.success('Ticket removed', { description: `"${ticket.title}" has been deleted.` });
      setDeleteTarget(null);
    } else {
      toast.error('Delete failed');
    }
  };

  const handleStatusChange = async (ticket, newStatus) => {
    const result = await updateStatus(ticket.id, newStatus);
    if (result.success) {
      toast.success(`Status updated to ${STATUS_CONFIG[newStatus]?.label}`);
    }
  };

  // Derived stats
  const openCount = tickets.filter(t => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;
  const criticalCount = tickets.filter(t => t.priority === 'CRITICAL').length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30 rotate-3">
              <Wrench size={20} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Maintenance Tracker</h1>
          </div>
          <p className="text-slate-500 text-sm ml-[52px]">Track and resolve facility service requests</p>
        </div>
        <Button
          onClick={() => navigate('/admin/maintenance/new')}
          className="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl h-12 px-6 font-black shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <Plus size={18} /> New Ticket
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tickets', value: pageInfo.totalElements || tickets.length, icon: <Wrench size={18} />, color: 'from-slate-700 to-slate-800' },
          { label: 'Open', value: openCount, icon: <AlertCircle size={18} />, color: 'from-blue-600 to-blue-700' },
          { label: 'In Progress', value: inProgressCount, icon: <RefreshCw size={18} />, color: 'from-amber-500 to-orange-600' },
          { label: 'Resolved', value: resolvedCount, icon: <CheckCircle2 size={18} />, color: 'from-green-600 to-emerald-700' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`bg-gradient-to-br ${stat.color} rounded-3xl p-6 text-white shadow-xl relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8" />
            <div className="relative z-10">
              <div className="mb-3 opacity-70">{stat.icon}</div>
              <p className="text-4xl font-black">{stat.value}</p>
              <p className="text-[11px] font-black uppercase tracking-widest opacity-70 mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl"
        >
          <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center text-white shrink-0">
            <Flame size={20} />
          </div>
          <div className="flex-1">
            <p className="font-black text-red-800 dark:text-red-300">{criticalCount} CRITICAL ticket{criticalCount > 1 ? 's' : ''} require immediate attention</p>
            <p className="text-xs text-red-600 dark:text-red-400">Filter below to view critical issues first</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterPriority(filterPriority === 'CRITICAL' ? '' : 'CRITICAL')}
            className="border-red-300 text-red-700 hover:bg-red-100 rounded-xl font-black text-xs"
          >
            {filterPriority === 'CRITICAL' ? 'Clear' : 'View Critical'}
          </Button>
        </motion.div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets or facilities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
        >
          <option value="">All Priorities</option>
          {PRIORITY_ORDER.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Ticket Cards */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-slate-400" />
          </div>
          <h3 className="font-black text-xl text-slate-800 dark:text-white mb-2 tracking-tight">All Clear!</h3>
          <p className="text-slate-500 text-sm">No maintenance tickets match your filters.</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {tickets.map((ticket, index) => {
              const pc = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.LOW;
              const sc = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.OPEN;
              return (
                <motion.div
                  key={ticket.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
                  onClick={() => navigate(`/admin/maintenance/${ticket.id}`)}
                >
                  <div className="flex items-start gap-5">
                    {/* Priority Indicator */}
                    <div className={`mt-1 h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${pc.color} shadow-lg ${pc.glow}`}>
                      <AlertTriangle size={16} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-black text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-amber-600 transition-colors truncate">
                          {ticket.title}
                        </h3>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${sc.color}`}>
                          {sc.icon} {sc.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate mb-3">{ticket.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          {ticket.facilityName}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={11} /> {ticket.reportedDate}
                        </span>
                        {ticket.assignedTo !== 'Unassigned' && (
                          <span className="flex items-center gap-1.5 text-blue-500">
                            → {ticket.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={e => e.stopPropagation()}
                    >
                      {/* Status quick-toggle */}
                      {ticket.status !== 'RESOLVED' && (
                        <Button
                          variant="ghost" size="icon"
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(ticket, ticket.status === 'OPEN' ? 'IN_PROGRESS' : 'RESOLVED'); }}
                          className="h-9 w-9 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl"
                          title={ticket.status === 'OPEN' ? 'Mark In Progress' : 'Mark Resolved'}
                        >
                          <CheckCircle2 size={16} />
                        </Button>
                      )}
                      <Button
                        variant="ghost" size="icon"
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/maintenance/${ticket.id}/edit`); }}
                        className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${ticket.title}"?`)) handleDelete(ticket);
                        }}
                        className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/maintenance/${ticket.id}`); }}
                        className="h-9 w-9 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl"
                      >
                        <ArrowUpRight size={16} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default MaintenanceTrackerPage;
