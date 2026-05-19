import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import useAuth from '../../hooks/useAuth';
import { getClassAttendance, bulkMarkAttendance } from '../../services/attendanceService';
import { getClasses } from '../../services/academicService';
import { getAcademicSessions, getAcademicTerms } from '../../services/academicService';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import { 
  Calendar, Clock, Users, CheckCircle, XCircle, 
  AlertCircle, RefreshCw, Save, Search, Filter,
  ChevronRight, ChevronLeft, UserCheck, UserX,
  Clock as ClockIcon, FileText, Download, Printer
} from 'lucide-react';

const TakeAttendance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const isTeacher = ['teacher', 'form_teacher', 'subject_teacher', 'head', 'hm', 'principal', 'vice_principal', 'secretary'].includes(user?.role);

  useEffect(() => {
    if (isTeacher) {
      loadInitialData();
    }
  }, [isTeacher]);

  useEffect(() => {
    if (selectedClass && selectedSession && selectedTerm) {
      loadAttendanceData();
    }
  }, [selectedClass, selectedSession, selectedTerm, attendanceDate]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [classesRes, sessionsRes, termsRes] = await Promise.all([
        getClasses({ is_active: true }),
        getAcademicSessions(),
        getAcademicTerms()
      ]);
      
      setClasses(classesRes.results || classesRes || []);
      setSessions(sessionsRes.results || sessionsRes || []);
      setTerms(termsRes.results || termsRes || []);
      
      // Set default selections
      const currentSession = (sessionsRes.results || sessionsRes || []).find(s => s.is_current);
      if (currentSession) setSelectedSession(currentSession.id);
      
      const currentTerm = (termsRes.results || termsRes || []).find(t => t.is_current);
      if (currentTerm) setSelectedTerm(currentTerm.id);
      
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load classes and sessions');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceData = async () => {
    if (!selectedClass) return;
    
    try {
      setLoading(true);
      const data = await getClassAttendance(selectedClass, attendanceDate, selectedSession, selectedTerm);
      
      if (data.success) {
        setAttendanceData(data.attendance_data || []);
        setAttendanceSummary(data.attendance_summary);
      } else {
        setError(data.error || 'Failed to load attendance data');
      }
    } catch (err) {
      console.error('Error loading attendance:', err);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => prev.map(student => 
      student.student_id === studentId 
        ? { ...student, status, reason: status === 'absent' ? student.reason || 'other' : '' }
        : student
    ));
  };

  const handleReasonChange = (studentId, reason) => {
    setAttendanceData(prev => prev.map(student => 
      student.student_id === studentId 
        ? { ...student, reason }
        : student
    ));
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      setError('');
      
      const attendances = attendanceData.map(s => ({
        student_id: s.student_id,
        status: s.status,
        reason: s.reason || '',
        reason_notes: s.reason_notes || ''
      }));
      
      const data = await bulkMarkAttendance({
        class_obj_id: parseInt(selectedClass),
        session_id: parseInt(selectedSession),
        term_id: parseInt(selectedTerm),
        date: attendanceDate,
        attendances
      });
      
      if (data.success) {
        setSuccess(`Attendance saved: ${data.created} created, ${data.updated} updated`);
        setTimeout(() => setSuccess(''), 3000);
        loadAttendanceData(); // Refresh data
      } else {
        setError(data.error || 'Failed to save attendance');
      }
    } catch (err) {
      console.error('Error saving attendance:', err);
      setError(err.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-700 border-green-300';
      case 'absent': return 'bg-red-100 text-red-700 border-red-300';
      case 'late': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'excused': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-500 border-gray-300';
    }
  };

  const filteredStudents = attendanceData.filter(student =>
    student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedClassObj = classes.find(c => c.id === parseInt(selectedClass));

  if (!isTeacher) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
            <p className="text-gray-600 mt-2">Only teachers can take attendance.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Take Attendance">
      <div className="py-6 px-4 sm:px-0">
        
        {/* Error/Success Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Take Attendance</h1>
          <p className="text-gray-500 text-sm mt-1">Mark student attendance for your classes</p>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Class *</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select Session</option>
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select Term</option>
                {terms.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        {selectedClass && selectedSession && selectedTerm ? (
          <>
            {/* Class Info & Summary */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 mb-6 text-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{selectedClassObj?.name || 'Class'}</h2>
                  <p className="text-gray-300 text-sm mt-1">
                    {attendanceDate} • Total Students: {attendanceData.length}
                  </p>
                </div>
                {attendanceSummary && (
                  <div className="flex gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-400">{attendanceSummary.present}</p>
                      <p className="text-xs text-gray-300">Present</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-400">{attendanceSummary.absent}</p>
                      <p className="text-xs text-gray-300">Absent</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">{attendanceSummary.late}</p>
                      <p className="text-xs text-gray-300">Late</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-400">{attendanceSummary.attendance_rate}%</p>
                      <p className="text-xs text-gray-300">Rate</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students by name or admission number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            {/* Attendance Table */}
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw size={32} className="animate-spin mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">Loading students...</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Student Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Admission No</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Reason (if absent)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredStudents.map((student, idx) => (
                        <tr key={student.student_id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {student.student_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-sm">{student.student_name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-mono">{student.admission_number}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleStatusChange(student.student_id, 'present')}
                                className={`p-1.5 rounded-lg transition-all ${
                                  student.status === 'present' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-green-100'
                                }`}
                                title="Present"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.student_id, 'absent')}
                                className={`p-1.5 rounded-lg transition-all ${
                                  student.status === 'absent' 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-red-100'
                                }`}
                                title="Absent"
                              >
                                <XCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.student_id, 'late')}
                                className={`p-1.5 rounded-lg transition-all ${
                                  student.status === 'late' 
                                    ? 'bg-yellow-500 text-white' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-yellow-100'
                                }`}
                                title="Late"
                              >
                                <ClockIcon size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {student.status === 'absent' && (
                              <select
                                value={student.reason || ''}
                                onChange={(e) => handleReasonChange(student.student_id, e.target.value)}
                                className="px-2 py-1 border border-gray-200 rounded text-sm"
                              >
                                <option value="">Select reason</option>
                                <option value="sick">Sick</option>
                                <option value="family">Family Emergency</option>
                                <option value="travel">Travel</option>
                                <option value="other">Other</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-8 text-gray-400">
                            No students found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSaveAttendance}
                loading={saving}
                disabled={loading || !selectedClass}
                className="bg-gray-900 hover:bg-gray-700 px-6 py-2.5"
              >
                <Save size={16} className="mr-2" />
                Save Attendance
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Select a class, session, and term to take attendance</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TakeAttendance;