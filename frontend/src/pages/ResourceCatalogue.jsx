import React, { useState, useEffect } from 'react';
import resourceService from '../services/resourceService';

const catalogueStyle = {
    padding: '40px',
    background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif"
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333'
};

const searchBarStyle = {
    padding: '12px 20px',
    width: '100%',
    maxWidth: '500px',
    borderRadius: '25px',
    border: '1px solid #ddd',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    fontSize: '16px',
    outline: 'none',
    display: 'block',
    margin: '0 auto 40px'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px'
};

const cardStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
};

const ResourceCatalogue = () => {
    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                // Fetch using service
                const data = await resourceService.getAllResources(0, 10, 'id,desc', { search });
                // If backend isn't running, show mock for UI demo
                setResources(Array.isArray(data) ? data : (data.content || []));
            } catch (err) {
                console.log('Backend not available, using mock data for demo');
                setResources([
                    { id: 1, name: 'Main Auditorium', type: 'HALL', capacity: 500, location: 'Block A', status: 'ACTIVE' },
                    { id: 2, name: 'Chemistry Lab', type: 'LAB', capacity: 40, location: 'Block B', status: 'ACTIVE' },
                    { id: 3, name: 'Projector X-200', type: 'EQUIPMENT', capacity: null, location: 'IT Dept', status: 'OUT_OF_SERVICE' }
                ]);
            }
        };
        fetchResources();
    }, [search]);

    return (
        <div style={catalogueStyle}>
            <h1 style={headerStyle}>Campus Resources & Facilities</h1>
            
            <input 
                type="text" 
                placeholder="Search resources by name..." 
                style={searchBarStyle}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div style={gridStyle}>
                {resources.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map(r => (
                    <div 
                        key={r.id} 
                        style={cardStyle}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(31, 38, 135, 0.15)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.07)' }}
                    >
                        <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{r.name}</h3>
                        <p style={{ margin: '5px 0', color: '#7f8c8d' }}><strong>Type:</strong> {r.type}</p>
                        <p style={{ margin: '5px 0', color: '#7f8c8d' }}><strong>Location:</strong> {r.location}</p>
                        {r.capacity && <p style={{ margin: '5px 0', color: '#7f8c8d' }}><strong>Capacity:</strong> {r.capacity} pax</p>}
                        
                        <div style={{
                            marginTop: '15px',
                            display: 'inline-block',
                            padding: '5px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            backgroundColor: r.status === 'ACTIVE' ? '#e8f8f5' : '#fdedec',
                            color: r.status === 'ACTIVE' ? '#1abc9c' : '#e74c3c'
                        }}>
                            {r.status === 'ACTIVE' ? '🟢 Active' : '🔴 Out of Service'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResourceCatalogue;
