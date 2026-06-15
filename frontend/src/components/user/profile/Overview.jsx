import React, { useEffect } from "react";
import { Calendar, Bell, Star, ArrowRight } from "lucide-react";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useUserStore } from "../../../stores/useUserStore";

const Overview = () => {
  const user = useAuthStore((state) => state.user);
  const { stats, recentActivity, loading, error, fetchOverview } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchOverview();
    }
  }, [user, fetchOverview]);

  if (loading) return <p>Loading overview...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your bookings
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Active Bookings"
            value={stats.activeBookings}
            icon={Calendar}
            color="blue"
            description="Currently booked properties"
          />
          <StatCard
            title="Unread Notifications"
            value={stats.unreadNotifications}
            icon={Bell}
            color="amber"
            description="New messages and updates"
          />
          <StatCard
            title="Reviews Submitted"
            value={stats.reviewsSubmitted}
            icon={Star}
            color="green"
            description="Your property reviews"
          />
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 transition-colors">
            <span>View all</span>
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {!recentActivity || recentActivity.length === 0 ? (
            <p className="text-gray-500">No recent activity yet.</p>
          ) : (
            recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === "success"
                      ? "bg-green-400"
                      : activity.status === "info"
                      ? "bg-blue-400"
                      : "bg-amber-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.date).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    activity.status === "success"
                      ? "bg-green-100 text-green-800"
                      : activity.status === "info"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {activity.type}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, description }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    green: "bg-green-50 text-green-600 border-green-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
