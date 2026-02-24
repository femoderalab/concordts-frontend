import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StaffList from './StaffList';
import StaffCreate from './StaffCreate';
import StaffDetail from './StaffDetail';
import StaffEdit from './StaffEdit';

const Staff = () => {
  return (
    <Routes>
      <Route path="/" element={<StaffList />} />
      <Route path="create" element={<StaffCreate />} />
      <Route path=":id" element={<StaffDetail />} />
      <Route path=":id/edit" element={<StaffEdit />} />
      <Route path="*" element={<Navigate to="/staff" replace />} />
    </Routes>
  );
};

export default Staff;