import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';

// 🔹 Skeleton Loader Component
const TableSkeleton = ({ rows = 5 }) => (
  <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', padding: '12px' }}>
    {[...Array(rows)].map((_, i) => (
      <div key={i} style={{ 
        padding: '12px', 
        borderBottom: i < rows - 1 ? '1px solid #e2e8f0' : 'none',
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
      }}>
        {[...Array(5)].map((_, j) => (
          <div key={j} style={{
            height: '16px',
            background: 'linear-gradient(90deg, #edf2f7 25%, #e2e8f0 50%, #edf2f7 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px',
            flex: 1,
            maxWidth: `${Math.random() * 40 + 60}%`
          }} />
        ))}
      </div>
    ))}
  </div>
);

function TicketList() {
  const { darkMode } = useTheme();
  const { t, lang } = useLanguage();
  
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch tickets when component loads
  useEffect(() => {
    fetchTickets();
  }, []);

  // Apply filters whenever filters or tickets change
  useEffect(() => {
    applyFilters();
  }, [tickets, searchTerm, statusFilter, priorityFilter, sortBy]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/tickets');
      setTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...tickets];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(term) ||
        ticket.description.toLowerCase().includes(term)
      );
    }
    
    // Status filter
    if (statusFilter) {
      result = result.filter(ticket => ticket.status === statusFilter);
    }
    
    // Priority filter
    if (priorityFilter) {
      result = result.filter(ticket => ticket.priority === priorityFilter);
    }
    
    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'priority') {
      const priorityOrder = { 'Critical': 1, 'High': 2, 'Medium': 3, 'Low': 4 };
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    
    setFilteredTickets(result);
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/tickets/${ticketId}/status`, {
        status: newStatus,
        note: `Status updated via UI`
      });
      fetchTickets();
    } catch (error) {
      alert('Failed to update status: ' + error.message);
    }
  };

  // 🗑️ DELETE Function (CRUD)
  const handleDelete = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/v1/tickets/${ticketId}`);
      fetchTickets(); // Refresh list
    } catch (error) {
      alert("Failed to delete: " + error.message);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setSortBy('newest');
  };

  // 📄 Export to CSV Function
  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Created By', 'Created At'];
    const rows = filteredTickets.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.priority,
      t.status,
      t.createdBy,
      new Date(t.createdAt).toLocaleString()
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // 🔹 Dynamic Styles based on Dark Mode
  const styles = {
    container: {
      maxWidth: '1100px',
      margin: '30px auto',
      padding: '30px',
      color: darkMode ? '#e2e8f0' : '#4a5568'
    },
    header: {
      color: darkMode ? '#90cdf4' : '#1e3a5f',
      marginBottom: '25px',
      fontSize: '26px',
      fontWeight: '600',
      borderBottom: `2px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
      paddingBottom: '10px'
    },
    filterCard: {
      background: darkMode ? '#2d3748' : 'white',
      padding: '20px',
      borderRadius: '10px',
      border: `1px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
      marginBottom: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: `1px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
      borderRadius: '6px',
      fontSize: '14px',
      background: darkMode ? '#4a5568' : 'white',
      color: darkMode ? '#e2e8f0' : '#4a5568'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      border: `1px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
      borderRadius: '6px',
      fontSize: '14px',
      background: darkMode ? '#4a5568' : 'white',
      color: darkMode ? '#e2e8f0' : '#4a5568'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: darkMode ? '#2d3748' : 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      minWidth: '700px'
    },
    th: {
      padding: '14px',
      fontWeight: '600',
      background: darkMode ? '#1a202c' : '#1e3a5f',
      color: 'white',
      textAlign: 'left'
    },
    td: {
      padding: '12px',
      borderBottom: `1px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
      color: darkMode ? '#e2e8f0' : '#4a5568'
    },
    badge: (type, value) => {
      const colors = {
        priority: {
          Low: { bg: '#38a169', text: 'white' },
          Medium: { bg: '#dd6b20', text: 'white' },
          High: { bg: '#e53e3e', text: 'white' },
          Critical: { bg: '#9b2c2c', text: 'white' }
        },
        status: {
          Open: { bg: '#ebf8ff', text: '#2b6cb0' },
          IN_PROGRESS: { bg: '#fffaf0', text: '#c05621' },
          RESOLVED: { bg: '#f0fff4', text: '#276749' },
          Closed: { bg: '#f7fafc', text: '#4a5568' }
        }
      };
      const config = colors[type]?.[value] || { bg: '#718096', text: 'white' };
      return {
        padding: '5px 12px',
        borderRadius: type === 'priority' ? '20px' : '15px',
        fontSize: '12px',
        fontWeight: '600',
        background: config.bg,
        color: config.text,
        display: 'inline-block'
      };
    },
    button: {
      primary: {
        padding: '6px 14px',
        background: '#1e3a5f',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600'
      },
      secondary: {
        padding: '6px 14px',
        background: '#38a169',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600'
      },
      danger: {
        padding: '6px 14px',
        background: '#e53e3e',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        marginLeft: '8px'
      },
      export: {
        background: '#38a169',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '15px'
      },
      clear: {
        background: '#718096',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '13px',
        cursor: 'pointer',
        fontWeight: '500'
      }
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      background: darkMode ? '#2d3748' : '#f7fafc',
      border: `1px dashed ${darkMode ? '#4a5568' : '#e2e8f0'}`,
      borderRadius: '10px',
      color: darkMode ? '#a0aec0' : '#718096'
    }
  };

  if (loading) return <TableSkeleton />;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📋 {t('viewTickets')}</h2>
      
      {/* 🔍 Filter Section */}
      <div style={styles.filterCard}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '15px'
        }}>
          {/* Search */}
          <div>
            <label style={{ fontWeight: '600', fontSize: '13px', marginBottom: '5px', display: 'block' }}>
              🔍 {t('search')}
            </label>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label style={{ fontWeight: '600', fontSize: '13px', marginBottom: '5px', display: 'block' }}>
              📊 {t('status')}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.select}
            >
              <option value="">{t('allStatuses')}</option>
              <option value="Open">{t('open')}</option>
              <option value="IN_PROGRESS">{t('inProgress')}</option>
              <option value="RESOLVED">{t('resolved')}</option>
              <option value="Closed">{t('closed')}</option>
            </select>
          </div>
          
          {/* Priority Filter */}
          <div>
            <label style={{ fontWeight: '600', fontSize: '13px', marginBottom: '5px', display: 'block' }}>
              🚨 {t('priority')}
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={styles.select}
            >
              <option value="">{t('allPriorities')}</option>
              <option value="Low">{t('low')}</option>
              <option value="Medium">{t('medium')}</option>
              <option value="High">{t('high')}</option>
              <option value="Critical">{t('critical')}</option>
            </select>
          </div>
          
          {/* Sort */}
          <div>
            <label style={{ fontWeight: '600', fontSize: '13px', marginBottom: '5px', display: 'block' }}>
              🔄 {t('sortBy')}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.select}
            >
              <option value="newest">{t('newestFirst')}</option>
              <option value="oldest">{t('oldestFirst')}</option>
              <option value="priority">{t('priorityHighLow')}</option>
            </select>
          </div>
        </div>
        
        {/* Clear Filters Button */}
        {(searchTerm || statusFilter || priorityFilter) && (
          <button
            onClick={clearFilters}
            style={styles.button.clear}
          >
            ♻️ {t('clearFilters')}
          </button>
        )}
      </div>
      
      {/* 📄 Export Button */}
      {filteredTickets.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={exportToCSV}
            style={styles.button.export}
          >
            📥 {t('exportCSV')}
          </button>
        </div>
      )}
      
      {/* Results Count */}
      <p style={{ color: darkMode ? '#a0aec0' : '#718096', marginBottom: '15px', fontSize: '14px' }}>
        {t('showing')} {filteredTickets.length} {t('of')} {tickets.length} {t('tickets')}
      </p>
      
      {/* 📱 Mobile-Responsive Table Wrapper */}
      <div style={{ 
        overflowX: 'auto', 
        WebkitOverflowScrolling: 'touch',
        borderRadius: '8px'
      }}>
        {filteredTickets.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ margin: 0, fontSize: '16px' }}>
              {tickets.length === 0 
                ? t('noTickets') 
                : t('noTicketsMatch')}
              <Link to="/" style={{ color: '#1e3a5f', fontWeight: '600', marginLeft: '5px' }}>
                {t('createOne')}
              </Link>
            </p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>{t('title')}</th>
                <th style={styles.th}>{t('category')}</th>
                <th style={styles.th}>{t('priority')}</th>
                <th style={styles.th}>{t('status')}</th>
                <th style={styles.th}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket, index) => (
                <tr key={ticket.id} style={{ 
                  background: index % 2 === 0 
                    ? (darkMode ? '#2d3748' : '#ffffff') 
                    : (darkMode ? '#1a202c' : '#f7fafc')
                }}>
                  <td style={styles.td}>
                    <Link 
                      to={`/tickets/${ticket.id}`} 
                      style={{ 
                        textDecoration: 'none', 
                        color: darkMode ? '#90cdf4' : '#1e3a5f', 
                        fontWeight: '600',
                        display: 'block'
                      }}
                    >
                      {ticket.title}
                    </Link>
                  </td>
                  <td style={styles.td}>{ticket.category}</td>
                  <td style={styles.td}>
                    <span style={styles.badge('priority', ticket.priority)}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge('status', ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {ticket.status === 'Open' && (
                        <button 
                          onClick={() => handleStatusUpdate(ticket.id, 'IN_PROGRESS')}
                          style={styles.button.primary}
                        >
                          ▶ {t('start')}
                        </button>
                      )}
                      {ticket.status === 'IN_PROGRESS' && (
                        <button 
                          onClick={() => handleStatusUpdate(ticket.id, 'RESOLVED')}
                          style={styles.button.secondary}
                        >
                          ✓ {t('resolve')}
                        </button>
                      )}
                      
                      {/* 🗑️ DELETE Button (CRUD) */}
                      <button 
                        onClick={() => handleDelete(ticket.id)}
                        style={styles.button.danger}
                        title="Delete ticket"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TicketList;