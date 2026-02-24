import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StudentTable from '../components/students/StudentTable';

const Students = () => {
  return (
    <DashboardLayout title="Students">
      <StudentTable />
    </DashboardLayout>
  );
};

export default Students;