import React, { useState, useEffect } from 'react'
import Card from '../components/Card'

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications = [
      {
        id: '1',
        title: 'Booking Confirmed',
        message: 'Your booking for Computer Lab A has been confirmed for April 7, 2024',
        type: 'BOOKING',
        timestamp: '2024-04-07 10:30 AM',
        read: false
      },
      {
        id: '2',
        title: 'Ticket Resolved',
        message: 'Your WiFi issue ticket (#003) has been resolved',
        type: 'TICKET',
        timestamp: '2024-04-07 09:15 AM',
        read: false
      },
      {
        id: '3',
        title: 'Resource Available',
        message: 'Conference Room 101 is now available for booking',
        type: 'RESOURCE',
        timestamp: '2024-04-06 04:00 PM',
        read: true
      },
      {
        id: '4',
        title: 'Maintenance Scheduled',
        message: 'Physics Lab will be under maintenance on April 8, 2024',
        type: 'MAINTENANCE',
        timestamp: '2024-04-06 02:00 PM',
        read: true
      },
      {
        id: '5',
        title: 'Booking Reminder',
        message: 'Reminder: You have a booking tomorrow at 10:00 AM',
        type: 'BOOKING',
        timestamp: '2024-04-06 06:00 PM',
        read: false
      }
    ]
    setNotifications(mockNotifications)
  }, [])

  const getIconForType = (type) => {
    switch (type) {
      case 'BOOKING': return '📅'
      case 'TICKET': return '🎫'
      case 'RESOURCE': return '📚'
      case 'MAINTENANCE': return '🔧'
      default: return '🔔'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'BOOKING': return 'text-blue-400'
      case 'TICKET': return 'text-yellow-400'
      case 'RESOURCE': return 'text-green-400'
      case 'MAINTENANCE': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'ALL') return true
    if (filter === 'UNREAD') return !notification.read
    if (filter === 'READ') return notification.read
    return true
  })

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-gray-400">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn-secondary"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2 mb-6">
          {['ALL', 'UNREAD', 'READ'].map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterType
                  ? 'gradient-cyan-blue text-white'
                  : 'bg-dark-surface border border-dark-border text-gray-400 hover:text-white'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔔</div>
              <p className="text-gray-400">
                {filter === 'UNREAD' ? 'No unread notifications' : 'No notifications'}
              </p>
            </div>
          </Card>
        ) : (
          filteredNotifications.map(notification => (
            <Card
              key={notification.id}
              className={`transition-all hover:transform hover:scale-[1.02] ${
                !notification.read ? 'border-l-4 border-l-accent-cyan' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`text-2xl mt-1 ${getTypeColor(notification.type)}`}>
                    {getIconForType(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {notification.title}
                      </h3>
                      <span className="text-gray-400 text-sm">
                        {notification.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-300">
                      {notification.message}
                    </p>
                  </div>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="ml-4 text-accent-cyan hover:text-accent-blue transition-colors"
                    title="Mark as read"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 00016zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 7.707a1 1 0 01-1.414 0l-4 4a1 1 0 001.414 1.414l4-4z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
