// src/components/parents/ChildrenList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import FeeStatusBadge from '../students/FeeStatusBadge';

const ChildrenList = ({ children, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!children || children.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-3">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
          </svg>
        </div>
        <h3 className="text-md font-medium text-gray-900 mb-1">No children linked</h3>
        <p className="text-gray-500 text-sm">This parent has no children linked to their account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {children.map((child) => (
        <div key={child.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <Link
                  to={`/students/${child.id}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                  {child.full_name}
                </Link>
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">
                  {child.class_level_name || 'No Class'}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Admission: {child.admission_number} • ID: {child.student_id}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FeeStatusBadge status={child.fee_status} />
              <span className={`text-sm ${child.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {child.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          {child.balance_due > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Balance Due:</span>
                <span className="font-medium text-red-600">
                  ₦{parseFloat(child.balance_due).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChildrenList;