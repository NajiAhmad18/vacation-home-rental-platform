import React, { useState } from 'react';
import NotificationItem from './NotificationItem';
import { Bell, CheckCheck } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'Booking Confirmation',
      message: 'Your booking for Sunset Villa Resort has been confirmed!',
      time: '2 hours ago',
      read: false,
      icon: 'calendar'
    },
    {
      id: 2,
      type: 'message',
      title: 'Message from Host',
      message: 'John sent you a message about your upcoming stay.',
      time: '4 hours ago',
      read: false,
      icon: 'message'
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Check-in Reminder',
      message: 'Don\'t forget to check in tomorrow at Mountain Cabin Retreat.',
      time: '1 day ago',
      read: true,
      icon: 'clock'
    },
    {
      id: 4,
      type: 'review',
      title: 'Review Request',
      message: 'How was your stay at Ocean View Hotel? Leave a review!',
      time: '2 days ago',
      read: false,
      icon: 'star'
    },
    {
      id: 5,
      type: 'payment',
      title: 'Payment Received',
      message: 'Your payment for City Center Apartment has been processed.',
      time: '3 days ago',
      read: true,
      icon: 'credit-card'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with your bookings and messages
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <CheckCheck size={16} />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
          <p className="text-gray-600">You're all caught up! No new notifications.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        </div>
      )}

      {/* Notification Preferences Quick Link */}
      {notifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Manage Your Preferences
              </h3>
              <p className="text-blue-700 mb-4">
                Control what notifications you receive and how you want to be notified.
              </p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Go to Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;