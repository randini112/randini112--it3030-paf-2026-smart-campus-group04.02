import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivityLog } from '../../hooks/useActivityLog';
import { 
    PlusCircle, 
    Pencil, 
    Trash2, 
    Info, 
    History,
    XCircle 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; // We need date-fns, but if missing I'll write a simple formatter
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Helper for relative time if date-fns isn't available
const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.round(diffHours / 24)}d ago`;
};

export const ActivityLog = () => {
    const { logs, clearLogs } = useActivityLog();

    const getIcon = (type) => {
        switch(type) {
            case 'create': return <div className="p-1.5 bg-green-100 text-green-600 rounded-full dark:bg-green-900/30 dark:text-green-400"><PlusCircle size={14} /></div>;
            case 'update': return <div className="p-1.5 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400"><Pencil size={14} /></div>;
            case 'delete': return <div className="p-1.5 bg-red-100 text-red-600 rounded-full dark:bg-red-900/30 dark:text-red-400"><Trash2 size={14} /></div>;
            default: return <div className="p-1.5 bg-slate-100 text-slate-600 rounded-full dark:bg-slate-800 dark:text-slate-400"><Info size={14} /></div>;
        }
    };

    return (
        <Card className="h-full flex flex-col shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                    <History size={18} className="text-slate-500" />
                    <CardTitle className="text-base font-semibold">Activity Trail</CardTitle>
                </div>
                {logs.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearLogs} className="h-8 text-xs text-slate-500 hover:text-red-500">
                        Clear
                    </Button>
                )}
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                        <History size={40} className="mb-2 text-slate-400" />
                        <p className="text-sm font-medium text-slate-500">No recent activity</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800/50 relative">
                        <AnimatePresence>
                            {logs.map((log) => (
                                <motion.li 
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3"
                                >
                                    <div className="shrink-0 mt-0.5">{getIcon(log.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                                            {log.action} <span className="font-bold">'{log.resourceName}'</span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">{timeAgo(log.timestamp)}</p>
                                    </div>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};
