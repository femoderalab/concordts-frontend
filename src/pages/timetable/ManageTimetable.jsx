import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import useAuth from '../../hooks/useAuth';
import { 
  getClasses, getSubjects, getAcademicSessions, getAcademicTerms 
} from '../../services/academicService';
import { getAllStaff } from '../../services/staffService';
import { 
  getDays, getPeriods, getTimetableEntries, 
  createTimetableEntry, updateTimetableEntry, deleteTimetableEntry,
  bulkCreateTimetableEntries
} from '../../services/timetableService';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/modal';
import {
  Calendar, Clock, BookOpen, UserCheck, Plus, Edit2, Trash2,
  Save, X, RefreshCw, AlertCircle, ChevronRight, ChevronLeft,
  Copy, School, Users, Filter, Eye, Loader2
} from 'lucide-react';

const ManageTimetable = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [days, setDays] = useState([]);
  const [periods, setPeriods] = useState([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  
  const [entries, setEntries] = useState([]);
  const [timetableMatrix, setTimetableMatrix] = useState([]);
  
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [entryForm, setEntryForm] = useState({
    day_id: '',
    period_id: '',
    subject_id: '',
    teacher_id: '',
    room_number: '',
    notes: ''
  });
  
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  
  const canManage = ['head', 'hm', 'principal', 'vice_principal', 'secretary'].includes(user?.role);

  useEffect(() => {
    if (canManage) {
      loadInitialData();
    }
  }, [canManage]);

  useEffect(() => {
    if (selectedClass && selectedSession && selectedTerm && days.length > 0 && periods.length > 0) {
      loadTimetableEntries();
    }
  }, [selectedClass, selectedSession, selectedTerm, days, periods]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [
        classesRes, subjectsRes, staffRes,
        sessionsRes, termsRes, daysRes, periodsRes
      ] = await Promise.all([
        getClasses({ is_active: true, limit: 100 }),
        getSubjects({ is_active: true, limit: 100 }),
        getAllStaff({ is_active: true, limit: 100 }),
        getAcademicSessions(),
        getAcademicTerms(),
        getDays(),
        getPeriods()
      ]);
      
      setClasses(classesRes.results || classesRes || []);
      setSubjects(subjectsRes.results || subjectsRes || []);
      setStaff(staffRes.results || staffRes || []);
      setSessions(sessionsRes.results || sessionsRes || []);
      setTerms(termsRes.results || termsRes || []);
      setDays(daysRes.results || daysRes || []);
      setPeriods(periodsRes.results || periodsRes || []);
      
      // Set default selections
      const currentSession = (sessionsRes.results || sessionsRes || []).find(s => s.is_current);
      if (currentSession) setSelectedSession(String(currentSession.id));
      else if ((sessionsRes.results || sessionsRes || []).length > 0) {
        setSelectedSession(String((sessionsRes.results || sessionsRes || [])[0].id));
      }
      
      const currentTerm = (termsRes.results || termsRes || []).find(t => t.is_current);
      if (currentTerm) setSelectedTerm(String(currentTerm.id));
      else if ((termsRes.results || termsRes || []).length > 0) {
        setSelectedTerm(String((termsRes.results || termsRes || [])[0].id));
      }
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadTimetableEntries = async () => {
    if (!selectedClass || !selectedSession || !selectedTerm) return;
    
    try {
      const data = await getTimetableEntries({
        class_obj: selectedClass,
        session: selectedSession,
        term: selectedTerm,
        is_active: true
      });
      
      const entriesList = data.results || data || [];
      setEntries(entriesList);
      
      // Build matrix for display
      const matrix = [];
      for (const day of days) {
        const dayEntries = [];
        for (const period of periods) {
          const entry = entriesList.find(e => 
            e.day === day.id && e.period === period.id
          );
          dayEntries.push({
            period: period,
            entry: entry || null
          });
        }
        matrix.push({
          day: day,
          entries: dayEntries
        });
      }
      setTimetableMatrix(matrix);
      
    } catch (err) {
      console.error('Error loading timetable entries:', err);
      setError('Failed to load timetable entries');
    }
  };

  const handleOpenEntryModal = (dayId, periodId, existingEntry = null) => {
    if (existingEntry) {
      setEditingEntry(existingEntry);
      setEntryForm({
        day_id: existingEntry.day,
        period_id: existingEntry.period,
        subject_id: existingEntry.subject,
        teacher_id: existingEntry.teacher,
        room_number: existingEntry.room_number || '',
        notes: existingEntry.notes || ''
      });
    } else {
      setEditingEntry(null);
      setEntryForm({
        day_id: dayId,
        period_id: periodId,
        subject_id: '',
        teacher_id: '',
        room_number: '',
        notes: ''
      });
    }
    setShowEntryModal(true);
  };

  const handleSaveEntry = async () => {
    try {
      setSaving(true);
      setError('');
      
      if (!selectedClass || !selectedSession || !selectedTerm) {
        setError('Please select class, session, and term');
        return;
      }
      if (!entryForm.subject_id) {
        setError('Please select a subject');
        return;
      }
      if (!entryForm.teacher_id) {
        setError('Please select a teacher');
        return;
      }
      
      const data = {
        class_obj: parseInt(selectedClass),
        session: parseInt(selectedSession),
        term: parseInt(selectedTerm),
        day: parseInt(entryForm.day_id),
        period: parseInt(entryForm.period_id),
        subject: parseInt(entryForm.subject_id),
        teacher: parseInt(entryForm.teacher_id),
        room_number: entryForm.room_number || '',
        notes: entryForm.notes || '',
        is_active: true,
        is_cancelled: false,        // ADD THIS
        cancellation_reason: ''     // ADD THIS
      };
      
      if (editingEntry) {
        await updateTimetableEntry(editingEntry.id, data);
        setSuccess('Timetable entry updated successfully');
      } else {
        await createTimetableEntry(data);
        setSuccess('Timetable entry added successfully');
      }
      
      setShowEntryModal(false);
      loadTimetableEntries();
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error saving entry:', err);
      setError(err.message || 'Failed to save timetable entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (entry) => {
    if (!window.confirm('Are you sure you want to delete this timetable entry?')) return;
    
    try {
      await deleteTimetableEntry(entry.id);
      setSuccess('Timetable entry deleted successfully');
      loadTimetableEntries();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete timetable entry');
    }
  };

  const handleBulkCreate = async () => {
    try {
      if (!selectedClass || !selectedSession || !selectedTerm) {
        setError('Please select class, session, and term');
        return;
      }
      if (days.length === 0 || periods.length === 0) {
        setError('No days or periods configured. Please contact administrator.');
        return;
      }
      
      setBulkLoading(true);
      setError('');
      
      const entriesToCreate = [];
      for (const day of days) {
        for (const period of periods) {
          entriesToCreate.push({
            class_id: parseInt(selectedClass),
            day_id: day.id,
            period_id: period.id,
            subject_id: null,
            teacher_id: null,
            room_number: '',
            notes: '',
            is_active: true,
            is_cancelled: false,
            cancellation_reason: ''
          });
        }
      }
      
      const result = await bulkCreateTimetableEntries({
        class_id: parseInt(selectedClass),
        session_id: parseInt(selectedSession),
        term_id: parseInt(selectedTerm),
        entries: entriesToCreate
      });
      
      if (result.success) {
        setSuccess(`Created ${result.created_count} and updated ${result.updated_count} timetable entries`);
        setShowBulkModal(false);
        await loadTimetableEntries();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to create timetable');
      }
      
    } catch (err) {
      console.error('Error bulk creating:', err);
      setError(err.message || 'Failed to create timetable');
    } finally {
      setBulkLoading(false);
    }
  };

  const selectedClassObj = classes.find(c => c.id === parseInt(selectedClass));
  const selectedSessionObj = sessions.find(s => s.id === parseInt(selectedSession));
  const selectedTermObj = terms.find(t => t.id === parseInt(selectedTerm));

  if (!canManage) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
            <p className="text-gray-600 mt-2">Only administrators can manage timetables.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Manage Timetable">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manage Timetable">
      <div className="py-6 px-4 sm:px-0">
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Timetable</h1>
            <p className="text-gray-500 text-sm mt-1">Create and edit class schedules</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                if (!selectedClass || !selectedSession || !selectedTerm) {
                  setError('Please select class, session, and term first');
                  return;
                }
                setShowBulkModal(true);
              }} 
              variant="outline" 
              className="border-gray-300"
              disabled={!selectedClass || !selectedSession || !selectedTerm}
            >
              <Copy size={16} className="mr-2" /> Bulk Create
            </Button>
            <Button onClick={() => navigate('/timetable')} className="bg-gray-900 hover:bg-gray-700">
              <Eye size={16} className="mr-2" /> View Timetable
            </Button>
          </div>
        </div>

        {/* Selection Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Session *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Term *</label>
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
          </div>
        </div>

        {/* Configuration Check */}
        {(days.length === 0 || periods.length === 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800">Configuration Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {days.length === 0 && 'No school days configured. '}
                  {periods.length === 0 && 'No time periods configured. '}
                  Please contact the system administrator to set up days and periods.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timetable Editor */}
        {selectedClass && selectedSession && selectedTerm && days.length > 0 && periods.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-36">Time / Day</th>
                    {days.map((day) => (
                      <th key={day.id} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        {day.name}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-16">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {periods.map((period) => (
                    <tr key={period.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                        <div>{period.name}</div>
                        <div className="text-xs text-gray-400">{period.start_time_display} - {period.end_time_display}</div>
                      </td>
                      {days.map((day) => {
                        const dayData = timetableMatrix.find(m => m.day.id === day.id);
                        const entry = dayData?.entries.find(e => e.period.id === period.id)?.entry;
                        return (
                          <td key={day.id} className="px-4 py-3 border-l border-gray-100">
                            {entry ? (
                              <div className="group relative">
                                <div className="mb-1">
                                  <span className="font-medium text-gray-800">{entry.subject_name}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {entry.teacher_name}
                                </div>
                                {entry.room_number && (
                                  <div className="text-xs text-gray-400">Rm: {entry.room_number}</div>
                                )}
                                <div className="absolute top-0 right-0 hidden group-hover:flex gap-1">
                                  <button
                                    onClick={() => handleOpenEntryModal(day.id, period.id, entry)}
                                    className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                    title="Edit"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEntry(entry)}
                                    className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                    title="Delete"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleOpenEntryModal(day.id, period.id)}
                                className="w-full py-2 text-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg border border-dashed border-gray-200 transition-colors"
                              >
                                <Plus size={16} className="mx-auto" />
                                <span className="text-xs">Add</span>
                              </button>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center bg-gray-50">
                        <button
                          onClick={() => {
                            days.forEach(day => {
                              const dayData = timetableMatrix.find(m => m.day.id === day.id);
                              const exists = dayData?.entries.find(e => e.period.id === period.id)?.entry;
                              if (!exists) {
                                handleOpenEntryModal(day.id, period.id);
                              }
                            });
                          }}
                          className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                          title="Add to all days"
                        >
                          <Copy size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : selectedClass ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Please select session and term to manage timetable</p>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <School size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Select a class to manage its timetable</p>
          </div>
        )}

        {/* Entry Modal */}
        <Modal isOpen={showEntryModal} onClose={() => setShowEntryModal(false)} title={editingEntry ? 'Edit Timetable Entry' : 'Add Timetable Entry'} size="md">
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <select
                value={entryForm.subject_id}
                onChange={(e) => setEntryForm({...entryForm, subject_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select Subject</option>
                {subjects.map(subj => (
                  <option key={subj.id} value={subj.id}>{subj.name} ({subj.code})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher *</label>
              <select
                value={entryForm.teacher_id}
                onChange={(e) => setEntryForm({...entryForm, teacher_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select Teacher</option>
                {staff.map(staffMember => (
                  <option key={staffMember.id} value={staffMember.id}>
                    {staffMember.user?.first_name} {staffMember.user?.last_name} ({staffMember.staff_id})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <input
                type="text"
                value={entryForm.room_number}
                onChange={(e) => setEntryForm({...entryForm, room_number: e.target.value})}
                placeholder="e.g., Room 201, Lab A"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={entryForm.notes}
                onChange={(e) => setEntryForm({...entryForm, notes: e.target.value})}
                rows={2}
                placeholder="Additional notes..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={() => setShowEntryModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveEntry} loading={saving} className="flex-1 bg-gray-900 hover:bg-gray-700">
                Save Entry
              </Button>
            </div>
          </div>
        </Modal>

        {/* Bulk Create Modal */}
        <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Bulk Create Timetable" size="lg">
          <div className="py-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">What will happen?</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    This will create empty timetable entries for all days and time periods.
                    You can then edit each slot individually to add subjects and teachers.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-medium">{selectedClassObj?.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Session:</span>
                  <span className="font-medium">{selectedSessionObj?.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Term:</span>
                  <span className="font-medium">{selectedTermObj?.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Days:</span>
                  <span className="font-medium">{days.length} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Periods:</span>
                  <span className="font-medium">{periods.length} periods</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-700">Total Entries to Create:</span>
                    <span className="text-blue-600">{days.length * periods.length} entries</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> This will not delete existing entries. It will only create missing ones.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => setShowBulkModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleBulkCreate} loading={bulkLoading} className="flex-1 bg-gray-900 hover:bg-gray-700">
                {bulkLoading ? 'Creating...' : 'Create Timetable'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ManageTimetable;