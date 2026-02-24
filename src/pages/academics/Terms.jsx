import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const Terms = () => {
  return (
    <DashboardLayout title="Terms">
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Terms Management</h2>
        <p className="text-gray-600">Terms management content will go here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Terms;