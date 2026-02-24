// src/pages/Reports.jsx
import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const Reports = () => {
  return (
    <DashboardLayout title="Reports">
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports</h2>
        <p className="text-gray-600">Reports overview page content will go here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Reports;