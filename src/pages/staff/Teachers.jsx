import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import staffService from '../../services/staffService';
import { 
  BookOpen, 
  Users, 
  Clock, 
  FileText,
  Calendar,
  Award,
  RefreshCw,
  UserCheck
} from 'lucide-react';

const Teachers = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [stats, setStats] = useState({
    students_count: 0,
    classes_count: 0,
    subjects_count: 0,
    workload_percentage: 0,
    upcoming_classes: 0
  });

  useEffect(() => {
    if (!['teacher', 'form_teacher', 'subject_teacher', 'head', 'principal', 'vice_principal'].includes(user?.role)) {
      return;
    }
    fetchTeacherData();
  }, [user]);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try to get teacher profile
      try {
        // First try to get current teacher's profile directly
        const teachersResponse = await staffService.getAllTeachers();
        
        let teachersList = [];
        if (Array.isArray(teachersResponse)) {
          teachersList = teachersResponse;
        } else if (teachersResponse?.results) {
          teachersList = teachersResponse.results;
        } else if (teachersResponse?.data) {
          teachersList = teachersResponse.data;
        }
        
        // Find current teacher's profile
        const currentTeacher = teachersList.find(t => 
          t.staff?.user?.id === user?.id || 
          t.staff?.user?.registration_number === user?.registration_number ||
          t.staff?.user?.email === user?.email
        );
        
        if (currentTeacher) {
          setTeacherProfile(currentTeacher);
          
          // Calculate real stats from teacher data
          const subjectsCount = currentTeacher.subjects?.length || 
                               currentTeacher.subjects_count || 
                               (Array.isArray(currentTeacher.subjects) ? currentTeacher.subjects.length : 0);
          
          const classesCount = currentTeacher.assigned_classes?.length || 
                              currentTeacher.classes_count || 
                              (Array.isArray(currentTeacher.assigned_classes) ? currentTeacher.assigned_classes.length : 0);
          
          const workloadPercentage = currentTeacher.workload_percentage || 
                                    currentTeacher.workload || 
                                    (currentTeacher.current_periods_per_week && currentTeacher.max_periods_per_week 
                                      ? Math.round((currentTeacher.current_periods_per_week / currentTeacher.max_periods_per_week) * 100)
                                      : 0);
          
          // Estimate students count based on classes
          const estimatedStudents = classesCount * 30; // Assuming 30 students per class
          
          setStats({
            students_count: currentTeacher.students_count || estimatedStudents || 0,
            classes_count: classesCount,
            subjects_count: subjectsCount,
            workload_percentage: workloadPercentage,
            upcoming_classes: 4 // Mock upcoming classes
          });
        } else {
          // If no profile found, create a basic one from user data
          setTeacherProfile({
            teacher_type: user?.role === 'form_teacher' ? 'class_teacher' : 'subject_teacher',
            teacher_type_display: user?.role === 'form_teacher' ? 'Class Teacher' : 'Subject Teacher',
            years_of_teaching_experience: 0,
            max_periods_per_week: 40
          });
          
          setStats({
            students_count: 0,
            classes_count: 0,
            subjects_count: 0,
            workload_percentage: 0,
            upcoming_classes: 0
          });
        }
      } catch (profileError) {
        console.warn('Teacher profile error:', profileError);
        setTeacherProfile(null);
      }

    } catch (err) {
      console.error('Error fetching teacher data:', err);
      setError('Unable to load teacher dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toLocaleString();
  };

  if (!['teacher', 'form_teacher', 'subject_teacher', 'head', 'principal', 'vice_principal'].includes(user?.role)) {
    return (
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized Access</h2>
              <p className="text-gray-600">You do not have permission to access the teacher dashboard.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Mock schedule data (in real app, this would come from API)
  const schedule = [
    { time: '8:00 AM', subject: 'Mathematics', class: 'SS1A', type: 'Regular' },
    { time: '10:00 AM', subject: 'Physics', class: 'SS2B', type: 'Practical' },
    { time: '1:00 PM', subject: 'Mathematics', class: 'SS3A', type: 'Revision' },
    { time: '3:00 PM', subject: 'General Studies', class: 'JSS3', type: 'Club' }
  ];

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Welcome, <span className="font-semibold text-blue-600">{user?.first_name} {user?.last_name}</span>
                </p>
                {teacherProfile && (
                  <p className="text-sm text-gray-500 mt-1">
                    {teacherProfile.teacher_type_display || 'Teacher'} • 
                    {teacherProfile.stream_display ? ` ${teacherProfile.stream_display}` : ' All Streams'}
                  </p>
                )}
              </div>
              <div className="mt-4 md:mt-0">
                <Button
                  onClick={fetchTeacherData}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
          )}

          {loading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-32 rounded-lg animate-pulse"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-200 h-96 rounded-lg animate-pulse"></div>
                <div className="bg-gray-200 h-96 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Students"
                  value={formatNumber(stats.students_count)}
                  icon={<Users className="h-8 w-8 text-blue-600" />}
                  description="Under your guidance"
                  trend={stats.students_count > 0 ? "up" : "neutral"}
                />
                <StatCard
                  title="Classes"
                  value={formatNumber(stats.classes_count)}
                  icon={<BookOpen className="h-8 w-8 text-green-600" />}
                  description="Classes assigned"
                  trend={stats.classes_count > 0 ? "up" : "neutral"}
                />
                <StatCard
                  title="Subjects"
                  value={formatNumber(stats.subjects_count)}
                  icon={<FileText className="h-8 w-8 text-purple-600" />}
                  description="Teaching subjects"
                  trend={stats.subjects_count > 0 ? "up" : "neutral"}
                />
                <StatCard
                  title="Workload"
                  value={`${stats.workload_percentage}%`}
                  icon={<Clock className="h-8 w-8 text-orange-600" />}
                  description="Teaching load"
                  trend={stats.workload_percentage > 80 ? "warning" : "up"}
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Teaching Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    onClick={() => window.location.href = '/attendance/take'}
                    variant="primary"
                    className="w-full h-12 justify-center"
                    icon={<UserCheck className="h-5 w-5 mr-2" />}
                  >
                    Take Attendance
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/assessments/create'}
                    variant="secondary"
                    className="w-full h-12 justify-center"
                    icon={<FileText className="h-5 w-5 mr-2" />}
                  >
                    Create Assessment
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/students'}
                    variant="secondary"
                    className="w-full h-12 justify-center"
                    icon={<Users className="h-5 w-5 mr-2" />}
                  >
                    View Students
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/timetable'}
                    variant="outline"
                    className="w-full h-12 justify-center"
                    icon={<Calendar className="h-5 w-5 mr-2" />}
                  >
                    View Timetable
                  </Button>
                </div>
              </div>

              {/* Teacher Profile & Upcoming Schedule */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Teacher Profile */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Your Profile</h3>
                    {teacherProfile && (
                      <span className="text-sm text-gray-500">
                        {teacherProfile.teacher_type_display}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    {teacherProfile ? (
                      <div className="space-y-6">
                        {/* Profile Header */}
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-2xl font-bold">
                              {user?.first_name?.charAt(0)?.toUpperCase() || 'T'}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {user?.first_name} {user?.last_name}
                            </h4>
                            <p className="text-gray-600">{user?.email}</p>
                            <p className="text-sm text-gray-500">
                              {user?.phone_number || 'Phone: Not set'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Profile Details */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                          <div>
                            <p className="text-sm text-gray-500">Teacher Type</p>
                            <p className="font-medium text-gray-900">
                              {teacherProfile.teacher_type_display || 'Teacher'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Stream</p>
                            <p className="font-medium text-gray-900">
                              {teacherProfile.stream_display || 'All Streams'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Experience</p>
                            <p className="font-medium text-gray-900">
                              {teacherProfile.years_of_teaching_experience || 0} years
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Max Periods</p>
                            <p className="font-medium text-gray-900">
                              {teacherProfile.max_periods_per_week || 40}/week
                            </p>
                          </div>
                        </div>
                        
                        {/* Subjects and Classes */}
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <p className="text-sm text-gray-500">Subjects</p>
                              <p className="font-medium">{stats.subjects_count} subjects</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Classes</p>
                              <p className="font-medium">{stats.classes_count} classes</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No teacher profile found</p>
                        <p className="text-sm text-gray-400 mb-4">
                          Complete your teacher profile to access all features
                        </p>
                        <Button
                          onClick={() => window.location.href = '/staff/teachers/create'}
                          variant="outline"
                        >
                          Create Teacher Profile
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upcoming Schedule */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                    <span className="text-sm text-gray-500">
                      {schedule.length} classes
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {schedule.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.time}</p>
                              <p className="text-sm text-gray-500">{item.subject}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{item.class}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              item.type === 'Practical' 
                                ? 'bg-green-100 text-green-800'
                                : item.type === 'Revision'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Button
                        onClick={() => window.location.href = '/timetable'}
                        variant="outline"
                        className="w-full justify-center"
                      >
                        View Weekly Timetable
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Teachers;