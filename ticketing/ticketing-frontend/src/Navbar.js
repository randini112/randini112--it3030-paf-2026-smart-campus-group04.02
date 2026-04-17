import React from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';

function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  return (
    <nav style={{
      background: darkMode ? '#1a202c' : '#1e3a5f',
      color: 'white',
      padding: '18px 30px',
      marginBottom: '25px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'background 0.3s'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '26px', 
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          🎓 Smart Campus Ticketing
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '25px' }}>
            <Link to="/" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '500',
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'background 0.3s',
              background: 'rgba(255,255,255,0.1)'
            }}>
              📝 {t('createTicket')}
            </Link>
            <Link to="/tickets" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '500',
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'background 0.3s',
              background: 'rgba(255,255,255,0.1)'
            }}>
              📋 {t('viewTickets')}
            </Link>
          </div>
          
          {/* Language Selector */}
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <option value="en">🇬🇧 EN</option>
            <option value="si">🇱 SI</option>
            <option value="ta">🇮🇳 TA</option>
          </select>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '18px',
              transition: 'background 0.3s'
            }}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          {/* Notification Bell */}
          <NotificationBell userId="student123" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;