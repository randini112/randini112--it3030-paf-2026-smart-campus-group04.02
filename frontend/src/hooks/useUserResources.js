import { useState, useCallback } from 'react';
import resourceService from '../services/resourceService';

export const useUserResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageInfo, setPageInfo] = useState({
        page: 0,
        size: 12,
        totalPages: 0,
        totalElements: 0
    });

    const fetchFilteredResources = useCallback(async (filters = {}, page = 0, size = 12, sort = 'name,asc') => {
        setLoading(true);
        setError(null);
        try {
            const data = await resourceService.getAllResources(page, size, sort, filters);
            setResources(data.content);
            setPageInfo({
                page: data.pageable?.pageNumber || 0,
                size: data.pageable?.pageSize || 12,
                totalPages: data.totalPages,
                totalElements: data.totalElements
            });
        } catch (err) {
            setError(err.message || 'Failed to connect to the server');
            console.error("Error fetching user resources:", err);
            // setResources([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        resources,
        loading,
        error,
        pageInfo,
        fetchFilteredResources
    };
};
