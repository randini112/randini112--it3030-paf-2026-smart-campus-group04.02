import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import maintenanceService from '../../services/maintenanceService';
import { useMaintenanceTickets } from '../../hooks/useMaintenanceTickets';
import { toast } from 'sonner';
import {
  ArrowLeft, Wrench, CheckCircle2, RefreshCw, AlertCircle,
  Building2, Calendar, User2, Flame, Pencil, Trash2, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRIORITY_CONFIG = {
  CRITICAL: { label: 'Critical', color: 'from-red-600 to-rose-700', badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  HIGH: { label: 'High', color: 'from-orange-500 to-amber-600', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  MEDIUM: { label: 'Medium', color: 'from-amber-400 to-yellow-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  LOW: { label: 'Low', color: 'from-slate-500 to-slate-600', badge: 'bg-slate-100 text-slate-600' },
};

const STATUS_CONFIG = {
  OPEN: { label: 'Open', icon: <AlertCircle size={16} />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  IN_PROGRESS: { label: 'In Progress', icon: <RefreshCw size={16} className="animate-spin" />, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  RESOLVED: { label: 'Resolved', icon: <CheckCircle2 size={16} />, color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
};

const TIMELINE = [
  { status: 'OPEN', label: 'Reported', icon: <AlertCircle size={16} /> },
  { status: 'IN_PROGRESS', label: 'In Progress', icon: <RefreshCw size={16} /> },
  { status: 'RESOLVED', label: 'Resolved', icon: <CheckCircle2 size={16} /> },
];
const STATUS_ORDER = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

const MaintenanceDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateStatus, deleteTicket } = useMaintenanceTickets();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    maintenanceService.getTicketById(id).then(t => {
      setTicket(t);
      setLoading(false);
    });
  }, [id]);

  const handleStatusAdvance = async () => {
    const currentIdx = STATUS_ORDER.indexOf(ticket.status);
    if (currentIdx >= STATUS_ORDER.length - 1) return;
    const nextStatus = STATUS_ORDER[currentIdx + 1];
    const result = await updateStatus(id, nextStatus);
    if (result.success) {
      setTicket(prev => ({ ...prev, status: nextStatus }));
      toast.success(`Status advanced to "${STATUS_CONFIG[nextStatus]?.label}"`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete "${ticket?.title}"?`)) return;
    const result = await deleteTicket(id);
    if (result.success) {
      toast.success('Ticket deleted.');
      navigate('/admin/maintenance');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="h-12 w-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
    </div>
  );

  if (!ticket) return (
    <div className="text-center py-24">
      <h3 className="font-black text-xl text-slate-800 dark:text-white">Ticket not found</h3>
      <Button onClick={() => navigate('/admin/maintenance')} className="mt-6">Back to Tracker</Button>
    </div>
  );

  const pc = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.LOW;
  const sc = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.OPEN;
  const currentStatusIdx = STATUS_ORDER.indexOf(ticket.status);
  const canAdvance = currentStatusIdx < STATUS_ORDER.length - 1;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">

      {/* Back */}
      <button
        onClick={() => navigate('/admin/maintenance')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white text-sm font-bold transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Tracker
      </button>

      {/* Hero Card */}
      <div className={`bg-gradient-to-br ${pc.color} rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Wrench size={28} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Maintenance Ticket</span>
                <p className="text-xs font-black text-white/60 uppercase tracking-widest"># {ticket.id}</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest ${sc.color}`}>
              {sc.icon} {sc.label}
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-3">{ticket.title}</h1>
          <p className="text-white/70 leading-relaxed">{ticket.description}</p>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Progress</h3>
        <div className="flex items-center gap-0">
          {TIMELINE.map((step, i) => {
            const isCompleted = STATUS_ORDER.indexOf(ticket.status) >= i;
            const isCurrent = ticket.status === step.status;
            return (
              <React.Fragment key={step.status}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                    isCompleted ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  } ${isCurrent ? 'ring-4 ring-amber-500/30 scale-110' : ''}`}>
                    {step.icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-amber-500' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
                {i < TIMELINE.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full mx-2 transition-all ${STATUS_ORDER.indexOf(ticket.status) > i ? 'bg-amber-500' : 'bg-slate-100 dark:bg-slate-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {canAdvance && (
          <Button
            onClick={handleStatusAdvance}
            className="mt-8 w-full bg-amber-500 hover:bg-amber-600 text-white rounded-2xl h-12 font-black shadow-lg shadow-amber-500/20"
          >
            <RefreshCw size={18} className="mr-2" />
            Advance to "{STATUS_CONFIG[STATUS_ORDER[currentStatusIdx + 1]]?.label}"
          </Button>
        )}
        {!canAdvance && (
          <div className="mt-8 flex items-center justify-center gap-3 text-green-600 font-black text-sm">
            <CheckCircle2 size={20} /> This ticket is fully resolved
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: <Building2 className="text-blue-500" size={18} />, label: 'Facility', value: ticket.facilityName },
          { icon: <Flame className="text-red-500" size={18} />, label: 'Priority', value: ticket.priority },
          { icon: <User2 className="text-purple-500" size={18} />, label: 'Assigned To', value: ticket.assignedTo || 'Unassigned' },
          { icon: <Clock className="text-slate-500" size={18} />, label: 'Reported', value: ticket.reportedDate },
          { icon: <Calendar className="text-green-500" size={18} />, label: 'Est. Resolution', value: ticket.estimatedDate || 'TBD' },
          { icon: <User2 className="text-teal-500" size={18} />, label: 'Reported By', value: ticket.reportedBy || 'N/A' },
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              {item.icon}
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
            </div>
            <p className="font-black text-slate-800 dark:text-white text-sm">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={() => navigate(`/admin/maintenance/${ticket.id}/edit`)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 font-black shadow-lg"
        >
          <Pencil size={18} className="mr-2" /> Edit Ticket
        </Button>
        <Button
          variant="outline"
          onClick={handleDelete}
          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-2xl h-14 font-black"
        >
          <Trash2 size={18} className="mr-2" /> Delete
        </Button>
      </div>
    </motion.div>
  );
};

export default MaintenanceDetailPage;
