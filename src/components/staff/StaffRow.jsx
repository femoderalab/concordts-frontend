import React from 'react';
import StaffStatusBadge from './StaffStatusBadge';

const StaffRow = ({ staff, onEdit, onDelete, onView, onActivate, onDeactivate, isAdmin }) => {
  const getFullName = () => {
    if (staff.user && staff.user.first_name) {
      return `${staff.user.first_name} ${staff.user.last_name || ''}`.trim();
    }
    return 'N/A';
  };

  const getRoleDisplay = () => {
    if (staff.user && staff.user.role_display) {
      return staff.user.role_display;
    }
    return staff.user?.role || 'N/A';
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {getFullName().charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {getFullName()}
            </div>
            <div className="text-sm text-gray-500">
              {getRoleDisplay()}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-mono">{staff.staff_id}</div>
        <div className="text-sm text-gray-500">{staff.employee_number}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{staff.department_display || staff.department}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{staff.position_title || 'N/A'}</div>
        <div className="text-sm text-gray-500">
          {staff.employment_type_display || staff.employment_type}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StaffStatusBadge staff={staff} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => onView(staff.id)}
            className="text-blue-600 hover:text-blue-900"
          >
            View
          </button>
          
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(staff.id)}
                className="text-green-600 hover:text-green-900"
              >
                Edit
              </button>
              
              {staff.is_active ? (
                <button
                  onClick={() => onDeactivate(staff.id)}
                  className="text-yellow-600 hover:text-yellow-900"
                >
                  Deactivate
                </button>
              ) : (
                <button
                  onClick={() => onActivate(staff.id)}
                  className="text-green-600 hover:text-green-900"
                >
                  Activate
                </button>
              )}
              
              <button
                onClick={() => onDelete(staff.id)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default StaffRow;