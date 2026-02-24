import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const Attendance = () => {
  return (
    <DashboardLayout title="Attendance Reports">
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Reports</h2>
        <p className="text-gray-600">Attendance reports content will go here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;