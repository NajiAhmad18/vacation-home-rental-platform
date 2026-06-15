import React from 'react';
import { Calendar, MessageCircle, Clock, Star, CreditCard, X, Check } from 'lucide-react';

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const getIcon = (iconType) => {
    switch (iconType) {
      case 'calendar':
        return Calendar;
      case 'message':
        return MessageCircle;
      case 'clock':
        return Clock;
      case 'star':
        return Star;
      case 'credit-card':
        return CreditCard;
      default:
        return Calendar;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-100 text-blue-600';
      case 'message':
        return 'bg-green-100 text-green-600';
      case 'reminder':
        return 'bg-amber-100 text-amber-600';
      case 'review':
        return 'bg-purple-100 text-purple-600';
      case 'payment':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const Icon = getIcon(notification.icon);

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}>
      <div className="flex items-start space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
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