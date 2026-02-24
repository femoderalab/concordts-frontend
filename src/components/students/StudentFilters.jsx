import React from 'react';
import { Filter } from 'lucide-react';

const StudentFilters = () => {
  const classes = ['All Classes', '10A', '10B', '9A', '9B', '8A', '8B'];
  const ageRanges = ['All Ages', '13-15', '16-18', '19-21'];
  const grades = ['All Grades', 'A', 'B', 'C', 'D', 'F'];

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select className="input-field">
          {classes.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
        
        <select className="input-field">
          {ageRanges.map((age) => (
            <option key={age} value={age}>{age}</option>
          ))}
        </select>
        
        <select className="input-field">
          {grades.map((grade) => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center space-x-3">
        <button className="btn-outline flex items-center space-x-2">
          <Filter size={16} />
          <span>All Filters</span>
        </button>
      </div>
    </div>
  );
};

export default StudentFilters;