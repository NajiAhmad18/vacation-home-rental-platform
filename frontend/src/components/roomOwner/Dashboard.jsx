import React from "react";
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Star,
} from "lucide-react";

const Dashboard = () => {
  const recentActivities = [
    {
      user: "John Smith",
      action: "Created new product",
      time: "2 minutes ago",
    },
    {
      user: "Sarah Johnson",
      action: "Updated user profile",
      time: "5 minutes ago",
    },
    {
      user: "Mike Wilson",
      action: "Processed order #1234",
      time: "10 minutes ago",
    },
    {
      user: "Emma Davis",
      action: "Generated monthly report",
      time: "15 minutes ago",
    },
    {
      user: "Tom Brown",
      action: "Modified system settings",
      time: "20 minutes ago",
    },
  ];

  return (
    <div className="p-6">
      {/* Stats Grid */}
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Total Properties
            </h3>
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-green-600 mt-1">+2 this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Active Bookings
            </h3>
          </div>
          <p className="text-3xl font-bold text-green-600">28</p>
          <p className="text-sm text-green-600 mt-1">+5 this week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Revenue
            </h3>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">$24,580</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Average Rating
            </h3>
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">4.8</p>
          <p className="text-sm text-gray-600 mt-1">Based on 156 reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">
                Revenue Overview
              </h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                  7 days
                </button>
                <button className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-full">
                  30 days
                </button>
                <button className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-full">
                  90 days
                </button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <div className="text-center">
                <TrendingUp size={48} className="text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">
                  Chart visualization would go here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    {activity.user}
                  </p>
                  <p className="text-sm text-slate-600">{activity.action}</p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all activities
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
            <Users size={24} className="mb-2" />
            <p className="font-medium">Add New User</p>
          </button>
          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all">
            <Package size={24} className="mb-2" />
            <p className="font-medium">Create Product</p>
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all">
            <Eye size={24} className="mb-2" />
            <p className="font-medium">View Reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
