import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    byPriority: [],
    byCategory: [],
    recent: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/tickets');
      const tickets = response.data;
      
      // Calculate stats
      const byPriority = {};
      const byCategory = {};
      const byDate = {};
      
      tickets.forEach(t => {
        byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
        byCategory[t.category] = (byCategory[t.category] || 0) + 1;
        
        const date = new Date(t.createdAt).toLocaleDateString();
        byDate[date] = (byDate[date] || 0) + 1;
      });

      setStats({
        total: tickets.length,
        open: tickets.filter(t => t.status === 'Open').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED').length,
        byPriority: Object.entries(byPriority).map(([name, value]) => ({ name, value })),
        byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
        recent: tickets.slice(0, 7).map(t => ({
          date: new Date(t.createdAt).toLocaleDateString(),
          tickets: 1
        })).reverse()
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const COLORS = ['#38a169', '#dd6b20', '#e53e3e', '#9b2c2c'];
  const PRIORITY_COLORS = { Low: '#38a169', Medium: '#dd6b20', High: '#e53e3e', Critical: '#9b2c2c' };

  if (loading) return <p className="loading">Loading dashboard...</p>;

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '30px' }}>
      <h2 style={{ color: '#1e3a5f', marginBottom: '25px', fontSize: '26px', fontWeight: '600' }}>
        📊 Analytics Dashboard
      </h2>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Total Tickets', value: stats.total, color: '#1e3a5f' },
          { label: 'Open', value: stats.open, color: '#2b6cb0' },
          { label: 'In Progress', value: stats.inProgress, color: '#c05621' },
          { label: 'Resolved', value: stats.resolved, color: '#38a169' }
        ].map((card, i) => (
          <div key={i} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <p style={{ margin: '0 0 10px 0', color: '#718096', fontSize: '14px' }}>{card.label}</p>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        
        {/* Priority Distribution */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1e3a5f' }}>🚨 Priority Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={stats.byPriority} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {stats.byPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#666'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1e3a5f' }}>📁 Category Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.byCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1e3a5f" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;