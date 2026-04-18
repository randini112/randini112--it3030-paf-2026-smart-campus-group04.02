import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'smartcampus_activity_logs';

export const useActivityLog = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const storedLogs = localStorage.getItem(STORAGE_KEY);
        if (storedLogs) {
            setLogs(JSON.parse(storedLogs));
        }
    }, []);

    const addLog = useCallback((action, resourceName, type = 'info') => {
        const newLog = {
            id: Date.now().toString(),
            action,
            resourceName,
            type, // 'create', 'update', 'delete', 'info'
            timestamp: new Date().toISOString()
        };
        
        setLogs(prevLogs => {
            const updated = [newLog, ...prevLogs].slice(0, 50); // Keep last 50 logs
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const clearLogs = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setLogs([]);
    }, []);

    return { logs, addLog, clearLogs };
};
