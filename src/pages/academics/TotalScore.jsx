import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const TotalScore = () => {
  return (
    <DashboardLayout title="Total Score Reports">
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Score Reports</h2>
        <p className="text-gray-600">Total score reports content will go here.</p>
      </div>
    </DashboardLayout>
  );
};

export default TotalScore;