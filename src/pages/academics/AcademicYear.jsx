import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/modal';
import { 
  Calendar, 
  School, 
  Book, 
  RefreshCw, 
  GraduationCap,
  Award,
  TrendingUp,
  Clock,
  Layers,
  FileText,
  ChevronRight,
  Eye,
  X,
  CheckCircle
} from 'lucide-react';
import { 
  getAcademicSessions,
  getAcademicTerms,
  getClassLevels,
  getClasses,
  getSubjects,
  getPrograms
} from '../../services/academicService';
import { handleApiError } from '../../services/api';
import { Link } from 'react-router-dom';

// ============================================
// DESIGN SYSTEM COMPONENTS
// ============================================

// Typography (Sora font assumed via global CSS)
const Text = ({ variant = 'body', children, className = '' }) => {
  const variants = {
    h1: 'text-2xl md:text-3xl font-bold',
    h2: 'text-xl md:text-2xl font-semibold',
    h3: 'text-lg md:text-xl font-semibold',
    h4: 'text-base md:text-lg font-medium',
    body: 'text-sm md:text-base',
    small: 'text-xs md:text-sm',
    caption: 'text-[10px] md:text-xs',
    tiny: 'text-[9px] md:text-[10px]',
  };
  return <div className={`${variants[variant]} text-gray-800 ${className}`}>{children}</div>;
};

// Primary Button (#D94801)
const CustomButton = ({ children, variant = 'primary', size = 'medium', icon: Icon, onClick, loading, disabled, type = 'button', className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease rounded-xl cursor-pointer';
  const variants = {
    primary: 'bg-[#D94801] text-white hover:bg-[#C24000] active:bg-[#A93600] shadow-sm',
    secondary: 'bg-[#1D2B49] text-white hover:bg-[#24385C] active:bg-[#324A74]',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };
  const sizes = {
    large: 'h-12 px-5 text-sm',
    medium: 'h-10 px-4 text-sm',
    small: 'h-8 px-3 text-xs',
    tiny: 'h-7 px-2 text-[10px]',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && <RefreshCw size={14} className="animate-spin" />}
      {Icon && !loading && <Icon size={size === 'tiny' ? 12 : size === 'small' ? 14 : 16} />}
      {children}
    </button>
  );
};

// Card Component
const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-2xl shadow-sm ${hover ? 'transition-shadow duration-200 hover:shadow-md' : ''} ${className}`}>
    {children}
  </div>
);

// Stat Card
const StatCard = ({ title, value, icon: Icon, color, link }) => (
  <Link to={link}>
    <Card className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${color}`}>
          <Icon size={22} className="text-gray-700" />
        </div>
        <Text variant="h3" className="font-bold text-gray-800">{value}</Text>
        <Text variant="caption" className="text-gray-500 mt-1">{title}</Text>
      </div>
    </Card>
  </Link>
);

// Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    active: { bg: 'bg-green-100', text: 'text-green-700', label: 'ACTIVE' },
    upcoming: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'UPCOMING' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'COMPLETED' },
    archived: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'ARCHIVED' }
  };
  const c = config[status] || config.upcoming;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const AcademicYear = () => {
  const [statistics, setStatistics] = useState({
    totalSessions: 0,
    totalTerms: 0,
    totalClasses: 0,
    totalClassLevels: 0,
    totalSubjects: 0,
    totalPrograms: 0
  });
  const [classLevels, setClassLevels] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  
  const fetchAcademicData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const [
        sessionsResponse, 
        termsResponse, 
        classesResponse, 
        classLevelsResponse, 
        subjectsResponse,
        programsResponse
      ] = await Promise.all([
        getAcademicSessions().catch(err => {
          console.error('Error fetching sessions:', err);
          return { results: [] };
        }),
        getAcademicTerms().catch(err => {
          console.error('Error fetching terms:', err);
          return { results: [] };
        }),
        getClasses().catch(err => {
          console.error('Error fetching classes:', err);
          return { results: [] };
        }),
        getClassLevels().catch(err => {
          console.error('Error fetching class levels:', err);
          return { results: [] };
        }),
        getSubjects().catch(err => {
          console.error('Error fetching subjects:', err);
          return { results: [] };
        }),
        getPrograms().catch(err => {
          console.error('Error fetching programs:', err);
          return { results: [] };
        })
      ]);
      
      const sessionsData = sessionsResponse.results || sessionsResponse || [];
      const termsData = termsResponse.results || termsResponse || [];
      
      setSessions(sessionsData);
      setTerms(termsData);
      
      const foundCurrentSession = sessionsData.find(session => session.is_current) || 
                                 sessionsData.find(session => session.status === 'active') || 
                                 sessionsData[0];
      setCurrentSession(foundCurrentSession);
      
      const foundCurrentTerm = termsData.find(term => term.is_current) || 
                              termsData.find(term => term.status === 'active') || 
                              termsData[0];
      setCurrentTerm(foundCurrentTerm);
      
      setStatistics({
        totalSessions: sessionsData.length,
        totalTerms: termsData.length,
        totalClasses: Array.isArray(classesResponse) ? classesResponse.length : 
                     classesResponse.results?.length || classesResponse.count || 0,
        totalClassLevels: Array.isArray(classLevelsResponse) ? classLevelsResponse.length : 
                         classLevelsResponse.results?.length || 0,
        totalSubjects: Array.isArray(subjectsResponse) ? subjectsResponse.length : 
                      subjectsResponse.results?.length || subjectsResponse.count || 0,
        totalPrograms: Array.isArray(programsResponse) ? programsResponse.length : 
                      programsResponse.results?.length || programsResponse.count || 0
      });

      setClassLevels(classLevelsResponse.results || classLevelsResponse || []);
      setPrograms(programsResponse.results || programsResponse || []);
      
      if (sessionsData.length > 0) {
        setSuccess('Academic data loaded successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching academic year data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcademicData();
  }, [fetchAcademicData]);

  const calculateYearProgress = () => {
    if (!currentSession || !currentSession.start_date || !currentSession.end_date) {
      return 0;
    }
    
    const startDate = new Date(currentSession.start_date);
    const endDate = new Date(currentSession.end_date);
    const today = new Date();
    
    const totalDuration = endDate - startDate;
    const elapsed = today - startDate;
    
    if (totalDuration <= 0) return 0;
    
    const progress = Math.round((elapsed / totalDuration) * 100);
    return Math.max(0, Math.min(100, progress));
  };

  const calculateDaysRemaining = () => {
    if (!currentSession || !currentSession.end_date) {
      return 0;
    }
    
    const endDate = new Date(currentSession.end_date);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const showSessionDetails = (session) => {
    setSelectedDetails({
      type: 'session',
      title: 'Academic Session Details',
      data: session
    });
    setDetailsModalOpen(true);
  };

  const showTermDetails = (term) => {
    setSelectedDetails({
      type: 'term',
      title: 'Academic Term Details',
      data: term
    });
    setDetailsModalOpen(true);
  };

  const yearProgress = calculateYearProgress();
  const daysRemaining = calculateDaysRemaining();

  const statsCards = [
    { title: 'Sessions', value: statistics.totalSessions, icon: Calendar, color: 'bg-gray-100', link: '/academics/sessions' },
    { title: 'Terms', value: statistics.totalTerms, icon: Clock, color: 'bg-gray-100', link: '/academics/terms' },
    { title: 'Programs', value: statistics.totalPrograms, icon: Layers, color: 'bg-gray-100', link: '/academics/programs' },
    { title: 'Class Levels', value: statistics.totalClassLevels, icon: GraduationCap, color: 'bg-gray-100', link: '/academics/class-levels' },
    { title: 'Classes', value: statistics.totalClasses, icon: School, color: 'bg-gray-100', link: '/academics/classes' },
    { title: 'Subjects', value: statistics.totalSubjects, icon: Book, color: 'bg-gray-100', link: '/academics/subjects' }
  ];

  if (loading) {
    return (
      <DashboardLayout title="Academic Year">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-[#D94801] mx-auto mb-4" />
            <Text variant="body" className="text-gray-400">Loading academic data...</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Academic Year">
      <div className="space-y-4 pb-10 px-3 sm:px-4 lg:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm">
                <Award size={14} className="text-white" />
              </div>
              <Text variant="h2" className="font-bold">Academic Year</Text>
            </div>
            <Text variant="caption" className="text-gray-400 pl-9">
              Manage school academic calendar and structure
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <CustomButton variant="outline" size="small" icon={RefreshCw} onClick={fetchAcademicData} loading={loading}>
              Refresh
            </CustomButton>
            <Link to="/academics/sessions">
              <CustomButton variant="primary" size="small" icon={Calendar}>
                Manage Academics
              </CustomButton>
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}
        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess('')} />
        )}

        {/* Current Academic Status */}
        {currentSession && (
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-gray-700" />
                  </div>
                  <div>
                    <Text variant="h4" className="font-bold">{currentSession.name || 'No Active Session'}</Text>
                    <Text variant="caption" className="text-gray-500">
                      {formatDate(currentSession.start_date)} - {formatDate(currentSession.end_date)}
                    </Text>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 ${currentTerm ? 'bg-green-500' : 'bg-yellow-500'} rounded-full`}></div>
                    <div>
                      <Text variant="caption" className="text-gray-500">Current Status</Text>
                      <Text variant="small" className="font-medium text-gray-800">
                        {currentTerm ? currentTerm.name : (currentSession.status === 'active' ? 'Active Session' : currentSession.status || 'Unknown')}
                      </Text>
                    </div>
                  </div>
                  
                  {daysRemaining > 0 && (
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-500" />
                      <div>
                        <Text variant="caption" className="text-gray-500">Days Remaining</Text>
                        <Text variant="small" className="font-medium text-gray-800">{daysRemaining} days</Text>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {yearProgress > 0 && (
                <div className="lg:text-right">
                  <div className="inline-block text-left">
                    <Text variant="h2" className="font-bold text-gray-800 mb-1">{yearProgress}%</Text>
                    <Text variant="caption" className="text-gray-500 mb-2 block">Year Progress</Text>
                    <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#D94801] rounded-full transition-all duration-300" 
                        style={{ width: `${yearProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Quick Stats - Responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Current Session & Term Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Session Details */}
          {currentSession && (
            <Card className="overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Award size={16} className="text-gray-700" />
                    </div>
                    <div>
                      <Text variant="small" className="font-semibold text-gray-800">Current Session</Text>
                      <Text variant="caption" className="text-gray-500">{currentSession.name || 'No Session Name'}</Text>
                    </div>
                  </div>
                  <button onClick={() => showSessionDetails(currentSession)} className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <Text variant="caption" className="text-gray-500 font-medium">Duration</Text>
                  <Text variant="small" className="text-gray-800">
                    {formatDate(currentSession.start_date)} - {formatDate(currentSession.end_date)}
                  </Text>
                </div>
                
                <div className="flex gap-4">
                  <div>
                    <Text variant="caption" className="text-gray-500 font-medium">Status</Text>
                    <StatusBadge status={currentSession.status} />
                  </div>
                  
                  <div>
                    <Text variant="caption" className="text-gray-500 font-medium">Current</Text>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium ${currentSession.is_current ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {currentSession.is_current ? 'YES' : 'NO'}
                    </span>
                  </div>
                </div>
                
                {currentSession.description && (
                  <div className="pt-2 border-t border-gray-100">
                    <Text variant="caption" className="text-gray-500 font-medium">Description</Text>
                    <Text variant="caption" className="text-gray-600 mt-1">{currentSession.description}</Text>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Current Term Details */}
          {currentTerm && (
            <Card className="overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <TrendingUp size={16} className="text-gray-700" />
                    </div>
                    <div>
                      <Text variant="small" className="font-semibold text-gray-800">Current Term</Text>
                      <Text variant="caption" className="text-gray-500">{currentTerm.name || 'No Term Name'}</Text>
                    </div>
                  </div>
                  <button onClick={() => showTermDetails(currentTerm)} className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <Text variant="caption" className="text-gray-500 font-medium">Term</Text>
                  <Text variant="small" className="font-medium text-gray-800 capitalize">
                    {currentTerm.term === 'first' ? 'First Term' : 
                     currentTerm.term === 'second' ? 'Second Term' : 
                     currentTerm.term === 'third' ? 'Third Term' : 
                     currentTerm.term || 'Unknown Term'}
                  </Text>
                </div>
                
                <div>
                  <Text variant="caption" className="text-gray-500 font-medium">Schedule</Text>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div>
                      <Text variant="tiny" className="text-gray-400">Start Date</Text>
                      <Text variant="small" className="text-gray-800">{formatDate(currentTerm.start_date)}</Text>
                    </div>
                    <div>
                      <Text variant="tiny" className="text-gray-400">End Date</Text>
                      <Text variant="small" className="text-gray-800">{formatDate(currentTerm.end_date)}</Text>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Text variant="caption" className="text-gray-500 font-medium">Status</Text>
                  <StatusBadge status={currentTerm.status} />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Recent Sessions Table */}
        {sessions.length > 0 && (
          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <Text variant="small" className="font-semibold text-gray-800">Recent Academic Sessions</Text>
              <Text variant="caption" className="text-gray-500">Overview of academic sessions</Text>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Session Name</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Duration</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sessions.slice(0, 5).map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Calendar size={14} className="text-gray-600" />
                          </div>
                          <div>
                            <Text variant="small" className="font-medium text-gray-800">{session.name}</Text>
                            {session.is_current && (
                              <Text variant="tiny" className="text-green-600 font-medium">Current Session</Text>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Text variant="caption" className="text-gray-600">{formatDate(session.start_date)}</Text>
                        <Text variant="tiny" className="text-gray-400">to {formatDate(session.end_date)}</Text>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={session.status} />
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => showSessionDetails(session)} className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
                          <Eye size={14} /> <span className="text-[10px]">View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-4 py-3 border-t border-gray-100">
              <Link to="/academics/sessions" className="text-[#D94801] hover:text-[#C24000] text-xs flex items-center gap-1">
                View all sessions <ChevronRight size={12} />
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedDetails(null);
        }}
        title={selectedDetails?.title || 'Details'}
        size="sm"
      >
        {selectedDetails && (
          <div className="py-3 space-y-3">
            {selectedDetails.type === 'session' && selectedDetails.data && (
              <>
                <div className="bg-gray-50 rounded-xl p-3">
                  <Text variant="h4" className="font-bold">{selectedDetails.data.name}</Text>
                  {selectedDetails.data.description && (
                    <Text variant="caption" className="text-gray-500 mt-1">{selectedDetails.data.description}</Text>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Text variant="caption" className="text-gray-500">Start Date</Text>
                      <Text variant="small" className="font-medium text-gray-900">{formatDate(selectedDetails.data.start_date)}</Text>
                    </div>
                    <div>
                      <Text variant="caption" className="text-gray-500">End Date</Text>
                      <Text variant="small" className="font-medium text-gray-900">{formatDate(selectedDetails.data.end_date)}</Text>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Text variant="caption" className="text-gray-500">Status</Text>
                      <StatusBadge status={selectedDetails.data.status} />
                    </div>
                    <div>
                      <Text variant="caption" className="text-gray-500">Current Session</Text>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium ${selectedDetails.data.is_current ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {selectedDetails.data.is_current ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {selectedDetails.type === 'term' && selectedDetails.data && (
              <>
                <div className="bg-gray-50 rounded-xl p-3">
                  <Text variant="h4" className="font-bold">{selectedDetails.data.name}</Text>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Text variant="caption" className="text-gray-500">Term</Text>
                    <Text variant="small" className="font-medium text-gray-900 capitalize">
                      {selectedDetails.data.term === 'first' ? 'First Term' : 
                       selectedDetails.data.term === 'second' ? 'Second Term' : 
                       selectedDetails.data.term === 'third' ? 'Third Term' : 
                       selectedDetails.data.term || 'Unknown Term'}
                    </Text>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Text variant="caption" className="text-gray-500">Start Date</Text>
                      <Text variant="small" className="font-medium text-gray-900">{formatDate(selectedDetails.data.start_date)}</Text>
                    </div>
                    <div>
                      <Text variant="caption" className="text-gray-500">End Date</Text>
                      <Text variant="small" className="font-medium text-gray-900">{formatDate(selectedDetails.data.end_date)}</Text>
                    </div>
                  </div>
                  
                  <div>
                    <Text variant="caption" className="text-gray-500">Status</Text>
                    <StatusBadge status={selectedDetails.data.status} />
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-end pt-3 border-t border-gray-100">
              <CustomButton variant="outline" size="small" onClick={() => { setDetailsModalOpen(false); setSelectedDetails(null); }}>
                Close
              </CustomButton>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default AcademicYear;