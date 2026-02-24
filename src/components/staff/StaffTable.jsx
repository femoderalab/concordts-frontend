import React from 'react';
import StaffRow from './StaffRow';

const StaffTable = ({ staff, onEdit, onDelete, onView, onActivate, onDeactivate, currentUserRole }) => {
  // Check if user has admin permissions
  const isAdmin = currentUserRole === 'head' || currentUserRole === 'principal' || 
                  currentUserRole === 'vice_principal' || currentUserRole === 'secretary';

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No staff members found
                </td>
              </tr>
            ) : (
              staff.map((staffMember) => (
                <StaffRow
                  key={staffMember.id}
                  staff={staffMember}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  onActivate={onActivate}
                  onDeactivate={onDeactivate}
                  isAdmin={isAdmin}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffTable;