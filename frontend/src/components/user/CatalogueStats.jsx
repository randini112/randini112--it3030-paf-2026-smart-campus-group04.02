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
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
      
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 rotate-3">
          <TrendingUp size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg">Density</h3>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Live Category Split</p>
        </div>
      </div>
      <div className="relative z-10 h-[220px] w-full overflow-hidden">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <BarChart data={chartData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.2} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} 
              stroke="transparent" 
              tickFormatter={(val) => val.split(' ')[0]}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: '0', 
                fontSize: '11px', 
                fontWeight: '900',
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}
              cursor={{ fill: 'rgba(59,130,246,0.03)' }}
            />
            <Bar dataKey="count" radius={[10, 10, 10, 10]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.type] || '#64748b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CatalogueStats;
