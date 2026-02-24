// src/components/parents/ParentTable.jsx
import React from 'react';
import ParentRow from './ParentRow';
import Loader from '../common/Loader';

const ParentTable = ({ parents, loading, onEdit, onDelete, onView, currentUser }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader text="Loading parents..." />
      </div>
    );
  }

  if (!parents || parents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No parents found</h3>
        <p className="text-gray-500">Start by adding parents to the system.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Parent
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Children
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {parents.map((parent) => (
            <ParentRow
              key={parent.id}
              parent={parent}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              currentUser={currentUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParentTable;