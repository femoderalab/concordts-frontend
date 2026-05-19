/**
 * Parent Statistics Cards Component
 */

import React from 'react';
import { Users, UserCheck, Award, RefreshCw } from 'lucide-react';

const StatCard = ({ label, value, icon, colorClass, loading }) => (
  <div className={`flex items-center gap-3 bg-white border rounded-2xl p-4 shadow-sm ${colorClass}`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
      {icon}
    </div>
    <div>
      {loading ? (
        <div className="w-16 h-7 bg-gray-200 rounded animate-pulse"></div>
      ) : (
        <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
      )}
      <p className="text-[11px] text-gray-500 font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

const ParentStatsCards = ({ statistics, loading }) => {
  const stats = [
    { 
      label: 'Total Parents', 
      value: statistics?.overall?.total_parents || 0, 
      icon: <Users size={16} />, 
      color: 'text-blue-600 bg-blue-50 border-blue-100' 
    },
    { 
      label: 'Active Parents', 
      value: statistics?.overall?.active_parents || 0, 
      icon: <UserCheck size={16} />, 
      color: 'text-green-600 bg-green-50 border-green-100' 
    },
    { 
      label: 'PTA Members', 
      value: statistics?.overall?.pta_members || 0, 
      icon: <Award size={16} />, 
      color: 'text-purple-600 bg-purple-50 border-purple-100' 
    },
    { 
      label: 'Total Children', 
      value: statistics?.children?.total_children || 0, 
      icon: <Users size={16} />, 
      color: 'text-amber-600 bg-amber-50 border-amber-100' 
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <StatCard key={i} {...s} loading={loading} />
      ))}
    </div>
  );
};

export default ParentStatsCards;