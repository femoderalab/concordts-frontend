// src/components/parents/ParentRow.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PTABadge from './PTABadge';

const ParentRow = ({ parent, onEdit, onDelete, onView, currentUser }) => {
  const canEdit = currentUser?.role === 'head' || 
                  currentUser?.role === 'principal' || 
                  currentUser?.role === 'vice_principal' || 
                  currentUser?.role === 'secretary' ||
                  currentUser?.is_staff;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-semibold">
                {parent.user?.first_name?.[0] || 'P'}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {parent.user?.first_name} {parent.user?.last_name}
            </div>
            <div className="text-sm text-gray-500">
              ID: {parent.parent_id}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{parent.parent_type_display}</div>
        <div className="text-sm text-gray-500">{parent.occupation || 'Not specified'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className={`px-2 py-1 text-xs rounded-full ${parent.children_count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {parent.children_count || 0} child{parent.children_count !== 1 ? 'ren' : ''}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{parent.user?.phone_number}</div>
        <div className="text-sm text-gray-500">{parent.user?.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${parent.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {parent.is_active ? 'Active' : 'Inactive'}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${parent.is_verified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {parent.is_verified ? 'Verified' : 'Pending'}
          </span>
          <PTABadge isPTAMember={parent.is_pta_member} />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <Link
            to={`/parents/${parent.id}`}
            className="text-primary-600 hover:text-primary-900"
          >
            View
          </Link>
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(parent)}
                className="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(parent)}
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

export default ParentRow;