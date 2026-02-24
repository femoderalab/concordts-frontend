import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const StaffForm = ({ staff = {}, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    user_id: staff.user?.id || '',
    department: staff.department || 'academic',
    position_title: staff.position_title || '',
    employment_type: staff.employment_type || 'full_time',
    employment_date: staff.employment_date || new Date().toISOString().split('T')[0],
    highest_qualification: staff.highest_qualification || '',
    qualification_institution: staff.qualification_institution || '',
    year_of_graduation: staff.year_of_graduation || '',
    trcn_number: staff.trcn_number || '',
    trcn_expiry_date: staff.trcn_expiry_date || '',
    specialization: staff.specialization || '',
    basic_salary: staff.basic_salary || 0,
    salary_scale: staff.salary_scale || '',
    salary_step: staff.salary_step || 1,
    bank_name: staff.bank_name || '',
    account_name: staff.account_name || '',
    account_number: staff.account_number || '',
    annual_leave_days: staff.annual_leave_days || 21,
    sick_leave_days: staff.sick_leave_days || 10,
    next_of_kin_name: staff.next_of_kin_name || '',
    next_of_kin_relationship: staff.next_of_kin_relationship || '',
    next_of_kin_phone: staff.next_of_kin_phone || '',
    next_of_kin_address: staff.next_of_kin_address || '',
    blood_group: staff.blood_group || '',
    genotype: staff.genotype || '',
    medical_conditions: staff.medical_conditions || '',
    allergies: staff.allergies || '',
    emergency_contact_name: staff.emergency_contact_name || '',
    emergency_contact_phone: staff.emergency_contact_phone || '',
    emergency_contact_relationship: staff.emergency_contact_relationship || '',
    years_of_experience: staff.years_of_experience || 0,
    previous_employers: staff.previous_employers || '',
    references: staff.references || '',
    is_active: staff.is_active !== undefined ? staff.is_active : true,
    is_on_probation: staff.is_on_probation || false,
  });

  const departments = [
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
    { value: 'full_time', label: 'Full-Time' },
    { value: 'part_time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'volunteer', label: 'Volunteer' },
  ];

  const bloodGroups = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  const genotypes = [
    'AA', 'AS', 'SS', 'AC'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="User ID"
            name="user_id"
            type="number"
            value={formData.user_id}
            onChange={handleChange}
            required
            placeholder="Enter existing user ID"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              {departments.map(dept => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Position Title"
            name="position_title"
            value={formData.position_title}
            onChange={handleChange}
            placeholder="e.g., Mathematics Teacher"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employment Type
            </label>
            <select
              name="employment_type"
              value={formData.employment_type}
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

          <Input
            label="Employment Date"
            name="employment_date"
            type="date"
            value={formData.employment_date}
            onChange={handleChange}
            required
          />

          <Input
            label="Basic Salary (₦)"
            name="basic_salary"
            type="number"
            value={formData.basic_salary}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Qualifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Highest Qualification"
            name="highest_qualification"
            value={formData.highest_qualification}
            onChange={handleChange}
            placeholder="e.g., B.Sc, M.Ed, PhD"
          />

          <Input
            label="Institution"
            name="qualification_institution"
            value={formData.qualification_institution}
            onChange={handleChange}
            placeholder="University/College name"
          />

          <Input
            label="Year of Graduation"
            name="year_of_graduation"
            type="number"
            value={formData.year_of_graduation}
            onChange={handleChange}
            placeholder="YYYY"
          />

          <Input
            label="TRCN Number"
            name="trcn_number"
            value={formData.trcn_number}
            onChange={handleChange}
            placeholder="TRCN registration number"
          />

          <Input
            label="TRCN Expiry Date"
            name="trcn_expiry_date"
            type="date"
            value={formData.trcn_expiry_date}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <Input
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Areas of expertise"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Bank Name"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleChange}
            placeholder="e.g., First Bank"
          />

          <Input
            label="Account Name"
            name="account_name"
            value={formData.account_name}
            onChange={handleChange}
            placeholder="Name as in bank"
          />

          <Input
            label="Account Number"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
            placeholder="10-digit account number"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Health Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Group
            </label>
            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genotype
            </label>
            <select
              name="genotype"
              value={formData.genotype}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select Genotype</option>
              {genotypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Medical Conditions"
              name="medical_conditions"
              value={formData.medical_conditions}
              onChange={handleChange}
              placeholder="Any known medical conditions"
              multiline
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="Known allergies"
              multiline
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {staff.id ? 'Update Staff' : 'Create Staff'}
        </Button>
      </div>
    </form>
  );
};

export default StaffForm;