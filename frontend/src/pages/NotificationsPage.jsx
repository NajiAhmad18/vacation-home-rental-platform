import React, { useState } from "react";
import {
  Bell, CheckCheck, Trash2, Home, CreditCard,
  Star, AlertCircle, Info, Calendar, Filter,
} from "lucide-react";

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1, type: "booking", read: false,
    title: "Booking Confirmed",
    message: "Your reservation for 'Seaside Villa in Colombo' has been confirmed for June 20–25.",
    time: "2 hours ago",
    icon: Home, color: "blue",
  },
  {
    id: 2, type: "payment", read: false,
    title: "Payment Successful",
    message: "Your payment of $1,248.00 for booking #BK-8892 was processed successfully.",
    time: "5 hours ago",
    icon: CreditCard, color: "emerald",
  },
  {
    id: 3, type: "review", read: true,
    title: "New Review Received",
    message: "A guest left a 5-star review for your listing 'Mountain Retreat, Nuwara Eliya'.",
    time: "1 day ago",
    icon: Star, color: "amber",
  },
  {
    id: 4, type: "system", read: true,
    title: "Security Notice",
    message: "A new device signed in to your LuxeKey account. If this wasn't you, please update your password.",
    time: "2 days ago",
    icon: AlertCircle, color: "red",
  },
  {
    id: 5, type: "booking", read: true,
    title: "Check-in Reminder",
    message: "Your stay at 'Lakeview Bungalow' starts tomorrow! Don't forget to check in online.",
    time: "3 days ago",
    icon: Calendar, color: "violet",
  },
  {
    id: 6, type: "system", read: true,
    title: "Welcome to LuxeKey",
    message: "Your account has been set up. Explore thousands of verified stays and book your first adventure.",
    time: "1 week ago",
    icon: Info, color: "indigo",
  },
];

const FILTERS = ["All", "Bookings", "Payments", "Reviews", "System"];

const colorMap = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-600",   dot: "bg-blue-500" },
  emerald:{ bg: "bg-emerald-50",text: "text-emerald-600",dot: "bg-emerald-500" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-600",  dot: "bg-amber-500" },
  red:    { bg: "bg-red-50",    text: "text-red-600",    dot: "bg-red-500" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-500" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("All");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Bookings") return n.type === "booking";
    if (activeFilter === "Payments") return n.type === "payment";
    if (activeFilter === "Reviews") return n.type === "review";
    if (activeFilter === "System") return n.type === "system";
    return true;
  });

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const deleteNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifications([]);

  return (
    <div className="min-h-screen pb-20 page-enter" style={{ background: "var(--surface)" }}>

      {/* ── Page Header ─────────────────────────── */}
      <div
        className="relative overflow-hidden py-14 px-4 text-white"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #312e81 100%)" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                <Bell className="w-5 h-5 text-blue-300" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
            </div>
            <p className="text-blue-200 text-sm">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "You're all caught up! 🎉"}
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/20 text-red-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Filters ─────────────────────────────── */}
        <div className="flex items-center gap-3 mb-7 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" /> Filter
          </span>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => {
              const count =
                f === "All" ? notifications.length :
                f === "Bookings" ? notifications.filter(n => n.type === "booking").length :
                f === "Payments" ? notifications.filter(n => n.type === "payment").length :
                f === "Reviews" ? notifications.filter(n => n.type === "review").length :
                notifications.filter(n => n.type === "system").length;

              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    activeFilter === f
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {f}
                  {count > 0 && (
                    <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold ${
                      activeFilter === f ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Notifications List ──────────────────── */}
        {filtered.length === 0 ? (
          <div className="card p-16 text-center flex flex-col items-center animate-scale-in">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No Notifications</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              {activeFilter === "All"
                ? "You're all caught up! New notifications will appear here."
                : `No ${activeFilter.toLowerCase()} notifications found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Unread first */}
            {filtered.some((n) => !n.read) && (
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Unread · {filtered.filter((n) => !n.read).length}
              </div>
            )}
            {filtered
              .sort((a, b) => a.read - b.read)
              .map((n, i) => {
                const { bg, text, dot } = colorMap[n.color] || colorMap.blue;
                return (
                  <div
                    key={n.id}
                    className={`card p-5 flex gap-4 items-start transition-all duration-200 cursor-pointer animate-fade-in ${
                      !n.read ? "border-blue-100 bg-blue-50/30 shadow-sm" : "hover:border-gray-200"
                    }`}
                    style={{ animationDelay: `${i * 40}ms` }}
                    onClick={() => markRead(n.id)}
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 ${bg} ${text} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <n.icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-sm font-bold ${!n.read ? "text-gray-900" : "text-gray-700"}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-2">{n.time}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!n.read && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Mark as read"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

            {/* Read section separator */}
            {filtered.some((n) => n.read) && filtered.some((n) => !n.read) && (
              <div className="divider" />
            )}
            {filtered.some((n) => n.read) && filtered.some((n) => !n.read) && (
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-1">
                Earlier
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
