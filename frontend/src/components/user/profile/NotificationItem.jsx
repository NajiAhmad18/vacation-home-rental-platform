import React from 'react';
import {
  Calendar, MessageCircle, Clock, Star, CreditCard,
  Home, AlertCircle, Info, X, Check
} from 'lucide-react';

// Supports both old lowercase keys and new PascalCase Lucide icon names from the store
const iconMap = {
  // legacy keys
  calendar: Calendar,
  message: MessageCircle,
  clock: Clock,
  star: Star,
  'credit-card': CreditCard,
  // store iconName keys (Lucide component names)
  Calendar,
  MessageCircle,
  Clock,
  Star,
  CreditCard,
  Home,
  AlertCircle,
  Info,
};

const colorMap = {
  blue:    'bg-blue-100 text-blue-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber:   'bg-amber-100 text-amber-600',
  red:     'bg-red-100 text-red-600',
  violet:  'bg-violet-100 text-violet-600',
  indigo:  'bg-indigo-100 text-indigo-600',
  // legacy type-based fallbacks
  booking:  'bg-blue-100 text-blue-600',
  message:  'bg-green-100 text-green-600',
  reminder: 'bg-amber-100 text-amber-600',
  review:   'bg-purple-100 text-purple-600',
  payment:  'bg-gray-100 text-gray-600',
  system:   'bg-red-100 text-red-600',
};

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  // Resolve icon: prefer iconName (new store field), fallback to icon (legacy)
  const Icon = iconMap[notification.iconName] || iconMap[notification.icon] || Calendar;

  // Resolve color: prefer color field, fallback to type
  const colorClass = colorMap[notification.color] || colorMap[notification.type] || 'bg-gray-100 text-gray-600';

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}>
      <div className="flex items-start space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <Icon size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500">{notification.time}</p>
            </div>
            
            <div className="flex items-center space-x-1 ml-4">
              {!notification.read && (
                <button
                  onClick={() => onMarkRead(notification.id)}
                  className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete notification"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;