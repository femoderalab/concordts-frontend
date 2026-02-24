import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const TeacherProfileForm = ({ teacherProfile = {}, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    teacher_type: teacherProfile.teacher_type || 'subject_teacher',
    stream_specialization: teacherProfile.stream_specialization || 'none',
    max_periods_per_week: teacherProfile.max_periods_per_week || 40,
    preferred_periods: teacherProfile.preferred_periods || 35,
    years_of_teaching_experience: teacherProfile.years_of_teaching_experience || 0,
    previous_schools: teacherProfile.previous_schools || '',
    workshops_attended: teacherProfile.workshops_attended || '',
    training_certificates: teacherProfile.training_certificates || '',
    conferences_attended: teacherProfile.conferences_attended || '',
    research_publications: teacherProfile.research_publications || '',
    has_teaching_materials: teacherProfile.has_teaching_materials || false,
    teaching_materials_description: teacherProfile.teaching_materials_description || '',
    additional_responsibilities: teacherProfile.additional_responsibilities || '',
  });

  const teacherTypes = [
    { value: 'class_teacher', label: 'Class Teacher' },
    { value: 'subject_teacher', label: 'Subject Teacher' },
    { value: 'both', label: 'Class & Subject Teacher' },
    { value: 'head_of_department', label: 'Head of Department' },
    { value: 'vice_principal_academic', label: 'Vice Principal (Academic)' },
    { value: 'principal', label: 'Principal' },
    { value: 'assistant_teacher', label: 'Assistant Teacher' },
    { value: 'special_education', label: 'Special Education Teacher' },
  ];

  const streamSpecializations = [
    { value: 'science', label: 'Science' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'arts', label: 'Arts/Humanities' },
    { value: 'technical', label: 'Technical' },
    { value: 'general', label: 'General (All Streams)' },
    { value: 'none', label: 'Not Applicable' },
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Teacher Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher Type
            </label>
            <select
              name="teacher_type"
              value={formData.teacher_type}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              {teacherTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stream Specialization
            </label>
            <select
              name="stream_specialization"
              value={formData.stream_specialization}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {streamSpecializations.map(stream => (
                <option key={stream.value} value={stream.value}>
                  {stream.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Max Periods Per Week"
            name="max_periods_per_week"
            type="number"
            value={formData.max_periods_per_week}
            onChange={handleChange}
            min="0"
            max="60"
          />

          <Input
            label="Preferred Periods Per Week"
            name="preferred_periods"
            type="number"
            value={formData.preferred_periods}
            onChange={handleChange}
            min="0"
            max={formData.max_periods_per_week}
          />

          <Input
            label="Years of Teaching Experience"
            name="years_of_teaching_experience"
            type="number"
            value={formData.years_of_teaching_experience}
            onChange={handleChange}
            min="0"
            max="50"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Development</h3>
        
        <div className="space-y-4">
          <Input
            label="Previous Schools"
            name="previous_schools"
            value={formData.previous_schools}
            onChange={handleChange}
            placeholder="List previous schools taught at"
            multiline
            rows={3}
          />

          <Input
            label="Workshops Attended"
            name="workshops_attended"
            value={formData.workshops_attended}
            onChange={handleChange}
            placeholder="Professional development workshops attended"
            multiline
            rows={3}
          />

          <Input
            label="Training Certificates"
            name="training_certificates"
            value={formData.training_certificates}
            onChange={handleChange}
            placeholder="Training certificates obtained"
            multiline
            rows={3}
          />

          <Input
            label="Conferences Attended"
            name="conferences_attended"
            value={formData.conferences_attended}
            onChange={handleChange}
            placeholder="Conferences attended"
            multiline
            rows={3}
          />

          <Input
            label="Research Publications"
            name="research_publications"
            value={formData.research_publications}
            onChange={handleChange}
            placeholder="Research publications"
            multiline
            rows={3}
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Teaching Resources</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="has_teaching_materials"
              checked={formData.has_teaching_materials}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Has personal teaching materials
            </label>
          </div>

          {formData.has_teaching_materials && (
            <Input
              label="Teaching Materials Description"
              name="teaching_materials_description"
              value={formData.teaching_materials_description}
              onChange={handleChange}
              placeholder="Describe your teaching materials"
              multiline
              rows={3}
            />
          )}

          <Input
            label="Additional Responsibilities"
            name="additional_responsibilities"
            value={formData.additional_responsibilities}
            onChange={handleChange}
            placeholder="Additional responsibilities (clubs, sports, etc.)"
            multiline
            rows={3}
          />
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
          {teacherProfile.id ? 'Update Teacher Profile' : 'Create Teacher Profile'}
        </Button>
      </div>
    </form>
  );
};

export default TeacherProfileForm;