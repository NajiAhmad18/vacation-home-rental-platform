import React, { useEffect } from "react";
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useLedgerStore } from "../../stores/useLedgerStore";

const fmtRs = (n) =>
  `Rs ${Number(n || 0).toLocaleString("en-LK", { maximumFractionDigits: 2 })}`;

const Dashboard = () => {
  const { adminSummary, getAdminSummary, loading, error } = useLedgerStore();

  useEffect(() => {
    getAdminSummary(); // fetch once
  }, [getAdminSummary]);

  const escrowBalance        = adminSummary?.escrowBalance ?? 0;
  const totalCommission      = adminSummary?.totalCommission ?? 0;

  const stats = [
    {
      title: "Escrow balance",
      value: fmtRs(escrowBalance),
      change: "+12.3%",
      changeType: "increase",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Revenue",
      value: fmtRs(totalCommission),
      change: "-2.1%",
      changeType: "decrease",
      icon: Package,
      color: "bg-purple-500",
    },
    {
      title: "Active Users",
      value: "12,484",
      change: "+8.7%",
      changeType: "increase",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Orders",
      value: "8,532",
      change: "+15.2%",
      changeType: "increase",
      icon: ShoppingCart,
      color: "bg-orange-500",
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  const recentActivities = [
    { user: "John Smith",  action: "Created new product",      time: "2 minutes ago" },
    { user: "Sarah Johnson",action: "Updated user profile",    time: "5 minutes ago" },
    { user: "Mike Wilson",  action: "Processed order #1234",   time: "10 minutes ago" },
    { user: "Emma Davis",   action: "Generated monthly report",time: "15 minutes ago" },
    { user: "Tom Brown",    action: "Modified system settings",time: "20 minutes ago" },
  ];

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={20} />
                </div>
                <div
                  className={`flex items-center text-sm ${
                    stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.changeType === "increase" ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  <span className="ml-1">{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-slate-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Revenue Overview</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">7 days</button>
                <button className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-full">30 days</button>
                <button className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-full">90 days</button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <div className="text-center">
                <TrendingUp size={48} className="text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">Chart visualization would go here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{activity.user}</p>
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
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
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
