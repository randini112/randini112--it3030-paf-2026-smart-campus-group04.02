import React, { useState, useEffect } from 'react';
import resourceService from '../services/resourceService';

// Styles matching glassmorphism identity
const containerStyle = {
    padding: '40px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif"
};

const tableContainerStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    overflowX: 'auto'
};

const buttonStyle = {
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '20px'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
};

const thStyle = {
    borderBottom: '2px solid #ddd',
    padding: '12px 15px',
    color: '#333'
};

const tdStyle = {
    borderBottom: '1px solid #ddd',
    padding: '12px 15px',
    color: '#555'
};

const AdminResourceManager = () => {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await resourceService.getAllResources();
            setResources(Array.isArray(data) ? data : (data.content || []));
        } catch (err) {
            console.warn('Backend offline, using mocks');
            setResources([
                { id: 1, name: 'Main Auditorium', type: 'HALL', capacity: 500, location: 'Block A', status: 'ACTIVE' }
            ]);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await resourceService.deleteResource(id);
                loadData();
            } catch (err) {
                alert('Failed to delete resource');
            }
        }
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '40px' }}>⚙️ Admin Resource Management</h1>
            
            <div style={tableContainerStyle}>
                <button style={buttonStyle}>+ Add New Resource</button>
                
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Type</th>
                            <th style={thStyle}>Capacity</th>
                            <th style={thStyle}>Location</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map(r => (
                            <tr key={r.id}>
                                <td style={tdStyle}>{r.name}</td>
                                <td style={tdStyle}>{r.type}</td>
                                <td style={tdStyle}>{r.capacity || 'N/A'}</td>
                                <td style={tdStyle}>{r.location}</td>
                                <td style={tdStyle}>
                                    <span style={{
                                        color: r.status === 'ACTIVE' ? 'green' : 'red',
                                        fontWeight: 'bold'
                                    }}>
                                        {r.status}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <button style={{...buttonStyle, background: '#f39c12', padding: '5px 10px', marginRight: '10px'}}>Edit</button>
                                    <button onClick={() => handleDelete(r.id)} style={{...buttonStyle, background: '#e74c3c', padding: '5px 10px'}}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminResourceManager;
