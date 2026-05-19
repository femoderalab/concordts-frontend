// // import React, { useState, useEffect, useCallback } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import DashboardLayout from '../../components/dashboard/DashboardLayout';
// // import useAuth from '../../hooks/useAuth';
// // import { getClassTimetable, getTimetableEntries, deleteTimetableEntry } from '../../services/timetableService';
// // import { getClasses } from '../../services/academicService';
// // import { getAcademicSessions, getAcademicTerms } from '../../services/academicService';
// // import { getAllStaff } from '../../services/staffService';
// // import Alert from '../../components/common/Alert';
// // import Button from '../../components/common/Button';
// // import Modal from '../../components/common/modal';
// // import {
// //   Calendar, Clock, Users, BookOpen, UserCheck,
// //   AlertCircle, RefreshCw, Plus, Edit2, Trash2,
// //   ChevronRight, ChevronLeft, Printer, Download,
// //   X, Save, Eye, School  // <-- Add Eye here if missing
// // } from 'lucide-react';

// // const ClassTimetable = () => {
// //   const navigate = useNavigate();
// //   const { user } = useAuth();
  
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState('');
  
// //   const [classes, setClasses] = useState([]);
// //   const [selectedClass, setSelectedClass] = useState('');
// //   const [sessions, setSessions] = useState([]);
// //   const [terms, setTerms] = useState([]);
// //   const [selectedSession, setSelectedSession] = useState('');
// //   const [selectedTerm, setSelectedTerm] = useState('');
  
// //   const [timetable, setTimetable] = useState(null);
// //   const [timeSlots, setTimeSlots] = useState([]);
  
// //   const [showEntryModal, setShowEntryModal] = useState(false);
// //   const [editingEntry, setEditingEntry] = useState(null);
// //   const [entryForm, setEntryForm] = useState({
// //     day_id: '',
// //     time_slot_id: '',
// //     subject_id: '',
// //     teacher_id: '',
// //     room_number: ''
// //   });
  
// //   const canManage = ['head', 'hm', 'principal', 'vice_principal', 'secretary'].includes(user?.role);

// //   useEffect(() => {
// //     loadInitialData();
// //   }, []);

// //   useEffect(() => {
// //     if (selectedClass && selectedSession && selectedTerm) {
// //       loadTimetable();
// //     }
// //   }, [selectedClass, selectedSession, selectedTerm]);

// //   const loadInitialData = async () => {
// //     try {
// //       setLoading(true);
// //       const [classesRes, sessionsRes, termsRes] = await Promise.all([
// //         getClasses({ is_active: true }),
// //         getAcademicSessions(),
// //         getAcademicTerms()
// //       ]);
      
// //       setClasses(classesRes.results || classesRes || []);
// //       setSessions(sessionsRes.results || sessionsRes || []);
// //       setTerms(termsRes.results || termsRes || []);
      
// //       const currentSession = (sessionsRes.results || sessionsRes || []).find(s => s.is_current);
// //       if (currentSession) setSelectedSession(currentSession.id);
      
// //       const currentTerm = (termsRes.results || termsRes || []).find(t => t.is_current);
// //       if (currentTerm) setSelectedTerm(currentTerm.id);
      
// //     } catch (err) {
// //       console.error('Error loading data:', err);
// //       setError('Failed to load data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadTimetable = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await getClassTimetable(selectedClass, selectedSession, selectedTerm);
// //       if (data.success) {
// //         setTimetable(data.timetable);
// //         setTimeSlots(data.time_slots || []);
// //       } else {
// //         setError(data.error || 'Failed to load timetable');
// //       }
// //     } catch (err) {
// //       console.error('Error loading timetable:', err);
// //       setError('Failed to load timetable');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handlePrint = () => {
// //     window.print();
// //   };

// //   const selectedClassObj = classes.find(c => c.id === parseInt(selectedClass));

