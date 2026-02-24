import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
  Info,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { 
  getAcademicSessions, 
  createAcademicSession, 
  updateAcademicSession, 
  deleteAcademicSession 
} from '../../services/academicService';
import { handleApiError } from '../../services/api';

const AcademicSessions = () => {
  const { user, isAdmin } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    is_current: false,
    status: 'upcoming',
    description: ''
  });

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' }
  ];

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await getAcademicSessions();
      setSessions(response.results || response || []);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (editingSession) {
        await updateAcademicSession(editingSession.id, formData);
        setSuccess('Session updated successfully');
      } else {
        await createAcademicSession(formData);
        setSuccess('Session created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchSessions();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      name: session.name,
      start_date: session.start_date,
      end_date: session.end_date,
      is_current: session.is_current,
      status: session.status,
      description: session.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteAcademicSession(sessionToDelete.id);
      setSuccess('Session deleted successfully');
      fetchSessions();
      setIsDeleteModalOpen(false);
      setSessionToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
      setIsDeleteModalOpen(false);
    }
  };

  const handleView = (session) => {
    setSelectedSession(session);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      start_date: '',
      end_date: '',
      is_current: false,
      status: 'upcoming',
      description: ''
    });
    setEditingSession(null);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'upcoming':
        return <Clock size={16} className="text-blue-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-gray-600" />;
      case 'archived':
        return <Archive size={16} className="text-gray-600" />;
      default:
        return <Info size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'upcoming':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'completed':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'archived':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: sessions.length,
    active: sessions.filter(s => s.status === 'active').length,
    upcoming: sessions.filter(s => s.status === 'upcoming').length,
    current: sessions.find(s => s.is_current)?.name || 'None'
  };

  if (loading) {
    return (
      <DashboardLayout title="Academic Sessions">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Loading academic sessions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Academic Sessions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button
              onClick={fetchSessions}
              variant="outline"
              className="flex items-center border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
            >
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              variant="primary"
              className="flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Session
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}
        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess('')} />
        )}

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search sessions by name or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm text-gray-600">Filter:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="text-gray-700" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-xl font-bold text-gray-800">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <Clock className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-xl font-bold text-gray-800">
                  {stats.upcoming}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <Info className="text-gray-700" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Session</p>
                <p className="text-xl font-bold text-gray-800 truncate">
                  {stats.current}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Details
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
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-12 w-12 text-gray-400 mb-3" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No sessions found</h3>
                        <p className="text-sm text-gray-500">Get started by creating a new academic session.</p>
                        <Button
                          onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                          }}
                          variant="primary"
                          className="mt-4"
                        >
                          <Plus size={18} className="mr-2" />
                          Add Session
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                            <Calendar size={18} className="text-gray-700" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{session.name}</div>
                            <div className="text-sm text-gray-500">
                              {formatDate(session.start_date)} - {formatDate(session.end_date)}
                            </div>
                            {session.is_current && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200 mt-1">
                                Current Session
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {calculateDuration(session.start_date, session.end_date)} days
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(session.start_date)} to {formatDate(session.end_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(session.status)}
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(session.status)}`}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(session)}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => handleEdit(session)}
                                className="text-gray-600 hover:text-gray-900 flex items-center"
                                title="Edit session"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(session)}
                                className="text-gray-600 hover:text-red-700 flex items-center"
                                title="Delete session"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredSessions.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{filteredSessions.length}</span> of{' '}
                  <span className="font-medium">{sessions.length}</span> sessions
                </p>
                <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                  View all
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingSession ? 'Edit Academic Session' : 'Create New Academic Session'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Session Name *"
              placeholder="e.g., 2024/2025 Academic Session"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date *"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required
              />
              
              <Input
                type="date"
                label="End Date *"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                required
              />
            </div>
            
            <Select
              label="Status *"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              options={statusOptions}
              required
            />
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({...formData, is_current: e.target.checked})}
                  className="h-4 w-4 text-gray-700 rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Set as current session
                </span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Optional description about this academic session..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingSession ? 'Update Session' : 'Create Session'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSession(null);
        }}
        title="Session Details"
        size="md"
      >
        {selectedSession && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedSession.name}</h4>
              {selectedSession.description && (
                <p className="text-sm text-gray-600">{selectedSession.description}</p>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(selectedSession.start_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(selectedSession.end_date)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-900">
                    {calculateDuration(selectedSession.start_date, selectedSession.end_date)} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center">
                    {getStatusIcon(selectedSession.status)}
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(selectedSession.status)}`}>
                      {selectedSession.status.charAt(0).toUpperCase() + selectedSession.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Current Session</p>
                <span className={`px-2 py-1 text-xs font-medium rounded border ${
                  selectedSession.is_current 
                    ? 'text-green-700 bg-green-50 border-green-200' 
                    : 'text-gray-700 bg-gray-50 border-gray-200'
                }`}>
                  {selectedSession.is_current ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedSession(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSessionToDelete(null);
        }}
        title="Confirm Delete"
        size="sm"
      >
        {sessionToDelete && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Academic Session</h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete "<span className="font-medium">{sessionToDelete.name}</span>"? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-500 mr-2" />
                <p className="text-sm text-gray-600">
                  {formatDate(sessionToDelete.start_date)} - {formatDate(sessionToDelete.end_date)}
                </p>
              </div>
              <div className="flex items-center mt-1">
                {getStatusIcon(sessionToDelete.status)}
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(sessionToDelete.status)}`}>
                  {sessionToDelete.status.charAt(0).toUpperCase() + sessionToDelete.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSessionToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="danger"
                onClick={handleDelete}
              >
                Delete Session
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default AcademicSessions;