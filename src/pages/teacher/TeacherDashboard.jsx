import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import useAuth from '../../hooks/useAuth';
import { getStaffAssignments } from '../../services/staffService';
import { getStudents } from '../../services/studentService';
import { 
  Users, BookOpen, GraduationCap, Calendar, 
  CheckCircle, Clock, Eye, ChevronRight, RefreshCw,
  UserCheck, FileText, Award, Target, TrendingUp,
  AlertCircle, X, Search, Plus, Edit2, Trash2
} from 'lucide-react';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

    // Check if user is a teacher OR admin (can view teacher dashboard)
    const isTeacher = ['teacher', 'form_teacher', 'subject_teacher', 'head', 'hm', 'principal', 'vice_principal'].includes(user?.role);

  useEffect(() => {
    if (isTeacher) {
      loadTeacherData();
    }
  }, [user]);

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // First get the staff profile ID from user
      // The user object should have staff_profile relation
      let staffId = null;
      
      // Try to get staff ID from user object
      if (user?.staff_profile?.id) {
        staffId = user.staff_profile.id;
      } else {
        // Fallback: fetch staff by user ID
        try {
          const { getAllStaff } = await import('../../services/staffService');
          const staffResponse = await getAllStaff({ user_id: user?.id, limit: 1 });
          const staffList = staffResponse?.results || staffResponse || [];
          if (staffList.length > 0) {
            staffId = staffList[0].id;
          }
        } catch (e) {
          console.warn('Could not fetch staff profile:', e);
        }
      }
      
      if (staffId) {
        const data = await getStaffAssignments(staffId);
        setAssignments(data);
      } else {
        setError('Staff profile not found. Please contact administrator.');
      }
    } catch (err) {
      console.error('Error loading teacher data:', err);
      setError(err.message || 'Failed to load your assignments');
    } finally {
      setLoading(false);
    }
  };

  const loadClassStudents = async (classLevelId, className, classId) => {
    try {
      setSelectedClass({ id: classId, levelId: classLevelId, name: className });
      const data = await getStudents({ 
        class_level: classLevelId, 
        limit: 100,
        is_active: true 
      });
      setClassStudents(data.results || data || []);
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Failed to load students for this class');
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const filteredStudents = classStudents.filter(student => {
    const search = searchTerm.toLowerCase();
    const name = `${student.user?.first_name || ''} ${student.user?.last_name || ''}`.toLowerCase();
    const admission = (student.admission_number || '').toLowerCase();
    return name.includes(search) || admission.includes(search);
  });

  const formatCurrency = (amount) => {
    if (!amount) return '₦0';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

    if (!isTeacher) {
    return (
        <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the Teacher Dashboard.</p>
            <p className="text-sm text-gray-500 mt-1">Required roles: Teacher, Form Teacher, Subject Teacher, or Administrator</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Go to Dashboard</button>
            </div>
        </div>
        </DashboardLayout>
    );
    }

  if (loading) {
    return (
      <DashboardLayout title="Teacher Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const assignedClasses = assignments?.assigned_classes || [];
  const assistantClasses = assignments?.assistant_classes || [];
  const subjectsTaught = assignments?.subjects_taught || [];

  return (
    <DashboardLayout title="Teacher Dashboard">
      <div className="py-6 px-4 sm:px-0">
        
        {/* Error/Success Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}

        {/* Welcome Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-gray-500 text-sm mt-1">Manage your classes, students, and academic records</p>
            </div>
            <button 
              onClick={loadTeacherData}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">{assignedClasses.length + assistantClasses.length}</p>
                <p className="text-xs text-gray-500">Total Classes</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap size={16} className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">{subjectsTaught.length}</p>
                <p className="text-xs text-gray-500">Subjects</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen size={16} className="text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">{classStudents.length}</p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users size={16} className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">—</p>
                <p className="text-xs text-gray-500">Results</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award size={16} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* If a class is selected, show students list */}
        {selectedClass ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <button 
                  onClick={() => setSelectedClass(null)}
                  className="text-gray-500 hover:text-gray-700 mr-3"
                >
                  ← Back
                </button>
                <h2 className="text-lg font-semibold text-gray-900 inline">
                  {selectedClass.name} - Students
                </h2>
                <p className="text-xs text-gray-500 mt-1">{classStudents.length} students enrolled</p>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
            
            <div className="p-4">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-400">No students found in this class</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredStudents.map(student => {
                    const studentUser = student.user || {};
                    const fullName = `${studentUser.first_name || ''} ${studentUser.last_name || ''}`.trim() || 'Unknown Student';
                    const feeStatus = student.fee_status || 'not_paid';
                    const statusColors = {
                      paid_full: 'bg-green-100 text-green-700',
                      paid_partial: 'bg-yellow-100 text-yellow-700',
                      not_paid: 'bg-red-100 text-red-700',
                      scholarship: 'bg-blue-100 text-blue-700',
                      exempted: 'bg-gray-100 text-gray-700'
                    };
                    
                    return (
                      <div key={student.id} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-600 font-medium text-sm">
                              {fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 text-sm truncate">{fullName}</h3>
                              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${statusColors[feeStatus]}`}>
                                {feeStatus === 'paid_full' ? 'Paid' : 
                                 feeStatus === 'paid_partial' ? 'Partial' : 
                                 feeStatus === 'scholarship' ? 'Scholarship' : 'Due'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{student.admission_number || 'No ID'}</p>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleViewStudent(student)}
                                className="flex-1 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                              >
                                <Eye size={12} className="inline mr-1" /> View
                              </button>
                              <button
                                onClick={() => navigate(`/results/create?student_id=${student.id}`)}
                                className="flex-1 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                              >
                                <FileText size={12} className="inline mr-1" /> Results
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* My Classes Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Assigned Classes */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-semibold text-gray-900 flex items-center">
                    <CheckCircle size={16} className="text-green-600 mr-2" />
                    My Classes ({assignedClasses.length})
                  </h2>
                </div>
                <div className="p-4">
                  {assignedClasses.length === 0 ? (
                    <p className="text-gray-400 text-center py-6 text-sm">No classes assigned yet</p>
                  ) : (
                    <div className="space-y-2">
                      {assignedClasses.map(cls => (
                        <div 
                          key={cls.id} 
                          className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => loadClassStudents(cls.class_level_id, cls.name, cls.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-800">{cls.name}</h3>
                              <p className="text-xs text-gray-500">{cls.class_level} • {cls.student_count || 0} students</p>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Assistant Classes */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-semibold text-gray-900 flex items-center">
                    <Clock size={16} className="text-blue-600 mr-2" />
                    Assistant Classes ({assistantClasses.length})
                  </h2>
                </div>
                <div className="p-4">
                  {assistantClasses.length === 0 ? (
                    <p className="text-gray-400 text-center py-6 text-sm">No assistant classes</p>
                  ) : (
                    <div className="space-y-2">
                      {assistantClasses.map(cls => (
                        <div 
                          key={cls.id} 
                          className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => loadClassStudents(cls.class_level_id, cls.name, cls.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-800">{cls.name}</h3>
                              <p className="text-xs text-gray-500">{cls.class_level}</p>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subjects Taught */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-900 flex items-center">
                  <BookOpen size={16} className="text-purple-600 mr-2" />
                  Subjects I Teach ({subjectsTaught.length})
                </h2>
              </div>
              <div className="p-4">
                {subjectsTaught.length === 0 ? (
                  <p className="text-gray-400 text-center py-6 text-sm">No subjects assigned</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {subjectsTaught.map(subj => (
                      <span key={subj.id} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {subj.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => navigate('/attendance/take')}
                    className="p-2.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <UserCheck size={14} />
                    Attendance
                  </button>
                  <button
                    onClick={() => navigate('/results/create')}
                    className="p-2.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <FileText size={14} />
                    Add Results
                  </button>
                  <button
                    onClick={() => navigate('/reports/results')}
                    className="p-2.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye size={14} />
                    View Results
                  </button>
                  <button
                    onClick={() => navigate('/timetable')}
                    className="p-2.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Calendar size={14} />
                    Timetable
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Student Details</h3>
              <button onClick={() => setShowStudentModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-lg font-medium">
                    {`${selectedStudent.user?.first_name || ''} ${selectedStudent.user?.last_name || ''}`.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {selectedStudent.user?.first_name} {selectedStudent.user?.last_name}
                  </h4>
                  <p className="text-xs text-gray-500">{selectedStudent.admission_number}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Class:</span>
                  <span className="font-medium">{selectedStudent.class_level?.name || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-700">{selectedStudent.user?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phone:</span>
                  <span className="text-gray-700">{selectedStudent.user?.phone_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Fee Status:</span>
                  <span className={`font-medium ${
                    selectedStudent.fee_status === 'paid_full' ? 'text-green-600' :
                    selectedStudent.fee_status === 'paid_partial' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {selectedStudent.fee_status === 'paid_full' ? 'Fully Paid' :
                     selectedStudent.fee_status === 'paid_partial' ? 'Partial' :
                     selectedStudent.fee_status === 'scholarship' ? 'Scholarship' : 'Not Paid'}
                  </span>
                </div>
                {selectedStudent.total_fee_amount > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Total Fee:</span>
                      <span className="font-bold">{formatCurrency(selectedStudent.total_fee_amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Paid:</span>
                      <span className="font-bold text-green-600">{formatCurrency(selectedStudent.amount_paid)}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowStudentModal(false);
                    navigate(`/results/create?student_id=${selectedStudent.id}`);
                  }}
                  className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm"
                >
                  <FileText size={14} className="inline mr-1" /> Enter Results
                </button>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="flex-1 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherDashboard;