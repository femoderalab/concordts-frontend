// src/pages/parents/components/ParentStatsCards.jsx
import React from 'react';
import { Card, Text } from '../../../components/ui';
import { Users, UserCheck, Award, TrendingUp } from 'lucide-react';

export const ParentStatsCards = ({ stats, loading }) => {
  const statCards = [
    { label: 'Total Parents', value: stats.total, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Active Parents', value: stats.active, icon: UserCheck, color: 'bg-green-100 text-green-600' },
    { label: 'PTA Members', value: stats.ptaMembers, icon: Award, color: 'bg-purple-100 text-purple-600' },
    { label: 'Total Children', value: stats.totalChildren, icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {statCards.map((stat, idx) => (
        <Card key={idx} className="p-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon size={14} />
            </div>
            <div>
              {loading ? <div className="w-12 h-5 bg-gray-200 rounded animate-pulse"></div> : <Text variant="h4" className="font-bold text-gray-800">{stat.value}</Text>}
              <Text variant="tiny" className="text-gray-400">{stat.label}</Text>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};