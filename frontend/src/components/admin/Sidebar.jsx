// components/Sidebar.jsx
import React from "react";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  Package,
  ShoppingCart,
  FileText,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  activeSection,
  setActiveSection,
  onSignOut,
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "users", label: "Users", icon: Users },
    { id: "allrooms", label: "All Rooms", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "analytics", label: "Analytics new", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const bottomMenuItems = [
    { id: "help", label: "Help & Support", icon: HelpCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col overflow-hidden"
      aria-label="Sidebar"
    >
      {/* Brand */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">AdminPro</h1>
        <p className="text-slate-400 text-sm mt-1">Dashboard v2.0</p>
      </div>

      {/* Main nav (no scrollbar shown) */}
      <nav
        className="
          flex-1 p-4 overflow-y-hidden
          [scrollbar-width:none]              /* Firefox hide */
          [-ms-overflow-style:none]           /* IE/Edge legacy */
          [&::-webkit-scrollbar]:hidden       /* WebKit hide */
        "
        role="navigation"
      >
        <ul className="space-y-2">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setActiveSection?.(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span className="font-medium">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <ul className="space-y-2">
          {bottomMenuItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setActiveSection?.(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span className="font-medium">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <LogOut size={20} aria-hidden="true" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
