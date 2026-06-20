import React from "react";
import Dashboard from "./Dashboard";
import {
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  FileText,
  Bell,
  HelpCircle,
  Settings,
} from "lucide-react";
import UserManagement from "./UserManagement";
import RoomManagement from "./RoomManagement";
import Reports from "./reports/Reports";
import OrdersManagement from "./OrdersManagement";

const PlaceholderSection = ({ title, description, icon: Icon }) => (
  <div className="p-8 max-w-4xl mx-auto text-center py-20">
    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
      <Icon size={32} />
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
    <p className="text-slate-500 max-w-md mx-auto">{description}</p>
  </div>
);

const ContentArea = ({ activeSection }) => {
  if (activeSection === "dashboard") {
    return <Dashboard />;
  }

  if (activeSection === "users") {
    return <UserManagement />;
  }
  
  if (activeSection === "allrooms") {
    return <RoomManagement />;
  }

  if (activeSection === "orders") {
    return <OrdersManagement />;
  }

  if (activeSection === "reports") {
    return <Reports />;
  }

  if (activeSection === "analytics") {
    return (
      <PlaceholderSection
        title="Analytics Panel"
        description="Detailed analytics and platform transaction charts are currently being processed. Check back soon for updated metrics."
        icon={BarChart3}
      />
    );
  }

  if (activeSection === "notifications") {
    return (
      <PlaceholderSection
        title="Notifications Center"
        description="Stay updated with system logs, verification warnings, and admin notices here. Currently, there are no unread system notifications."
        icon={Bell}
      />
    );
  }

  if (activeSection === "settings") {
    return (
      <PlaceholderSection
        title="System Settings"
        description="Configure platform fees, Stripe keys, and general host requirements. System configurations are currently running on default values."
        icon={Settings}
      />
    );
  }

  if (activeSection === "help") {
    return (
      <PlaceholderSection
        title="Help & Support"
        description="Need assistance managing users or listings? Browse platform docs or contact system support engineers."
        icon={HelpCircle}
      />
    );
  }

  return <Dashboard />;
};

export default ContentArea;
