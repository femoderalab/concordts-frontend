/**
 * Student Card Component
 * Displays student information in a card format
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { formatFee, getFeeStatusColor, getFeeStatusLabel } from '../../utils/studentUtils';

const StudentCard = ({ student, showActions = true }) => {
  if (!student) return null;

  return (
    <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300 overflow-hidden">
      {/* Student Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Student Avatar */}
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
              {student.user?.first_name?.charAt(0) || 'S'}
            </div>
            
            {/* Student Info */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {student.user?.full_name || `${student.user?.first_name} ${student.user?.last_name}`}
              </h3>
              <p className="text-sm text-gray-600">{student.user?.registration_number}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {student.class_level_name || 'No Class'}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${getFeeStatusColor(student.fee_status)}`}>
                  {getFeeStatusLabel(student.fee_status)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className={`w-3 h-3 rounded-full ${student.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </div>

      {/* Student Details */}
      <div className="px-6 pb-6 border-t border-gray-100 pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Admission No:</span>
            <p className="font-medium">{student.admission_number}</p>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>
            <p className="font-medium truncate">{student.user?.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>
            <p className="font-medium">{student.user?.phone}</p>
          </div>
          <div>
            <span className="text-gray-500">Balance:</span>
            <p className={`font-medium ${student.balance_due > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatFee(student.balance_due)}
            </p>
          </div>
        </div>

        {/* Academic Performance */}
        {student.average_score > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Average Score:</span>
              <span className="font-semibold text-gray-800">{student.average_score.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(student.average_score, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex space-x-3 mt-6">
            <Link
              to={`/students/${student.id}`}
              className="flex-1 btn-outline py-2 text-center text-sm"
            >
              View Profile
            </Link>
            <Link
              to={`/students/${student.id}/dashboard`}
              className="flex-1 btn-primary py-2 text-center text-sm"
            >
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCard;