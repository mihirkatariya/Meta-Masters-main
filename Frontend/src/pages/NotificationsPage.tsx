import React, { useState } from 'react';
import { 
  FaBell, 
  FaCheck, 
  FaEnvelope, 
  FaTrash, 
  FaUser, 
  FaBox, 
  FaExclamationTriangle 
} from 'react-icons/fa';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Sample notifications data
const initialNotifications = [
  { 
    id: 1, 
    type: 'item_packed', 
    message: 'Sarah packed "Toothbrush"', 
    timestamp: '2023-07-05T14:30:00Z',
    read: true
  },
  { 
    id: 2, 
    type: 'item_status', 
    message: 'Michael changed "Power Bank" status to "Delivered"', 
    timestamp: '2023-07-05T15:45:00Z',
    read: false
  },
  { 
    id: 3, 
    type: 'member_joined', 
    message: 'Emma Davis joined your trip', 
    timestamp: '2023-07-04T09:15:00Z',
    read: false
  },
  { 
    id: 4, 
    type: 'reminder', 
    message: 'Trip starts in 10 days! 14 items still pending.', 
    timestamp: '2023-07-04T08:00:00Z',
    read: true
  },
  { 
    id: 5, 
    type: 'item_packed', 
    message: 'Sarah packed "Water Bottles"', 
    timestamp: '2023-07-03T10:00:00Z',
    read: true
  },
  { 
    id: 6, 
    type: 'reminder', 
    message: 'Don\'t forget to assign remaining items to members.', 
    timestamp: '2023-07-02T08:00:00Z',
    read: true
  },
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return diffInDays + ' days ago';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const clearAll = () => {
    setNotifications([]);
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'item_packed':
        return <FaBox className="text-green-500" />;
      case 'item_status':
        return <FaCheck className="text-blue-500" />;
      case 'member_joined':
        return <FaUser className="text-purple-500" />;
      case 'member_left':
        return <FaUser className="text-red-500" />;
      case 'reminder':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const sendBulkReminder = () => {
    alert('Bulk reminder sent to all members with pending items.');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header eventName="Summer Camping Trip" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
              <p className="text-gray-500">Stay updated with the latest activities</p>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={markAllAsRead}
                className="btn-secondary flex items-center"
                disabled={unreadCount === 0}
              >
                <FaCheck className="mr-2" />
                Mark All as Read
              </button>
              
              <button 
                onClick={sendBulkReminder}
                className="btn-primary flex items-center"
              >
                <FaEnvelope className="mr-2" />
                Send Reminder to All
              </button>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-8">
              {[
                { id: 'all', label: 'All Notifications' },
                { id: 'unread', label: 'Unread' },
                { id: 'item_packed', label: 'Items Packed' },
                { id: 'item_status', label: 'Status Changes' },
                { id: 'member_joined', label: 'Membership' },
                { id: 'reminder', label: 'Reminders' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'unread' && unreadCount > 0 && (
                    <span className="ml-2 bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredNotifications.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-primary-900' : 'text-gray-900'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.timestamp)}
                            </span>
                            
                            {!notification.read && (
                              <button 
                                onClick={() => markAsRead(notification.id)}
                                className="text-primary-600 hover:text-primary-800 rounded-full p-1"
                                title="Mark as read"
                              >
                                <FaCheck size={12} />
                              </button>
                            )}
                            
                            <button 
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-800 rounded-full p-1"
                              title="Delete notification"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                        
                        {!notification.read && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <FaBell className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'all' ? 
                    'You don\'t have any notifications yet.' : 
                    `No ${filter} notifications found.`}
                </p>
              </div>
            )}
            
            {filteredNotifications.length > 0 && (
              <div className="bg-gray-50 px-4 py-3 flex justify-end">
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Clear All Notifications
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage; 