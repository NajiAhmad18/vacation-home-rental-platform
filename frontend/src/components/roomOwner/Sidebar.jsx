import {
  Home,
  HousePlus,
  BarChart3,
  FileText,
  Bell,
  HelpCircle,
  LogOut,
  Star,
  Building2,
  Calendar,
  Settings,
  CalendarDays,
} from "lucide-react";

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    // Dashboard
    { id: "dashboard", label: "Dashboard", icon: Home },

    // Homes Management
    { id: "all-homes", label: "All Homes", icon: Building2 },
    { id: "add-home", label: "Add New Home", icon: HousePlus },

    // Bookings
    { id: "active-bookings", label: "Active Bookings", icon: Calendar },
    { id: "all-bookings", label: "All Bookings", icon: CalendarDays },

    // Financials
    { id: "revenue", label: "Revenue", icon: BarChart3 },

    // Reviews
    { id: "reviews", label: "Reviews", icon: Star },

    // Notifications & Messages
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const bottomMenuItems = [
    { id: "help", label: "Help & Support", icon: HelpCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="bg-slate-900 text-white w-64 h-screen flex flex-col fixed left-0 top-0">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">Owner Panel</h1>
        <p className="text-slate-400 text-sm mt-1">Dashboard v2.0</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {" "}
          {/* smaller spacing */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-slate-700">
        <div className="space-y-2">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sign Out */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
