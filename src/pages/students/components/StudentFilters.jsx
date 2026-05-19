// src/pages/students/components/StudentFilters.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Text, Button } from '../../../components/ui';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

export const StudentFilters = ({ 
  searchTerm, setSearchTerm, 
  filters, setFilters, 
  classLevels, 
  onApply, 
  onClear,
  hasActiveFilters 
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply();
    setShowFilters(false);
  };

  const handleClear = () => {
    onClear();
    setShowFilters(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-2">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onApply()}
          placeholder="Search by name, admission number, email, or phone..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] focus:border-transparent"
        />
      </div>
      
      {/* Desktop filters */}
      <div className="hidden sm:flex items-center gap-2">
        <select
          value={filters.class_level}
          onChange={(e) => handleFilterChange('class_level', e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
        >
          <option value="">All Classes</option>
          {classLevels.map(level => (
            <option key={level.id} value={level.id}>{level.name}</option>
          ))}
        </select>
        
        <select
          value={filters.stream}
          onChange={(e) => handleFilterChange('stream', e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
        >
          <option value="">All Streams</option>
          <option value="science">Science</option>
          <option value="commercial">Commercial</option>
          <option value="art">Arts/Humanities</option>
          <option value="general">General</option>
          <option value="technical">Technical</option>
        </select>
        
        <select
          value={filters.fee_status}
          onChange={(e) => handleFilterChange('fee_status', e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
        >
          <option value="">Fee Status</option>
          <option value="paid_full">Paid in Full</option>
          <option value="paid_partial">Partially Paid</option>
          <option value="not_paid">Not Paid</option>
          <option value="scholarship">Scholarship</option>
          <option value="exempted">Exempted</option>
        </select>
        
        <select
          value={filters.is_active}
          onChange={(e) => handleFilterChange('is_active', e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Archived</option>
        </select>
        
        <select
          value={filters.is_graduated}
          onChange={(e) => handleFilterChange('is_graduated', e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
        >
          <option value="">All</option>
          <option value="true">Graduated</option>
          <option value="false">Not Graduated</option>
        </select>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="tiny" onClick={handleClear}>Clear</Button>
        )}
        
        <Button variant="primary" size="small" onClick={handleApply}>Apply</Button>
      </div>
      
      {/* Mobile filter button */}
      <div className="relative sm:hidden" ref={filterRef}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium w-full"
        >
          <Filter size={14} /> Filter {hasActiveFilters && <span className="w-2 h-2 bg-[#D94801] rounded-full" />}
          <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        {showFilters && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-20 p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Class Level</label>
                <select
                  value={filters.class_level}
                  onChange={(e) => handleFilterChange('class_level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="">All Classes</option>
                  {classLevels.map(level => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Stream</label>
                <select
                  value={filters.stream}
                  onChange={(e) => handleFilterChange('stream', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="">All Streams</option>
                  <option value="science">Science</option>
                  <option value="commercial">Commercial</option>
                  <option value="art">Arts/Humanities</option>
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fee Status</label>
                <select
                  value={filters.fee_status}
                  onChange={(e) => handleFilterChange('fee_status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="">All Status</option>
                  <option value="paid_full">Paid in Full</option>
                  <option value="paid_partial">Partially Paid</option>
                  <option value="not_paid">Not Paid</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="exempted">Exempted</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Student Status</label>
                <select
                  value={filters.is_active}
                  onChange={(e) => handleFilterChange('is_active', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="small" onClick={handleClear} className="flex-1">Clear</Button>
                <Button variant="primary" size="small" onClick={handleApply} className="flex-1">Apply</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};