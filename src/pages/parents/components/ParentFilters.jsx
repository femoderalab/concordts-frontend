// src/pages/parents/components/ParentFilters.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Text, Button } from '../../../components/ui';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

export const ParentFilters = ({ searchTerm, setSearchTerm, filters, setFilters, onApply, onClear, hasActiveFilters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilters(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (name, value) => setFilters(prev => ({ ...prev, [name]: value }));

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-2">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && onApply()}
          placeholder="Search by name, email, phone, or parent ID..." className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <select value={filters.parent_type} onChange={(e) => handleFilterChange('parent_type', e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm">
          <option value="">All Types</option><option value="father">Father</option><option value="mother">Mother</option>
          <option value="guardian">Guardian</option><option value="relative">Relative</option><option value="other">Other</option>
        </select>
        <select value={filters.is_active} onChange={(e) => handleFilterChange('is_active', e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm">
          <option value="">All Status</option><option value="true">Active</option><option value="false">Archived</option>
        </select>
        <select value={filters.is_pta_member} onChange={(e) => handleFilterChange('is_pta_member', e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm">
          <option value="">PTA Status</option><option value="true">PTA Member</option><option value="false">Non-PTA</option>
        </select>
        {hasActiveFilters && <Button variant="ghost" size="tiny" onClick={onClear}>Clear</Button>}
        <Button variant="primary" size="small" onClick={onApply}>Apply</Button>
      </div>

      <div className="relative sm:hidden" ref={filterRef}>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium w-full">
          <Filter size={14} /> Filter {hasActiveFilters && <span className="w-2 h-2 bg-[#D94801] rounded-full" />}
          <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        {showFilters && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-20 p-4">
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Parent Type</label>
                <select value={filters.parent_type} onChange={(e) => handleFilterChange('parent_type', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm">
                  <option value="">All Types</option><option value="father">Father</option><option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                </select>
              </div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select value={filters.is_active} onChange={(e) => handleFilterChange('is_active', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm">
                  <option value="">All</option><option value="true">Active</option><option value="false">Archived</option>
                </select>
              </div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">PTA Member</label>
                <select value={filters.is_pta_member} onChange={(e) => handleFilterChange('is_pta_member', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm">
                  <option value="">All</option><option value="true">Yes</option><option value="false">No</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="small" onClick={onClear} className="flex-1">Clear</Button>
                <Button variant="primary" size="small" onClick={() => { onApply(); setShowFilters(false); }} className="flex-1">Apply</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};