import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const Staff = () => {
  return (
    <DashboardLayout title="Staff">
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4"> Management</h2>
        <p className="text-gray-600">Staff overview page content will go here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Staff;