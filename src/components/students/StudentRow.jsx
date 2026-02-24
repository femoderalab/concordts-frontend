import React from 'react';
import { Phone, MessageSquare, MoreVertical, Edit, Users, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import Dropdown from '../common/Dropdown';

const StudentRow = ({ student, selected, onSelect }) => {
  const statusColors = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning',
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900">{student.studentId}</span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-primary-700 font-semibold">
              {student.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{student.name}</div>
            <Badge variant={statusColors[student.status] || 'default'} className="mt-1">
              {student.status}
            </Badge>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-600">{student.gender}</span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-600">{student.age}</span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-600">{student.class}</span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={
          student.avgGrade === 'A' ? 'success' : 
          student.avgGrade === 'B' ? 'warning' : 'default'
        }>
          {student.avgGrade}
        </Badge>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className={`text-sm ${student.missedDays > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {student.missedDays} days
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors">
            <Phone size={16} />
          </button>
          
          <button className="p-1 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors">
            <MessageSquare size={16} />
          </button>
          
          <Dropdown
            trigger={
              <button className="p-1 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors">
                <MoreVertical size={16} />
              </button>
            }
          >
            <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors">
              <Edit size={14} />
              <span>Edit</span>
            </button>
            
            <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors">
              <Users size={14} />
              <span>Enroll Training</span>
            </button>
            
            <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors">
              <Users size={14} />
              <span>Add to Group</span>
            </button>
            
            <div className="border-t border-gray-200 my-1"></div>
            
            <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </Dropdown>
        </div>
      </td>
    </tr>
  );
};

export default StudentRow;