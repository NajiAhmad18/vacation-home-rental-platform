import React, { useState } from "react";
import {
  User,
  Calendar,
  Clock,
  Bell,
  Star,
  Settings,
  BarChart3,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import Overview from "../../components/user/profile/Overview";
import ProfileDetails from "../../components/user/profile/ProfileDetails";
import ActiveBookings from "../../components/user/profile/ActiveBookings";
import RecentBookings from "../../components/user/profile/RecentBookings";
import Notifications from "../../components/user/profile/Notifications";
import Reviews from "../../components/user/profile/Reviews";
import SettingsTab from "../../components/user/profile/Settings";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "profile", label: "Profile Details", icon: User },
    { id: "active-bookings", label: "Active Bookings", icon: Calendar },
    { id: "recent-bookings", label: "Recent Bookings", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "profile":
        return <ProfileDetails />;
      case "active-bookings":
        return <ActiveBookings />;
      case "recent-bookings":
        return <RecentBookings />;
      case "notifications":
        return <Notifications />;
      case "reviews":
        return <Reviews />;
      case "settings":
        return <SettingsTab />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 z-50 relative">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="lg:flex">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
    fixed top-[64px] bottom-0 left-0 w-64 bg-white shadow-lg overflow-y-auto
    transform transition-transform duration-300 ease-in-out
    lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  `}
        >
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="p-4 flex-1">
              <ul className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => {
                          setActiveTab(tab.id);
                          setSidebarOpen(false);
                        }}
                        className={`
                  w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
                      >
                        <Icon size={18} />
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  // 🔐 TODO: replace with your logout function (e.g., useAuthStore().logout())
                  console.log("Logout clicked");
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <main className="p-6">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
