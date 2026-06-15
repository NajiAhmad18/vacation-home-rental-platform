import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Bell, CreditCard, User, Heart, MessageSquare, Trash2, Calendar } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Stripe payment succeeded",
      message: "Your payment for invoice #INV-4927 has been processed. PDF copy is generated and ready in your dashboard.",
      time: "2 hours ago",
      type: "payment",
      read: false,
    },
    {
      id: 2,
      title: "Welcome to StayFinder!",
      message: "Explore premium verified holiday stays and start booking your summer getaways with secure Stripe checkouts.",
      time: "1 day ago",
      type: "welcome",
      read: false,
    },
    {
      id: 3,
      title: "New Wishlist Item added",
      message: "You added 'Grand Horizon Beachfront Villa' to your wishlist. Be sure to check rates for next weekend.",
      time: "3 days ago",
      type: "wishlist",
      read: true,
    },
    {
      id: 4,
      title: "Verification Approved",
      message: "Your host identification profile has been successfully verified by our administrative team.",
      time: "5 days ago",
      type: "account",
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("Notification log cleared.");
  };

  const getIcon = (type) => {
    switch (type) {
      case "payment":
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case "account":
        return <User className="w-5 h-5 text-blue-600" />;
      case "wishlist":
        return <Heart className="w-5 h-5 text-rose-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "payment":
        return "bg-emerald-50 border-emerald-100";
      case "account":
        return "bg-blue-50 border-blue-100";
      case "wishlist":
        return "bg-rose-50 border-rose-100";
      default:
        return "bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 text-left">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-2">
              <Bell className="w-8 h-8 text-blue-600" />
              <span>Notification Feed</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Stay updated on booking activities, account audits, and system alerts.
            </p>
          </div>

          {notifications.length > 0 && (
            <div className="flex space-x-3">
              <button
                onClick={markAllRead}
                className="px-4 py-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-xs font-semibold rounded-xl transition"
              >
                Mark all read
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear all</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="min-h-[350px] bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <Bell className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">All caught up!</h3>
            <p className="text-gray-500 text-sm mt-1">
              You don't have any notifications at the moment. We'll alert you here when something happens.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-6 transition-colors duration-200 hover:bg-slate-50/50 flex items-start space-x-4 text-left relative ${
                  !n.read ? "bg-blue-50/20" : ""
                }`}
              >
                {/* Unread Indicator dot */}
                {!n.read && (
                  <span className="absolute top-6 right-6 w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                )}

                <div className={`p-3 rounded-2xl border ${getColor(n.type)} flex-shrink-0`}>
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-sm font-bold text-gray-950 flex items-center space-x-2">
                    <span>{n.title}</span>
                  </h3>
                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{n.message}</p>
                  
                  <div className="flex items-center space-x-1.5 mt-3 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{n.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
