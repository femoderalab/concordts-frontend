import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../dashboard/DashboardLayout';

const StaffLayout = () => {
  return (
    <DashboardLayout>
      <Outlet /> {/* This renders the nested routes */}
    </DashboardLayout>
  );
};

export default StaffLayout;