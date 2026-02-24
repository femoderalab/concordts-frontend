/**
 * Student Enrollment Page
 * Enroll students in classes for specific sessions/terms
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Alert from '../components/common/Alert';
import Loader, { PageLoader } from '../components/common/Loader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import useAuth from '../hooks/useAuth';
import { getStudentById, createStudentEnrollment, getStudentEnrollments } from '../services/studentService';
import { handleApiError } from '../services/api';

const StudentEnrollment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State for student data
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State for enrollment form
  const [enrollmentData, setEnrollmentData] = useState({
    student_id: id,
    class_obj: '',
    session: '',
    term: '',
    is_repeating: false,
    remarks: '',
  });
  
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  // State for existing enrollments
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);

  // Fetch student data and enrollments
  useEffect(() => {
    if (id) {
      fetchStudentData();
      fetchEnrollments();
    }
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const studentData = await getStudentById(id);
      setStudent(studentData);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      setEnrollmentsLoading(true);
      
      const enrollmentData = await getStudentEnrollments({ student: id });
      setEnrollments(enrollmentData.results || enrollmentData || []);
      
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setEnrollmentData(prev => ({
      ...prev,
      [name]: inputValue,
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!enrollmentData.class_obj) errors.class_obj = 'Class is required';
    if (!enrollmentData.session) errors.session = 'Session is required';
    if (!enrollmentData.term) errors.term = 'Term is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      await createStudentEnrollment(enrollmentData);
      
      setSuccess('Student enrolled successfully!');
      setEnrollmentData({
        student_id: id,
        class_obj: '',
        session: '',
        term: '',
        is_repeating: false,
        remarks: '',
      });
      
      // Refresh enrollments
      fetchEnrollments();
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading && !student) {
    return <PageLoader text="Loading student information..." />;
  }

  if (!student) {
    return (
      <DashboardLayout title="Student Enrollment">
        <div className="text-center py-12">
          <p className="text-gray-600">Student not found.</p>
          <Link to="/students" className="mt-4 text-primary-600 hover:text-primary-700 font-medium">
            Back to Students
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Enroll Student: ${student.user?.full_name || 'Unknown'}`}>
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

      {/* Student Info Header */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
              {student.user?.first_name?.charAt(0) || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{student.user?.full_name}</h2>
              <p className="text-gray-600">{student.user?.registration_number} • {student.admission_number}</p>
              <p className="text-sm text-gray-500 mt-1">
                Current Class: {student.class_level_info?.name || 'Not assigned'}
              </p>
            </div>
          </div>
          <Link to={`/students/${id}`}>
            <Button variant="outline">View Profile</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrollment Form */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">New Enrollment</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Class *</label>
              <Input
                name="class_obj"
                type="number"
                value={enrollmentData.class_obj}
                onChange={handleInputChange}
                placeholder="Enter class ID"
                required
                error={fieldErrors.class_obj}
                disabled={saving}
                helperText="Enter the ID of the class to enroll in"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Session *</label>
                <Input
                  name="session"
                  type="number"
                  value={enrollmentData.session}
                  onChange={handleInputChange}
                  placeholder="Enter session ID"
                  required
                  error={fieldErrors.session}
                  disabled={saving}
                />
              </div>
              
              <div>
                <label className="label">Term *</label>
                <Input
                  name="term"
                  type="number"
                  value={enrollmentData.term}
                  onChange={handleInputChange}
                  placeholder="Enter term ID"
                  required
                  error={fieldErrors.term}
                  disabled={saving}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_repeating"
                name="is_repeating"
                checked={enrollmentData.is_repeating}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 rounded"
                disabled={saving}
              />
              <label htmlFor="is_repeating" className="ml-2 text-sm text-gray-700">
                Student is repeating this class
              </label>
            </div>
            
            <div>
              <label className="label">Remarks (Optional)</label>
              <Input
                name="remarks"
                type="textarea"
                value={enrollmentData.remarks}
                onChange={handleInputChange}
                placeholder="Any additional notes about this enrollment"
                rows={3}
                disabled={saving}
              />
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  loading={saving}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? 'Enrolling...' : 'Enroll Student'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/students/${id}`)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Existing Enrollments */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Existing Enrollments</h3>
            <button
              onClick={fetchEnrollments}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              disabled={enrollmentsLoading}
            >
              Refresh
            </button>
          </div>
          
          {enrollmentsLoading ? (
            <div className="text-center py-8">
              <Loader text="Loading enrollments..." />
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <p className="text-gray-600">No enrollments found for this student.</p>
              <p className="text-sm text-gray-500 mt-2">Add the first enrollment using the form.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        enrollment.status === 'active' ? 'bg-green-100 text-green-800' :
                        enrollment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        enrollment.status === 'withdrawn' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {enrollment.status_display}
                      </span>
                      {enrollment.is_repeating && (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                          Repeating
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(enrollment.enrollment_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-800">
                    {enrollment.class_info?.name || 'Unknown Class'}
                  </h4>
                  
                  <div className="text-sm text-gray-600 mt-1">
                    {enrollment.session_info?.name} • {enrollment.term_info?.name}
                  </div>
                  
                  {enrollment.remarks && (
                    <p className="text-sm text-gray-500 mt-2">{enrollment.remarks}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Enrolled by: {enrollment.enrolled_by_info?.name || 'Unknown'}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/enrollments/${enrollment.id}`}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3">Enrollment Statistics</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Total Enrollments</p>
                <p className="text-lg font-bold text-gray-800">{enrollments.length}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Active Enrollments</p>
                <p className="text-lg font-bold text-green-600">
                  {enrollments.filter(e => e.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentEnrollment;