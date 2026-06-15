import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';


const Header = ({ activeSection }) => {
  const getSectionTitle = (section) => {
    const titles = {
      dashboard: 'Dashboard',
      add_home: 'Add new home',
      products: 'Product Catalog',
      orders: 'Order Management',
      analytics: 'Analytics & Insights',
      reports: 'Reports',
      notifications: 'Notifications',
      help: 'Help & Support',
      settings: 'Settings',
    };
    return titles[section] || 'Dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{getSectionTitle(activeSection)}</h1>
          <p className="text-slate-600 text-sm mt-1">Welcome back, manage your admin panel</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
          
          <button className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </button>
          
          <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">John Doe</p>
              <p className="text-xs text-slate-600">Administrator</p>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;