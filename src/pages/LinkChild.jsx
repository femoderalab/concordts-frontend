// src/pages/LinkChild.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import useAuth from '../hooks/useAuth';
import { linkChildToParent } from '../services/parentService';
import { searchStudents } from '../services/studentService';
import { getParents } from '../services/parentService';
import { handleApiError } from '../services/api';

const LinkChild = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.role === 'head' || user?.role === 'principal' || user?.role === 'vice_principal' || user?.role === 'secretary' || user?.is_staff;
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);
  
  // Form state
  const [formData, setFormData] = useState({
    student_admission_number: '',
    parent_id: '',
    relationship_type: 'father',
  });
  
  // Search results
  const [studentSearchResults, setStudentSearchResults] = useState([]);
  const [parentSearchResults, setParentSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Search for student
  const searchStudent = async () => {
    if (!formData.student_admission_number.trim()) {
      setError('Please enter an admission number');
      return;
    }

    try {
      setSearching(true);
      setError('');
      setSelectedStudent(null);
      
      const results = await searchStudents({
        admission_number: formData.student_admission_number,
      });
      
      if (results.length === 0) {
        setError('No student found with that admission number');
      } else {
        setStudentSearchResults(results);
        if (results.length === 1) {
          setSelectedStudent(results[0]);
        }
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setSearching(false);
    }
  };

  // Search for parent
  const searchParent = async () => {
    if (!formData.parent_id.trim()) {
      setError('Please enter a parent ID');
      return;
    }

    try {
      setSearching(true);
      setError('');
      setSelectedParent(null);
      
      const results = await getParents({
        parent_id: formData.parent_id,
      });
      
      if (results.length === 0) {
        setError('No parent found with that ID');
      } else {
        setParentSearchResults(results);
        if (results.length === 1) {
          setSelectedParent(results[0]);
        }
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setSearching(false);
    }
  };

  // Select student from search results
  const selectStudent = (student) => {
    setSelectedStudent(student);
    setFormData(prev => ({ ...prev, student_admission_number: student.admission_number }));
    setStudentSearchResults([]);
  };

  // Select parent from search results
  const selectParent = (parent) => {
    setSelectedParent(parent);
    setFormData(prev => ({ ...prev, parent_id: parent.parent_id }));
    setParentSearchResults([]);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.student_admission_number.trim()) {
      errors.student_admission_number = 'Student admission number is required';
    }
    
    if (!formData.parent_id.trim()) {
      errors.parent_id = 'Parent ID is required';
    }
    
    if (!formData.relationship_type) {
      errors.relationship_type = 'Relationship type is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      setError('Please fix all errors in the form');
      return;
    }

    if (!selectedStudent) {
      setError('Please select a student from search results');
      return;
    }

    if (!selectedParent) {
      setError('Please select a parent from search results');
      return;
    }

    try {
      setLoading(true);
      
      const linkData = {
        student_admission_number: selectedStudent.admission_number,
        parent_id: selectedParent.parent_id,
        relationship_type: formData.relationship_type,
      };
      
      const response = await linkChildToParent(linkData);
      
      setSuccess(`Successfully linked ${selectedStudent.full_name} to ${selectedParent.user.first_name} ${selectedParent.user.last_name} as ${formData.relationship_type}`);
      
      // Reset form
      setFormData({
        student_admission_number: '',
        parent_id: '',
        relationship_type: 'father',
      });
      setSelectedStudent(null);
      setSelectedParent(null);
      setStudentSearchResults([]);
      setParentSearchResults([]);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error linking child:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="bg-white rounded-xl shadow-soft p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to link children to parents.</p>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Link Child to Parent">
      {/* Success Alert */}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
          className="mb-6"
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Link Child to Parent</h1>
          <p className="text-gray-600 mt-2">
            Link an existing student to a parent account. This establishes the parent-child relationship in the system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Search Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">1. Find Student</h3>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  label="Student Admission Number *"
                  name="student_admission_number"
                  value={formData.student_admission_number}
                  onChange={handleChange}
                  placeholder="e.g., ADM/2024/001"
                  error={fieldErrors.student_admission_number}
                  disabled={loading || searching}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={searchStudent}
                  loading={searching}
                  disabled={loading || searching}
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Student Search Results */}
            {studentSearchResults.length > 0 && !selectedStudent && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h4 className="font-medium text-gray-700">Search Results</h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {studentSearchResults.map((student) => (
                    <div
                      key={student.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => selectStudent(student)}
                    >
                      <div className="font-medium text-gray-800">{student.full_name}</div>
                      <div className="text-sm text-gray-600">
                        Admission: {student.admission_number} • Class: {student.class_level_name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Student */}
            {selectedStudent && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-green-800">Selected Student</h4>
                    <div className="mt-1">
                      <div className="font-medium text-gray-800">{selectedStudent.full_name}</div>
                      <div className="text-sm text-gray-600">
                        Admission: {selectedStudent.admission_number} • Class: {selectedStudent.class_level_name}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudent(null);
                      setFormData(prev => ({ ...prev, student_admission_number: '' }));
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Parent Search Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">2. Find Parent</h3>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  label="Parent ID *"
                  name="parent_id"
                  value={formData.parent_id}
                  onChange={handleChange}
                  placeholder="e.g., PAR123456"
                  error={fieldErrors.parent_id}
                  disabled={loading || searching}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={searchParent}
                  loading={searching}
                  disabled={loading || searching}
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Parent Search Results */}
            {parentSearchResults.length > 0 && !selectedParent && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h4 className="font-medium text-gray-700">Search Results</h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {parentSearchResults.map((parent) => (
                    <div
                      key={parent.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => selectParent(parent)}
                    >
                      <div className="font-medium text-gray-800">
                        {parent.user.first_name} {parent.user.last_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        ID: {parent.parent_id} • Type: {parent.parent_type_display} • Children: {parent.children_count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Parent */}
            {selectedParent && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-blue-800">Selected Parent</h4>
                    <div className="mt-1">
                      <div className="font-medium text-gray-800">
                        {selectedParent.user.first_name} {selectedParent.user.last_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        ID: {selectedParent.parent_id} • Type: {selectedParent.parent_type_display}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedParent(null);
                      setFormData(prev => ({ ...prev, parent_id: '' }));
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Relationship Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">3. Set Relationship</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship Type *</label>
              <select
                name="relationship_type"
                value={formData.relationship_type}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  fieldErrors.relationship_type ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
                required
              >
                <option value="father">Father</option>
                <option value="mother">Mother</option>
              </select>
              {fieldErrors.relationship_type && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.relationship_type}</p>
              )}
            </div>

            {/* Summary */}
            {selectedStudent && selectedParent && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">Link Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Student:</span>
                    <span className="font-medium">{selectedStudent.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parent:</span>
                    <span className="font-medium">{selectedParent.user.first_name} {selectedParent.user.last_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Relationship:</span>
                    <span className="font-medium">{formData.relationship_type === 'father' ? 'Father' : 'Mother'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !selectedStudent || !selectedParent}
              className="w-full"
            >
              {loading ? 'Linking...' : 'Link Child to Parent'}
            </Button>
          </div>
        </form>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            to="/parents"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Parents Management
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LinkChild;