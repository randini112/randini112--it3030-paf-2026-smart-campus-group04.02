import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const COLORS = {
  HALL: '#3b82f6',
  LAB: '#a855f7',
  MEETING_ROOM: '#14b8a6',
  EQUIPMENT: '#f97316'
};

const LABELS = {
  HALL: 'Lecture Halls',
  LAB: 'Laboratories',
  MEETING_ROOM: 'Meeting Rooms',
  EQUIPMENT: 'Equipment'
};

const CatalogueStats = ({ resources }) => {
  // Count resources by type
  const typeCounts = resources.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(typeCounts).map(([type, count]) => ({
    name: LABELS[type] || type,
    count,
    type
  }));

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
          <TrendingUp size={18} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Resource Breakdown</h3>
          <p className="text-xs text-slate-500">Distribution by category from current results</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }}
            cursor={{ fill: 'rgba(59,130,246,0.05)' }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.type] || '#64748b'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CatalogueStats;
