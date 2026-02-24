import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import staffService from '../../services/staffService';
import { Users, BookOpen, Clock, Award } from 'lucide-react';

const TeacherProfiles = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!['head', 'principal', 'vice_principal', 'teacher', 'form_teacher', 'subject_teacher'].includes(user?.role)) {
      return;
    }
    fetchTeachers();
  }, [user]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await staffService.getAllTeachers();
      const teacherList = Array.isArray(response) ? response : response.results || [];
      setTeachers(teacherList);
      setFilteredTeachers(teacherList);
      setError('');
    } catch (err) {
      setError('Failed to load teacher profiles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
    
    if (filterType === 'all') {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(teacher => 
        teacher.teacher_type === filterType || 
        teacher.stream_specialization === filterType
      );
      setFilteredTeachers(filtered);
    }
  };

  const getExperienceColor = (years) => {
    if (years >= 10) return 'bg-purple-100 text-purple-800';
    if (years >= 5) return 'bg-blue-100 text-blue-800';
    if (years >= 2) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getWorkloadColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-100 text-red-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 50) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  if (!['head', 'principal', 'vice_principal', 'teacher', 'form_teacher', 'subject_teacher'].includes(user?.role)) {
    return (
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized Access</h2>
              <p className="text-gray-600">You do not have permission to access teacher profiles.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teacher Profiles</h1>
                <p className="mt-1 text-gray-600">View and manage all teacher profiles</p>
              </div>
              <Button
                onClick={() => window.location.href = '/staff/teachers/create'}
                variant="primary"
              >
                Add Teacher Profile
              </Button>
            </div>
          </div>

          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}

          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {['all', 'class_teacher', 'subject_teacher', 'head_of_department', 'science', 'commercial', 'arts'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => handleFilterChange(filterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterType.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
              ))}
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Teachers Found</h3>
              <p className="text-gray-600">No teacher profiles match the selected filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  {/* Teacher Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-2xl font-bold">
                          {teacher.staff?.user?.first_name?.charAt(0).toUpperCase() || 'T'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">
                          {teacher.staff?.user?.first_name} {teacher.staff?.user?.last_name}
                        </h3>
                        <p className="text-blue-100 text-sm">{teacher.teacher_type_display}</p>
                      </div>
                    </div>
                  </div>

                  {/* Teacher Details */}
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <BookOpen className="h-5 w-5 mr-2" />
                          <span>Stream:</span>
                        </div>
                        <span className="font-medium">{teacher.stream_display}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Award className="h-5 w-5 mr-2" />
                          <span>Experience:</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(teacher.years_of_teaching_experience || 0)}`}>
                          {teacher.years_of_teaching_experience || 0} years
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-5 w-5 mr-2" />
                          <span>Workload:</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkloadColor(teacher.workload_percentage || 0)}`}>
                          {teacher.workload_percentage || 0}%
                        </span>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Subjects</p>
                            <p className="font-medium">{teacher.subjects?.length || 0} subjects</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Classes</p>
                            <p className="font-medium">{teacher.assigned_classes?.length || 0} classes</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex space-x-3">
                      <Button
                        onClick={() => window.location.href = `/staff/teachers/${teacher.id}`}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        View Profile
                      </Button>
                      <Button
                        onClick={() => window.location.href = `/staff/teachers/${teacher.id}/edit`}
                        variant="primary"
                        className="flex-1"
                        size="sm"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredTeachers.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Showing {filteredTeachers.length} of {teachers.length} teacher profiles
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherProfiles;