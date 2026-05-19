import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import useAuth from '../../hooks/useAuth';
import { getClassTimetable } from '../../services/timetableService';
import { getClasses } from '../../services/academicService';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import {
  Calendar, Clock, BookOpen, Users, ArrowLeft, Printer,
  RefreshCw, AlertCircle, School, User, MapPin, FileText,
  Loader2, Download, Share2
} from 'lucide-react';

const ClassTimetableDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timetable, setTimetable] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session');
  const termId = queryParams.get('term');

  useEffect(() => {
    if (classId) {
      loadTimetable();
    }
  }, [classId, sessionId, termId]);

  const loadTimetable = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await getClassTimetable(classId, sessionId, termId);
      
      if (data.success) {
        setTimetable(data.timetable);
        setClassInfo(data.class);
      } else {
        setError(data.error || 'Failed to load timetable');
      }
    } catch (err) {
      console.error('Error loading timetable:', err);
      setError('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <DashboardLayout title="Class Timetable">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Loading timetable...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Class Timetable">
        <div className="py-6 px-4 sm:px-0">
          <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
          <Button onClick={() => navigate('/timetable')} variant="outline">
            <ArrowLeft size={16} className="mr-2" /> Back to Timetables
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Timetable - ${classInfo?.name || 'Class'}`}>
      <div className="py-6 px-4 sm:px-0">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <button
              onClick={() => navigate('/timetable')}
              className="text-gray-500 hover:text-gray-700 mb-2 flex items-center text-sm"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Timetables
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{classInfo?.name} Timetable</h1>
            <p className="text-gray-500 text-sm mt-1">
              {classInfo?.class_level} {classInfo?.stream && `• ${classInfo.stream}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline" className="border-gray-300">
              <Printer size={16} className="mr-2" /> Print
            </Button>
            <Button onClick={loadTimetable} variant="outline" className="border-gray-300">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Button>
          </div>
        </div>

        {/* Class Info Cards */}
        {classInfo && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <School size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">Class</span>
              </div>
              <p className="text-sm font-semibold mt-1">{classInfo.name}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">Level</span>
              </div>
              <p className="text-sm font-semibold mt-1">{classInfo.class_level || 'N/A'}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">Room</span>
              </div>
              <p className="text-sm font-semibold mt-1">{classInfo.room_number || 'Not assigned'}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">Code</span>
              </div>
              <p className="text-sm font-semibold mt-1">{classInfo.code || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Timetable Table */}
        {timetable && timetable.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-36">Time / Day</th>
                    {timetable.map((day) => (
                      <th key={day.day_id} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        {day.day_name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {timetable[0]?.entries.map((_, periodIdx) => (
                    <tr key={periodIdx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                        <div>{timetable[0].entries[periodIdx]?.period_name}</div>
                        <div className="text-xs text-gray-400">{timetable[0].entries[periodIdx]?.period_time}</div>
                      </td>
                      {timetable.map((day) => {
                        const entry = day.entries[periodIdx]?.entry;
                        return (
                          <td key={day.day_id} className="px-4 py-3 border-l border-gray-100">
                            {entry ? (
                              <div>
                                <div className="font-medium text-gray-800">{entry.subject_name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {entry.teacher_name || 'No teacher'}
                                </div>
                                {entry.room_number && (
                                  <div className="text-xs text-gray-400 mt-0.5">
                                    Room: {entry.room_number}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-300 text-sm">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No timetable entries found for this class</p>
            {['head', 'hm', 'principal', 'vice_principal', 'secretary'].includes(user?.role) && (
              <Button onClick={() => navigate('/timetable/manage')} className="mt-4">
                Create Timetable
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClassTimetableDetail;