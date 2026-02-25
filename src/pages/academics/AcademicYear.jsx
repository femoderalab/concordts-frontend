import React, { useState, useEffect } from 'react';
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
  Eye
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
  
  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
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
  };

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

  if (loading) {
    return (
      <DashboardLayout title="Academic Year">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Loading academic data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const yearProgress = calculateYearProgress();
  const daysRemaining = calculateDaysRemaining();

  const statsCards = [
    {
      title: 'Sessions',
      value: statistics.totalSessions,
      icon: Calendar,
      color: 'bg-gray-50',
      iconColor: 'text-gray-600',
      link: '/academics/sessions'
    },
    {
      title: 'Terms',
      value: statistics.totalTerms,
      icon: Clock,
      color: 'bg-gray-50',
      iconColor: 'text-gray-600',
      link: '/academics/terms'
    },
    {
      title: 'Programs',
      value: statistics.totalPrograms,
      icon: Layers,
      color: 'bg-gray-50',
      iconColor: 'text-gray-600',
      link: '/academics/programs'
    },
    {
      title: 'Class Levels',
      value: statistics.totalClassLevels,
      icon: GraduationCap,
      color: 'bg-gray-50',
      iconColor: 'text-gray-600',
      link: '/academics/class-levels'
    },
    {
      title: 'Classes',
      value: statistics.totalClasses,
      icon: School,
      color: 'bg-gray-50',
      iconColor: 'text-gray-600',
      link: '/academics/classes'
    },
    {
      title: 'Subjects',
      value: statistics.totalSubjects,
      icon: Book,
      color: 'bg-gray-50',
      iconColor: 'text-gray-600',
      link: '/academics/subjects'
    }
  ];

  return (
    <DashboardLayout title="Academic Year">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">         
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button
              onClick={fetchAcademicData}
              variant="outline"
              className="flex items-center border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
            >
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </Button>
            <Link to="/academics/sessions">
              <Button variant="primary" className="flex items-center">
                <Calendar size={18} className="mr-2" />
                Manage Academics
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4">
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
            />
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-4">
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess('')}
            />
          </div>
        )}

        {/* Current Academic Status */}
        {currentSession && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0 lg:pr-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <Calendar size={24} className="text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {currentSession.name || 'No Active Session'}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {currentSession.start_date ? new Date(currentSession.start_date).toLocaleDateString() : 'Start date not set'} - {currentSession.end_date ? new Date(currentSession.end_date).toLocaleDateString() : 'End date not set'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 ${currentTerm ? 'bg-green-500' : 'bg-yellow-500'} rounded-full mr-3`}></div>
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <p className="text-sm font-medium text-gray-800">
                        {currentTerm ? currentTerm.name : (currentSession.status === 'active' ? 'Active Session' : currentSession.status || 'Unknown')}
                      </p>
                    </div>
                  </div>
                  
                  {daysRemaining > 0 && (
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Days Remaining</p>
                        <p className="text-sm font-medium text-gray-800">{daysRemaining} days</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {yearProgress > 0 && (
                <div className="lg:text-right">
                  <div className="inline-block text-left">
                    <div className="text-3xl font-bold text-gray-800 mb-1">{yearProgress}%</div>
                    <p className="text-sm text-gray-600 mb-3">Year Progress</p>
                    <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-300" 
                        style={{ width: `${yearProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statsCards.map((stat, index) => (
            <Link key={index} to={stat.link}>
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
                    <stat.icon className={stat.iconColor} size={24} />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Current Session & Term Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Session Details */}
          {currentSession && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <Award size={20} className="text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Current Session</h3>
                      <p className="text-sm text-gray-600">{currentSession.name || 'No Session Name'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => showSessionDetails(currentSession)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Duration</p>
                    <p className="text-sm text-gray-800">
                      {currentSession.start_date ? new Date(currentSession.start_date).toLocaleDateString() : 'Not set'} - {currentSession.end_date ? new Date(currentSession.end_date).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Status</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        currentSession.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : currentSession.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {currentSession.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Current</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        currentSession.is_current 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {currentSession.is_current ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </div>
                  
                  {currentSession.description && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 font-medium mb-1">Description</p>
                      <p className="text-sm text-gray-800">{currentSession.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Current Term Details */}
          {currentTerm && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <TrendingUp size={20} className="text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Current Term</h3>
                      <p className="text-sm text-gray-600">{currentTerm.name || 'No Term Name'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => showTermDetails(currentTerm)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Term</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {currentTerm.term === 'first' ? 'First Term' : 
                       currentTerm.term === 'second' ? 'Second Term' : 
                       currentTerm.term === 'third' ? 'Third Term' : 
                       currentTerm.term || 'Unknown Term'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Schedule</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="text-sm text-gray-800">
                          {currentTerm.start_date ? new Date(currentTerm.start_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="text-sm text-gray-800">
                          {currentTerm.end_date ? new Date(currentTerm.end_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Status</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      currentTerm.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : currentTerm.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {(currentTerm.status || 'Active').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Sessions Table */}
        {sessions.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Recent Academic Sessions</h3>
              <p className="text-sm text-gray-600 mt-1">Overview of academic sessions</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.slice(0, 5).map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <Calendar size={16} className="text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{session.name}</div>
                            {session.is_current && (
                              <span className="text-xs text-green-600 font-medium">Current Session</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.start_date ? new Date(session.start_date).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          to {session.end_date ? new Date(session.end_date).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          session.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : session.status === 'upcoming'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => showSessionDetails(session)}
                          className="text-gray-600 hover:text-gray-900 flex items-center"
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200">
              <Link to="/academics/sessions" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                View all sessions
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
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
        size="md"
      >
        {selectedDetails && (
          <div className="space-y-4">
            {selectedDetails.type === 'session' && selectedDetails.data && (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedDetails.data.name}</h4>
                  {selectedDetails.data.description && (
                    <p className="text-sm text-gray-600">{selectedDetails.data.description}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedDetails.data.start_date ? new Date(selectedDetails.data.start_date).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedDetails.data.end_date ? new Date(selectedDetails.data.end_date).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedDetails.data.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : selectedDetails.data.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedDetails.data.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Session</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedDetails.data.is_current 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedDetails.data.is_current ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {selectedDetails.type === 'term' && selectedDetails.data && (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedDetails.data.name}</h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Term</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {selectedDetails.data.term === 'first' ? 'First Term' : 
                       selectedDetails.data.term === 'second' ? 'Second Term' : 
                       selectedDetails.data.term === 'third' ? 'Third Term' : 
                       selectedDetails.data.term || 'Unknown Term'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedDetails.data.start_date ? new Date(selectedDetails.data.start_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedDetails.data.end_date ? new Date(selectedDetails.data.end_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedDetails.data.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedDetails.data.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {(selectedDetails.data.status || 'Active').toUpperCase()}
                    </span>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setDetailsModalOpen(false);
                  setSelectedDetails(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default AcademicYear;