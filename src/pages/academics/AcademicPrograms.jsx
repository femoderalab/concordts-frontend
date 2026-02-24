// school-management-frontend/src/pages/academics/AcademicPrograms.jsx
import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { BookOpen } from 'lucide-react';

const AcademicPrograms = () => {
  return (
    <DashboardLayout title="Academic Programs">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Academic Programs</h1>
            <p className="text-gray-600">
              Manage academic programs (Creche, Nursery, Primary, JSS, SSS)
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Academic Programs</h3>
          <p className="text-gray-600">
            This page is under construction. It will allow you to manage all academic programs.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Features: Create, view, update, and delete academic programs.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AcademicPrograms;