// //   if (loading && !timetable) {
// //     return (
// //       <DashboardLayout title="Class Timetable">
// //         <div className="flex justify-center items-center h-64">
// //           <RefreshCw size={32} className="animate-spin text-gray-400" />
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   return (
// //     <DashboardLayout title="Class Timetable">
// //       <div className="py-6 px-4 sm:px-0">
        
// //         {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
// //         {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}

// //         {/* Header */}
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-900">Class Timetable</h1>
// //             <p className="text-gray-500 text-sm mt-1">View and manage class schedules</p>
// //           </div>
// //           {canManage && (
// //             <Button onClick={() => navigate('/timetable/manage')} className="bg-gray-900 hover:bg-gray-700">
// //               <Plus size={16} className="mr-2" /> Manage Timetable
// //             </Button>
// //           )}
// //         </div>

// //         {/* Filters */}
// //         <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
// //               <select
// //                 value={selectedClass}
// //                 onChange={(e) => setSelectedClass(e.target.value)}
// //                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
// //               >
// //                 <option value="">Select Class</option>
// //                 {classes.map(cls => (
// //                   <option key={cls.id} value={cls.id}>{cls.name}</option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
// //               <select
// //                 value={selectedSession}
// //                 onChange={(e) => setSelectedSession(e.target.value)}
// //                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
// //               >
// //                 <option value="">Select Session</option>
// //                 {sessions.map(s => (
// //                   <option key={s.id} value={s.id}>{s.name}</option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
// //               <select
// //                 value={selectedTerm}
// //                 onChange={(e) => setSelectedTerm(e.target.value)}
// //                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
// //               >
// //                 <option value="">Select Term</option>
// //                 {terms.map(t => (
// //                   <option key={t.id} value={t.id}>{t.name}</option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Timetable Display */}
// //         {selectedClass && selectedSession && selectedTerm && timetable ? (
// //           <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
// //             <div className="overflow-x-auto">
// //               <table className="w-full min-w-[800px]">
// //                 <thead>
// //                   <tr className="bg-gray-50">
// //                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">Time / Day</th>
// //                     {timetable.map((day, idx) => (
// //                       <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
// //                         {day.day.name}
// //                       </th>
// //                     ))}
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-gray-100">
// //                   {timeSlots.map((slot, slotIdx) => (
// //                     <tr key={slotIdx} className="hover:bg-gray-50">
// //                       <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
// //                         <div>{slot.name}</div>
// //                         <div className="text-xs text-gray-400">{slot.start_time} - {slot.end_time}</div>
// //                       </td>
// //                       {timetable.map((day, dayIdx) => {
// //                         const entry = day.entries[slotIdx];
// //                         return (
// //                           <td key={dayIdx} className="px-4 py-3 border-l border-gray-100">
// //                             {entry && entry.entry ? (
// //                               <div>
// //                                 <p className="font-medium text-gray-800">{entry.entry.subject}</p>
// //                                 <p className="text-xs text-gray-500">{entry.entry.teacher || 'Not Assigned'}</p>
// //                                 {entry.entry.room_number && (
// //                                   <p className="text-xs text-gray-400">Room: {entry.entry.room_number}</p>
// //                                 )}
// //                                 {entry.entry.is_cancelled && (
// //                                   <p className="text-xs text-red-500 mt-1">Cancelled</p>
// //                                 )}
// //                               </div>
// //                             ) : (
// //                               <span className="text-gray-300 text-sm">—</span>
// //                             )}
// //                           </td>
// //                         );
// //                       })}
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         ) : selectedClass && (
// //           <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
// //             <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
// //             <p className="text-gray-500">No timetable found for this class</p>
// //             {canManage && (
// //               <Button onClick={() => navigate('/timetable/manage')} className="mt-4">
// //                 Create Timetable
// //               </Button>
// //             )}
// //           </div>
// //         )}

// //         {/* Print Button */}
// //         {timetable && (
// //           <div className="mt-6 flex justify-end">
// //             <Button onClick={handlePrint} variant="outline" className="border-gray-300">
// //               <Printer size={16} className="mr-2" /> Print Timetable
// //             </Button>
// //           </div>
// //         )}
// //       </div>
// //     </DashboardLayout>
// //   );
// // };

// // export default ClassTimetable;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import useAuth from '../../hooks/useAuth';
// import { getClassTimetable } from '../../services/timetableService';
// import Alert from '../../components/common/Alert';
// import Button from '../../components/common/Button';
// import {
//   Calendar, Clock, BookOpen, ArrowLeft, Printer,
//   RefreshCw, AlertCircle, School, MapPin, Loader2
// } from 'lucide-react';

// const ClassTimetable = () => {
//   const { classId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useAuth();
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [timetableData, setTimetableData] = useState(null);
  
//   const queryParams = new URLSearchParams(location.search);
//   const sessionId = queryParams.get('session');
//   const termId = queryParams.get('term');

//   useEffect(() => {
//     if (classId) {
//       loadTimetable();
//     }
//   }, [classId, sessionId, termId]);

//   const loadTimetable = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const data = await getClassTimetable(classId, sessionId, termId);
      
//       if (data.success) {
//         setTimetableData(data);
//       } else {
//         setError(data.error || 'Failed to load timetable');
//       }
//     } catch (err) {
//       console.error('Error loading timetable:', err);
//       setError('Failed to load timetable');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   if (loading) {
//     return (
//       <DashboardLayout title="Class Timetable">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-center">
//             <Loader2 size={40} className="animate-spin mx-auto text-gray-400 mb-3" />
//             <p className="text-gray-500">Loading timetable...</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout title="Class Timetable">
//         <div className="py-6 px-4 sm:px-0">
//           <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
//           <Button onClick={() => navigate('/timetable')} variant="outline">
//             <ArrowLeft size={16} className="mr-2" /> Back to Timetables
//           </Button>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (!timetableData || !timetableData.success) {
//     return (
//       <DashboardLayout title="Class Timetable">
//         <div className="py-6 px-4 sm:px-0">
//           <Alert type="error" message="Timetable data not found" className="mb-4" />
//           <Button onClick={() => navigate('/timetable')} variant="outline">
//             <ArrowLeft size={16} className="mr-2" /> Back to Timetables
//           </Button>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   const classInfo = timetableData.class || {};
//   const days = timetableData.days || [];
//   const periods = timetableData.periods || [];
//   const timetable = timetableData.timetable || [];

//   return (
//     <DashboardLayout title={`Timetable - ${classInfo.name || 'Class'}`}>
//       <div className="py-6 px-4 sm:px-0">
        
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
//           <div>
//             <button
//               onClick={() => navigate('/timetable')}
//               className="text-gray-500 hover:text-gray-700 mb-2 flex items-center text-sm"
//             >
//               <ArrowLeft size={16} className="mr-1" /> Back to Timetables
//             </button>
//             <h1 className="text-2xl font-bold text-gray-900">{classInfo.name || 'Class'} Timetable</h1>
//             <p className="text-gray-500 text-sm mt-1">
//               {classInfo.class_level || ''} {classInfo.stream ? `• ${classInfo.stream}` : ''}
//             </p>
//             {timetableData.session && timetableData.term && (
//               <p className="text-xs text-gray-400 mt-1">
//                 {timetableData.session.name} - {timetableData.term.name}
//               </p>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <button onClick={handlePrint} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
//               <Printer size={16} /> Print
//             </button>
//             <button onClick={loadTimetable} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
//               <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
//             </button>
//           </div>
//         </div>

//         {/* Class Info Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//           <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
//             <div className="flex items-center gap-2">
//               <School size={16} className="text-gray-400" />
//               <span className="text-xs text-gray-500">Class</span>
//             </div>
//             <p className="text-sm font-semibold mt-1">{classInfo.name || 'N/A'}</p>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
//             <div className="flex items-center gap-2">
//               <BookOpen size={16} className="text-gray-400" />
//               <span className="text-xs text-gray-500">Level</span>
//             </div>
//             <p className="text-sm font-semibold mt-1">{classInfo.class_level || 'N/A'}</p>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
//             <div className="flex items-center gap-2">
//               <MapPin size={16} className="text-gray-400" />
//               <span className="text-xs text-gray-500">Room</span>
//             </div>
//             <p className="text-sm font-semibold mt-1">{classInfo.room_number || 'Not assigned'}</p>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
//             <div className="flex items-center gap-2">
//               <Calendar size={16} className="text-gray-400" />
//               <span className="text-xs text-gray-500">Code</span>
//             </div>
//             <p className="text-sm font-semibold mt-1">{classInfo.code || 'N/A'}</p>
//           </div>
//         </div>

//         {/* Timetable Table */}
//         {days.length > 0 && periods.length > 0 ? (
//           <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-36">Time / Day</th>
//                     {days.map((day) => (
//                       <th key={day.id} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                         {day.name}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {periods.map((period) => (
//                     <tr key={period.id} className="hover:bg-gray-50">
//                       <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
//                         <div>{period.name}</div>
//                         <div className="text-xs text-gray-400">{period.start_time_display} - {period.end_time_display}</div>
//                       </td>
//                       {days.map((day) => {
//                         const dayData = timetable.find(d => d.day_id === day.id);
//                         const entry = dayData?.entries?.find(e => e.period_id === period.id)?.entry;
//                         return (
//                           <td key={day.id} className="px-4 py-3 border-l border-gray-100">
//                             {entry ? (
//                               <div>
//                                 <div className="font-medium text-gray-800">{entry.subject_name || 'N/A'}</div>
//                                 <div className="text-xs text-gray-500 mt-1">
//                                   {entry.teacher_name || 'No teacher'}
//                                 </div>
//                                 {entry.room_number && (
//                                   <div className="text-xs text-gray-400 mt-0.5">
//                                     Room: {entry.room_number}
//                                   </div>
//                                 )}
//                               </div>
//                             ) : (
//                               <span className="text-gray-300 text-sm">—</span>
//                             )}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : days.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
//             <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
//             <p className="text-gray-500">No school days configured</p>
//             {['head', 'hm', 'principal', 'vice_principal', 'secretary'].includes(user?.role) && (
//               <Button onClick={() => navigate('/timetable/days')} className="mt-4">
//                 Configure School Days
//               </Button>
//             )}
//           </div>
//         ) : periods.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
//             <Clock size={48} className="mx-auto text-gray-300 mb-3" />
//             <p className="text-gray-500">No time periods configured</p>
//             {['head', 'hm', 'principal', 'vice_principal', 'secretary'].includes(user?.role) && (
//               <Button onClick={() => navigate('/timetable/periods')} className="mt-4">
//                 Configure Time Periods
//               </Button>
//             )}
//           </div>
//         ) : (
//           <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
//             <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
//             <p className="text-gray-500">No timetable entries found for this class</p>
//             {['head', 'hm', 'principal', 'vice_principal', 'secretary'].includes(user?.role) && (
//               <Button onClick={() => navigate('/timetable/manage')} className="mt-4">
//                 Create Timetable
//               </Button>
//             )}
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ClassTimetable;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { get } from '../../services/api';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import { ArrowLeft, Printer, RefreshCw, Loader2, Calendar, Clock, School } from 'lucide-react';

const ClassTimetable = () => {
  // Get the classId from URL parameters
  const { classId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  // Debug logging
  console.log('=== ClassTimetable Debug ===');
  console.log('useParams() result:', useParams());
  console.log('classId value:', classId);
  console.log('location.pathname:', location.pathname);
  console.log('location.search:', location.search);

  useEffect(() => {
    // Validate classId
    if (!classId || classId === 'undefined' || isNaN(parseInt(classId))) {
      console.error('Invalid classId:', classId);
      setError('Invalid class ID. Please go back and select a valid class.');
      setLoading(false);
      return;
    }
    
    fetchTimetable();
  }, [classId]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get session and term from URL query params
      const queryParams = new URLSearchParams(location.search);
      const sessionId = queryParams.get('session');
      const termId = queryParams.get('term');
      
      console.log('Fetching timetable for classId:', classId);
      console.log('Session ID:', sessionId);
      console.log('Term ID:', termId);
      
      // Build URL with query parameters
      let url = `/timetable/class/${classId}/`;
      const params = [];
      if (sessionId) params.push(`session=${sessionId}`);
      if (termId) params.push(`term=${termId}`);
      if (params.length) url += `?${params.join('&')}`;
      
      console.log('Request URL:', url);
      
      const response = await get(url);
      
      console.log('Response:', response);
      
      if (response && response.success) {
        setData(response);
      } else {
        setError(response?.error || 'Failed to load timetable');
      }
    } catch (err) {
      console.error('Error fetching timetable:', err);
      setError(err.message || 'Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  // Show loading
  if (loading) {
    return (
      <DashboardLayout title="Class Timetable">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 size={48} className="animate-spin text-gray-400 mb-4" />
          <p className="text-gray-500">Loading timetable...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Show error
  if (error) {
    return (
      <DashboardLayout title="Class Timetable">
        <div className="py-6 px-4">
          <Alert type="error" message={error} className="mb-4" />
          <div className="flex gap-3">
            <Button onClick={() => navigate('/timetable')} variant="outline">
              <ArrowLeft size={16} className="mr-2" /> Back to Timetables
            </Button>
            <Button onClick={fetchTimetable}>
              <RefreshCw size={16} className="mr-2" /> Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // No data
  if (!data) {
    return (
      <DashboardLayout title="Class Timetable">
        <div className="py-6 px-4">
          <Alert type="warning" message="No timetable data available" />
          <Button onClick={() => navigate('/timetable')} className="mt-4">
            <ArrowLeft size={16} className="mr-2" /> Back to Timetables
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const classInfo = data.class || {};
  const days = data.days || [];
  const periods = data.periods || [];
  const timetable = data.timetable || [];

  return (
    <DashboardLayout title={`Timetable - ${classInfo.name || 'Class'}`}>
      <div className="py-6 px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={() => navigate('/timetable')}
              className="text-gray-500 hover:text-gray-700 text-sm mb-1 flex items-center"
            >
              <ArrowLeft size={14} className="mr-1" /> Back to Timetables
            </button>
            <h1 className="text-xl font-bold">{classInfo.name || 'Class'} Timetable</h1>
            <p className="text-sm text-gray-500">{classInfo.class_level || ''}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchTimetable} className="p-2 border rounded-lg hover:bg-gray-50">
              <RefreshCw size={16} />
            </button>
            <button onClick={() => window.print()} className="p-2 border rounded-lg hover:bg-gray-50">
              <Printer size={16} />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <School size={20} className="mx-auto text-blue-600 mb-1" />
            <p className="text-xs text-gray-600">{classInfo.class_level || 'Class'}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <Calendar size={20} className="mx-auto text-green-600 mb-1" />
            <p className="text-xs text-gray-600">{days.length} Days</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <Clock size={20} className="mx-auto text-purple-600 mb-1" />
            <p className="text-xs text-gray-600">{periods.length} Periods</p>
          </div>
        </div>

        {/* Timetable Table */}
        {days.length > 0 && periods.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left border w-32">Time / Day</th>
                  {days.map(day => (
                    <th key={day.id} className="p-2 text-left border">{day.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map(period => (
                  <tr key={period.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border font-medium whitespace-nowrap bg-gray-50">
                      {period.name}<br/>
                      <span className="text-xs text-gray-400">{period.start_time_display} - {period.end_time_display}</span>
                    </td>
                    {days.map(day => {
                      const dayData = timetable.find(d => d.day_id === day.id);
                      const entry = dayData?.entries?.find(e => e.period_id === period.id)?.entry;
                      return (
                        <td key={day.id} className="p-2 border align-top">
                          {entry ? (
                            <div>
                              <div className="font-medium">{entry.subject_name || '-'}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{entry.teacher_name || '-'}</div>
                              {entry.room_number && <div className="text-xs text-gray-400">Rm: {entry.room_number}</div>}
                            </div>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              {days.length === 0 ? 'No school days configured' : 
               periods.length === 0 ? 'No time periods configured' : 
               'No timetable entries found'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClassTimetable;