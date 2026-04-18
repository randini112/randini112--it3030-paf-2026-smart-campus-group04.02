import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import maintenanceService from '../../services/maintenanceService';
import resourceService from '../../services/resourceService';
import { useMaintenanceTickets } from '../../hooks/useMaintenanceTickets';
import { toast } from 'sonner';
import { ArrowLeft, Wrench, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRIORITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

const MaintenanceFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { createTicket, updateTicket } = useMaintenanceTickets();

  const [form, setForm] = useState({
    title: '', description: '', facilityId: '', facilityName: '',
    priority: 'MEDIUM', status: 'OPEN',
    assignedTo: '', estimatedDate: ''
  });
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Load facilities for the dropdown
    resourceService.getAllResources(0, 50).then(data => {
      const list = Array.isArray(data) ? data : (data.content || []);
      setFacilities(list);
    });

    // If editing, load existing ticket
    if (isEditing) {
      setLoading(true);
      maintenanceService.getTicketById(id).then(ticket => {
        if (ticket) setForm({ ...ticket });
        setLoading(false);
      });
    }
  }, [id, isEditing]);

  const handleFacilityChange = (e) => {
    const selected = facilities.find(f => f.id === e.target.value);
    setForm(prev => ({
      ...prev,
      facilityId: selected?.id || '',
      facilityName: selected?.name || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.facilityId) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    const result = isEditing
      ? await updateTicket(id, form)
      : await createTicket(form);
    setSubmitting(false);

    if (result.success) {
      toast.success(isEditing ? 'Ticket updated!' : 'Ticket created!', {
        description: isEditing ? 'Changes have been saved.' : `"${form.title}" has been logged.`
      });
      navigate('/admin/maintenance');
    } else {
      toast.error(result.error || 'Something went wrong.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-amber-500" size={40} />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/admin/maintenance')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white text-sm font-bold mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Tracker
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white">
              <Wrench size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter">
                {isEditing ? 'Edit Ticket' : 'New Maintenance Ticket'}
              </h1>
              <p className="text-orange-100 text-sm">
                {isEditing ? 'Update service request details' : 'Log a new facility service request'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <FormField label="Issue Title *">
            <input
              type="text"
              placeholder="e.g., Projector Bulb Replacement"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              required
            />
          </FormField>

          {/* Description */}
          <FormField label="Description">
            <textarea
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
            />
          </FormField>

          {/* Facility */}
          <FormField label="Affected Facility *">
            <select
              value={form.facilityId}
              onChange={handleFacilityChange}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
              required
            >
              <option value="">Select a facility...</option>
              {facilities.map(f => (
                <option key={f.id} value={f.id}>{f.name} — {f.location}</option>
              ))}
            </select>
          </FormField>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Priority">
              <select
                value={form.priority}
                onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select
                value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </FormField>
          </div>

          {/* Assigned To & Estimated Date */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Assigned To">
              <input
                type="text"
                placeholder="e.g., Tech Team A"
                value={form.assignedTo}
                onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </FormField>
            <FormField label="Estimated Resolution">
              <input
                type="date"
                value={form.estimatedDate}
                onChange={e => setForm(p => ({ ...p, estimatedDate: e.target.value }))}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </FormField>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl h-14 font-black text-lg shadow-lg shadow-amber-500/20"
            >
              {submitting ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save size={20} className="mr-2" />}
              {isEditing ? 'Save Changes' : 'Log Ticket'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/maintenance')}
              className="rounded-2xl h-14 px-6 font-bold border-slate-200 dark:border-slate-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</label>
    {children}
  </div>
);

export default MaintenanceFormPage;
