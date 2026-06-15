import React from "react";

const OverviewItem = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl shadow-md transition-shadow">
    <div className="flex-shrink-0">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

export default OverviewItem;
