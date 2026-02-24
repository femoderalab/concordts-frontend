import React, { useState } from 'react';
import Input from '../common/Input';

const StaffFilters = ({ filters, onChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const departments = [
    { value: '', label: 'All Departments' },
    { value: 'academic', label: 'Academic' },
    { value: 'administration', label: 'Administration' },
    { value: 'finance', label: 'Finance/Bursary' },
    { value: 'library', label: 'Library' },
    { value: 'ict', label: 'ICT/Computer' },
    { value: 'security', label: 'Security' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'health', label: 'Health Clinic' },
    { value: 'counseling', label: 'Guidance & Counseling' },
  ];

  const employmentTypes = [
    { value: '', label: 'All Types' },
    { value: 'full_time', label: 'Full-Time' },
    { value: 'part_time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'trainee', label: 'Trainee/Intern' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    const newFilters = { ...localFilters, search: value };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      department: '',
      employment_type: '',
      is_active: '',
      search: ''
    };
    setLocalFilters(clearedFilters);
    onChange(clearedFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <Input
            type="text"
            placeholder="Search by name, staff ID, or position..."
            value={localFilters.search || ''}
            onChange={handleSearch}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            name="department"
            value={localFilters.department || ''}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {departments.map(dept => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employment Type
          </label>
          <select
            name="employment_type"
            value={localFilters.employment_type || ''}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {employmentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="is_active"
            value={localFilters.is_active || ''}
            onChange={handleChange}
            className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleClear}
          className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default StaffFilters;