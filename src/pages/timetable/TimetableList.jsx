import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import useAuth from '../../hooks/useAuth';
import { getAllClassTimetables } from '../../services/timetableService';
import { getAcademicSessions, getAcademicTerms } from '../../services/academicService';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import {
  Calendar, Clock, BookOpen, Users, Eye, RefreshCw,
  AlertCircle, School, ChevronRight, CheckCircle, XCircle,
  Loader2, Table, Grid3x3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TimetableList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  
  const canManage = ['head', 'hm', 'principal', 'vice_principal', 'secretary'].includes(user?.role);

  useEffect(() => {
    loadData();
  }, [selectedSession, selectedTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load sessions and terms first
      const [sessionsRes, termsRes] = await Promise.all([
        getAcademicSessions(),
        getAcademicTerms()
      ]);
      
      const sessionsList = sessionsRes.results || sessionsRes || [];
      const termsList = termsRes.results || termsRes || [];
      
      setSessions(sessionsList);
      setTerms(termsList);
      
      // Set default selections
      if (!selectedSession) {
        const currentSession = sessionsList.find(s => s.is_current);
        if (currentSession) setSelectedSession(currentSession.id);
        else if (sessionsList.length > 0) setSelectedSession(sessionsList[0].id);
      }
      
      if (!selectedTerm) {
        const currentTerm = termsList.find(t => t.is_current);
        if (currentTerm) setSelectedTerm(currentTerm.id);
        else if (termsList.length > 0) setSelectedTerm(termsList[0].id);
      }
      
      // Load class timetables
      if (selectedSession || (sessionsList.length > 0)) {
        const sessionId = selectedSession || (sessionsList[0]?.id);
        const termId = selectedTerm || (termsList[0]?.id);
        
        const data = await getAllClassTimetables(sessionId, termId);
        if (data.success) {
          setClasses(data.classes || []);
        } else {
          setError(data.error || 'Failed to load timetables');
        }
      }
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load timetable data');
    } finally {
      setLoading(false);
    }
  };

// Find this function and replace it
    const handleClassClick = (classId) => {
    if (!classId) {
        console.error('No class ID provided');
        return;
    }
    console.log('Navigating to class ID:', classId);
    console.log('Session:', selectedSession);
    console.log('Term:', selectedTerm);
    navigate(`/timetable/class/${classId}?session=${selectedSession}&term=${selectedTerm}`);
    };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (hasTimetable) => {
    if (hasTimetable) {
      return <CheckCircle size={16} className="text-green-500" />;
    }
    return <XCircle size={16} className="text-red-400" />;
  };

  if (loading) {
    return (
      <DashboardLayout title="Timetables">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Loading timetables...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Class Timetables">
      <div className="py-6 px-4 sm:px-0">
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Class Timetables</h1>
            <p className="text-gray-500 text-sm mt-1">View and manage class schedules</p>
          </div>
          <div className="flex gap-2">
            {canManage && (
              <Button onClick={() => navigate('/timetable/manage')} className="bg-gray-900 hover:bg-gray-700">
                <Table size={16} className="mr-2" /> Manage Timetable
              </Button>
            )}
            <Button onClick={loadData} variant="outline" className="border-gray-300">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Class Cards Grid */}
        {classes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <School size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No classes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
  <Link
    to={`/timetable/class/${cls.class_id}?session=${selectedSession}&term=${selectedTerm}`}
    key={cls.class_id}
    className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
  >
    {/* Card Header */}
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white font-semibold text-lg">{cls.class_name}</h3>
          <p className="text-gray-300 text-sm">
            {cls.class_level} {cls.stream && `• ${cls.stream}`}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white/20 rounded-lg px-2 py-1">
          {cls.has_timetable ? (
            <CheckCircle size={14} className="text-green-400" />
          ) : (
            <XCircle size={14} className="text-red-400" />
          )}
          <span className="text-white text-xs ml-1">
            {cls.completion_percentage}%
          </span>
        </div>
      </div>
    </div>
    
    {/* Card Body */}
    <div className="p-4">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Timetable Progress</span>
          <span>{cls.total_entries}/{cls.total_possible} slots</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              cls.completion_percentage >= 80 ? 'bg-green-500' : 
              cls.completion_percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${cls.completion_percentage}%` }}
          />
        </div>
      </div>
      
      {/* Preview of first few days */}
      {cls.timetable_preview && cls.timetable_preview.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-500">Preview</p>
          {cls.timetable_preview.map((day, idx) => (
            <div key={idx} className="border-l-2 border-gray-200 pl-3">
              <p className="text-sm font-medium text-gray-700">{day.day_name}</p>
              <div className="flex gap-2 mt-1">
                {day.entries.map((period, pIdx) => (
                  <span key={pIdx} className="text-xs text-gray-500">
                    {period.subject || '—'}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* View Button */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="w-full text-center py-2 text-sm text-gray-600 group-hover:text-gray-900">
          View Timetable →
        </div>
      </div>
    </div>
  </Link>
))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TimetableList;