import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const Exam = () => {
  return (
    <DashboardLayout title="Exam Reports">
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Exam Reports</h2>
        <p className="text-gray-600">Exam reports content will go here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Exam;