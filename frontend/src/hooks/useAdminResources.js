import { useState, useCallback } from 'react';
import resourceService from '../services/resourceService';

export const useAdminResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageInfo, setPageInfo] = useState({ page: 0, size: 50, totalPages: 0, totalElements: 0 });

    const fetchResources = useCallback(async (page = 0, size = 50, sort = 'id,desc') => {
        setLoading(true);
        setError(null);
        try {
            const data = await resourceService.getAllResources(page, size, sort);
            // Handle both Spring Boot paginated format { content: [...] } and plain array
            if (Array.isArray(data)) {
                setResources(data);
                setPageInfo({ page: 0, size: data.length, totalPages: 1, totalElements: data.length });
            } else {
                setResources(data.content || []);
                setPageInfo({
                    page: data.pageable?.pageNumber ?? 0,
                    size: data.size || size,
                    totalPages: data.totalPages || 1,
                    totalElements: data.totalElements || 0
                });
            }
        } catch (err) {
            console.error('Error fetching resources:', err);
            setError('Failed to fetch resources. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    const createResource = async (resourceData) => {
        try {
            await resourceService.createResource(resourceData);
            await fetchResources(pageInfo.page, pageInfo.size);
            return { success: true };
        } catch (err) {
            console.error('Error creating resource:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to create resource.' };
        }
    };

    const updateResource = async (id, resourceData) => {
        try {
            await resourceService.updateResource(id, resourceData);
            await fetchResources(pageInfo.page, pageInfo.size);
            return { success: true };
        } catch (err) {
            console.error('Error updating resource:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to update resource.' };
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
        // Optimistic UI update — immediately reflect change in the table
        setResources(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        try {
            await resourceService.updateResourceStatus(id, newStatus);
            return { success: true };
        } catch (err) {
            // Rollback on failure
            setResources(prev => prev.map(r => r.id === id ? { ...r, status: currentStatus } : r));
            console.error('Error toggling status:', err);
            return { success: false, error: 'Failed to update status.' };
        }
    };

    const deleteResource = async (id) => {
        try {
            await resourceService.deleteResource(id);
            // Optimistic UI: remove from list immediately without a round-trip fetch
            setResources(prev => prev.filter(r => r.id !== id));
            setPageInfo(prev => ({ ...prev, totalElements: prev.totalElements - 1 }));
            return { success: true };
        } catch (err) {
            console.error('Error deleting resource:', err);
            return { success: false, error: 'Failed to delete resource.' };
        }
    };

    return {
        resources,
        loading,
        error,
        pageInfo,
        fetchResources,
        createResource,
        updateResource,
        toggleStatus,
        deleteResource
    };
};
