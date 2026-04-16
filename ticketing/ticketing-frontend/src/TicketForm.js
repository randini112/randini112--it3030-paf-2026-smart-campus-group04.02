import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from './LanguageContext';

function TicketForm() {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    email: '',  // ✅ Added email field
    category: 'IT Support',
    priority: 'Medium',
    createdBy: 'student123'
  });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // ✅ Email validation function
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!email.includes('@')) return "Email must contain @";
    if (!email.endsWith('.com')) return "Email must end with .com";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "Invalid email format";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validate email first
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setMessage('❌ ' + emailError);
      return;
    }
    
    try {
        let response;
        
        if (files.length > 0) {
            const formDataToSend = new FormData();
            formDataToSend.append("data", JSON.stringify(formData));
            
            for (let i = 0; i < files.length; i++) {
                formDataToSend.append("images", files[i]);
            }
            
            response = await axios.post(
                'http://localhost:8080/api/v1/tickets', 
                formDataToSend,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
        } else {
            response = await axios.post(
                'http://localhost:8080/api/v1/tickets', 
                formData,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        
        setMessage(t('ticketCreated'));
        setFormData({ title: '', description: '', email: '', category: 'IT Support', priority: 'Medium', createdBy: 'student123' });
        setFiles([]);
    } catch (error) {
        setMessage(t('error') + ' ' + error.message);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '30px auto', 
      padding: '30px', 
      background: 'white',
      border: '1px solid #e2e8f0', 
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <h2 style={{ 
        color: '#1e3a5f', 
        marginBottom: '25px',
        fontSize: '24px',
        fontWeight: '600',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '10px'
      }}>
        🎫 {t('createTicket')}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* ✅ Email Field (Added at top) */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontWeight: '600', color: '#4a5568', marginBottom: '6px', display: 'block' }}>
            Student Email *:
          </label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="name@student.slit.lk"
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+\.com$"
            title="Email must contain @ and end with .com"
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <small style={{ color: '#718096', fontSize: '11px', marginTop: '4px', display: 'block' }}>
            Must include @ and end with .com (e.g., student@slit.lk.com)
          </small>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontWeight: '600', color: '#4a5568', marginBottom: '6px', display: 'block' }}>
            {t('title')}:
          </label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontWeight: '600', color: '#4a5568', marginBottom: '6px', display: 'block' }}>
            {t('description')}:
          </label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              minHeight: '100px',
              resize: 'vertical'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontWeight: '600', color: '#4a5568', marginBottom: '6px', display: 'block' }}>
            {t('category')}:
          </label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option>IT Support</option>
            <option>Facilities</option>
            <option>Academic</option>
            <option>Administration</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontWeight: '600', color: '#4a5568', marginBottom: '6px', display: 'block' }}>
            {t('priority')}:
          </label>
          <select 
            name="priority" 
            value={formData.priority} 
            onChange={handleChange} 
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontWeight: '600', color: '#4a5568', marginBottom: '6px', display: 'block' }}>
            {t('attachEvidence')}:
          </label>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange} 
            style={{ 
              marginTop: '6px', 
              width: '100%',
              padding: '8px',
              border: '1px dashed #e2e8f0',
              borderRadius: '6px',
              background: '#f7fafc'
            }}
          />
          {files.length > 0 && (
            <small style={{ color: '#718096', marginTop: '4px', display: 'block' }}>
              {files.length} {t('filesSelected')}
            </small>
          )}
        </div>
        
        <button
          type="submit"
          style={{
            background: '#1e3a5f',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '15px',
            width: '100%',
            transition: 'background 0.3s',
            marginTop: '10px'
          }}
          onMouseOver={(e) => e.target.style.background = '#2c5282'}
          onMouseOut={(e) => e.target.style.background = '#1e3a5f'}
        >
          {t('submit')}
        </button>
      </form>
      
      {message && (
        <p style={{
          marginTop: '20px',
          fontWeight: '600',
          padding: '12px',
          borderRadius: '6px',
          background: message.includes('✅') ? '#f0fff4' : '#fff5f5',
          color: message.includes('✅') ? '#276749' : '#c53030',
          border: `1px solid ${message.includes('✅') ? '#9ae6b4' : '#feb2b2'}`
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default TicketForm;