import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "booking",
    read: false,
    title: "Booking Confirmed",
    message: "Your reservation for 'Seaside Villa in Colombo' has been confirmed for June 20–25.",
    time: "2 hours ago",
    iconName: "Home",
    color: "blue",
  },
  {
    id: 2,
    type: "payment",
    read: false,
    title: "Payment Successful",
    message: "Your payment of $1,248.00 for booking #BK-8892 was processed successfully.",
    time: "5 hours ago",
    iconName: "CreditCard",
    color: "emerald",
  },
  {
    id: 3,
    type: "review",
    read: false,
    title: "New Review Received",
    message: "A guest left a 5-star review for your listing 'Mountain Retreat, Nuwara Eliya'.",
    time: "1 day ago",
    iconName: "Star",
    color: "amber",
  },
  {
    id: 4,
    type: "system",
    read: true,
    title: "Security Notice",
    message: "A new device signed in to your LuxeKey account. If this wasn't you, please update your password.",
    time: "2 days ago",
    iconName: "AlertCircle",
    color: "red",
  },
  {
    id: 5,
    type: "booking",
    read: true,
    title: "Check-in Reminder",
    message: "Your stay at 'Lakeview Bungalow' starts tomorrow! Don't forget to check in online.",
    time: "3 days ago",
    iconName: "Calendar",
    color: "violet",
  },
  {
    id: 6,
    type: "system",
    read: true,
    title: "Welcome to LuxeKey",
    message: "Your account has been set up. Explore thousands of verified stays and book your first adventure.",
    time: "1 week ago",
    iconName: "Info",
    color: "indigo",
  },
];

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: INITIAL_NOTIFICATIONS,

      markAllRead: () => {
        set({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
        });
      },

      markRead: (id) => {
        set({
          notifications: get().notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        });
      },

      deleteNotification: (id) => {
        set({
          notifications: get().notifications.filter((n) => n.id !== id),
        });
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      addNotification: (notification) => {
        const newNotif = {
          id: Date.now(),
          read: false,
          time: "Just now",
          ...notification,
        };
        set({
          notifications: [newNotif, ...get().notifications],
        });
      },
    }),
    {
      name: "luxekey-notifications-storage",
    }
  )
);
