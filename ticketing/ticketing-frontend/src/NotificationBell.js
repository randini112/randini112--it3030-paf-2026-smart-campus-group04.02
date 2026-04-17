import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NotificationBell({ userId = "student123" }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const [notifsRes, countRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/v1/notifications/user/${userId}`),
        axios.get(`http://localhost:8080/api/v1/notifications/user/${userId}/unread-count`)
      ]);
      setNotifications(notifsRes.data);
      setUnreadCount(countRes.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/notifications/${notificationId}/read`);
      fetchNotifications(); // Refresh
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:8080/api/v1/notifications/user/${userId}/read-all`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-bell')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="notification-bell" style={{ position: 'relative' }}>
      {/* Bell Icon with Badge */}
      <button
        onClick={toggleDropdown}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          position: 'relative',
          padding: '8px',
          borderRadius: '50%',
          transition: 'background 0.3s'
        }}
        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
        onMouseOut={(e) => e.target.style.background = 'none'}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            background: '#e53e3e',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '10px',
            fontWeight: 'bold',
            minWidth: '18px',
            textAlign: 'center'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '45px',
          right: '0',
          width: '320px',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 1000,
          maxHeight: '400px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '15px',
            background: '#1e3a5f',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <strong style={{ fontSize: '14px' }}>Notifications</strong>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: '300px'
          }}>
            {notifications.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center', color: '#718096', fontSize: '13px' }}>
                No notifications yet
              </p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #e2e8f0',
                    background: notif.read ? 'white' : '#ebf8ff',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      margin: '0 0 4px 0', 
                      fontSize: '13px',
                      color: '#2d3748',
                      fontWeight: notif.read ? '400' : '600'
                    }}>
                      {notif.message}
                    </p>
                    <span style={{ 
                      fontSize: '11px', 
                      color: '#718096' 
                    }}>
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#1e3a5f',
                          fontSize: '14px',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#e53e3e',
                        fontSize: '14px',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;