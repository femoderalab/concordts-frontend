import React, { useRef, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import Button from '../../components/common/Button';

const ParentFilters = ({ filters, onFilterChange, onApply, onClear, show, onToggle, hasActiveFilters }) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && show) {
        onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`inline-flex items-center px-3 py-1.5 border rounded-xl transition-colors text-xs ${
          show 
            ? 'bg-secondary-100 border-secondary-300 text-secondary-700' 
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Filter size={12} className="mr-1.5" />
        Filters
        {hasActiveFilters && (
          <span className="ml-1.5 w-1.5 h-1.5 bg-secondary-500 rounded-full"></span>
        )}
      </button>

      {show && (
        <div className="absolute right-0 mt-1 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800 text-sm">Filter Parents</h3>
              <button onClick={onClear} className="text-xs text-secondary-600 hover:text-secondary-700">
                Clear all
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Parent Type</label>
                <select
                  value={filters.parent_type}
                  onChange={(e) => onFilterChange('parent_type', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="">All Types</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                  <option value="relative">Relative</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Marital Status</label>
                <select
                  value={filters.marital_status}
                  onChange={(e) => onFilterChange('marital_status', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="">All Status</option>
                  <option value="married">Married</option>
                  <option value="single">Single</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.is_active}
                  onChange={(e) => onFilterChange('is_active', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="">All</option>
                  <option value="true">Active Only</option>
                  <option value="false">Archived Only</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">PTA Membership</label>
                <select
                  value={filters.is_pta_member}
                  onChange={(e) => onFilterChange('is_pta_member', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="">All</option>
                  <option value="true">PTA Members</option>
                  <option value="false">Non-PTA</option>
                </select>
              </div>
            </div>
            
            <Button onClick={onApply} className="w-full mt-4 bg-secondary-500 hover:bg-secondary-600 text-white py-1.5 text-xs">
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentFilters;