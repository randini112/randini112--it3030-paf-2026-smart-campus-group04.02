import { useState, useCallback } from 'react';
import maintenanceService from '../services/maintenanceService';

export const useMaintenanceTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageInfo, setPageInfo] = useState({ page: 0, size: 20, totalPages: 1, totalElements: 0 });

    const fetchTickets = useCallback(async (filters = {}, page = 0, size = 20) => {
        setLoading(true);
        setError(null);
        try {
            const data = await maintenanceService.getAllTickets(page, size, filters);
            if (Array.isArray(data)) {
                setTickets(data);
                setPageInfo({ page: 0, size: data.length, totalPages: 1, totalElements: data.length });
            } else {
                setTickets(data.content || []);
                setPageInfo({
                    page: data.pageable?.pageNumber ?? 0,
                    size: data.size || size,
                    totalPages: data.totalPages ?? 1,
                    totalElements: data.totalElements ?? 0
                });
            }
        } catch (err) {
            setError('Failed to load maintenance tickets.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createTicket = async (data) => {
        try {
            const ticket = await maintenanceService.createTicket(data);
            setTickets(prev => [ticket, ...prev]);
            setPageInfo(prev => ({ ...prev, totalElements: prev.totalElements + 1 }));
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to create ticket.' };
        }
    };

    const updateTicket = async (id, data) => {
        try {
            const updated = await maintenanceService.updateTicket(id, data);
            setTickets(prev => prev.map(t => t.id === id ? updated : t));
            return { success: true };
        } catch {
            return { success: false, error: 'Failed to update ticket.' };
        }
    };

    const updateStatus = async (id, status) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        try {
            await maintenanceService.updateTicketStatus(id, status);
            return { success: true };
        } catch {
            return { success: false, error: 'Failed to update status.' };
        }
    };

    const deleteTicket = async (id) => {
        try {
            await maintenanceService.deleteTicket(id);
            setTickets(prev => prev.filter(t => t.id !== id));
            setPageInfo(prev => ({ ...prev, totalElements: prev.totalElements - 1 }));
            return { success: true };
        } catch {
            return { success: false, error: 'Failed to delete ticket.' };
        }
    };

    return { tickets, loading, error, pageInfo, fetchTickets, createTicket, updateTicket, updateStatus, deleteTicket };
};
