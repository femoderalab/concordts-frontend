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
  CheckCircle,
  Clock,
  CalendarDays,
  Hash,
  BookOpen
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { 
  getAcademicTerms, 
  createAcademicTerm, 
  updateAcademicTerm, 
  deleteAcademicTerm,
  getAcademicSessions
} from '../../services/academicService';
import { handleApiError } from '../../services/api';

const AcademicTerms = () => {
  const { user, isAdmin } = useAuth();
  const [terms, setTerms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [termToDelete, setTermToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    session: '',
    term: 'first',
    name: '',
    start_date: '',
    end_date: '',
    is_current: false,
    status: 'upcoming'
  });

  const termOptions = [
    { value: 'first', label: 'First Term' },
    { value: 'second', label: 'Second Term' },
    { value: 'third', label: 'Third Term' }
  ];

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [termsData, sessionsData] = await Promise.all([
        getAcademicTerms(),
        getAcademicSessions()
      ]);
      
      setTerms(termsData.results || termsData || []);
      setSessions(sessionsData.results || sessionsData || []);
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
      
      const submitData = { ...formData };
      if (!submitData.name.trim()) {
        const selectedSession = sessions.find(s => s.id === parseInt(submitData.session));
        const termLabel = termOptions.find(t => t.value === submitData.term)?.label || submitData.term;
        submitData.name = `${termLabel} ${selectedSession?.name || ''}`.trim();
      }
      
      if (editingTerm) {
        await updateAcademicTerm(editingTerm.id, submitData);
        setSuccess('Term updated successfully');
      } else {
        await createAcademicTerm(submitData);
        setSuccess('Term created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleEdit = (term) => {
    setEditingTerm(term);
    setFormData({
      session: term.session?.id || term.session || '',
      term: term.term || 'first',
      name: term.name || '',
      start_date: term.start_date || '',
      end_date: term.end_date || '',
      is_current: term.is_current || false,
      status: term.status || 'upcoming'
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (term) => {
    setTermToDelete(term);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteAcademicTerm(termToDelete.id);
      setSuccess('Term deleted successfully');
      fetchData();
      setIsDeleteModalOpen(false);
      setTermToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
      setIsDeleteModalOpen(false);
    }
  };

  const handleView = (term) => {
    setSelectedTerm(term);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      session: '',
      term: 'first',
      name: '',
      start_date: '',
      end_date: '',
      is_current: false,
      status: 'upcoming'
    });
    setEditingTerm(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return '-';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const getTermLabel = (termValue) => {
    if (!termValue) return '-';
    const termMap = {
      'first': 'First Term',
      'second': 'Second Term',
      'third': 'Third Term'
    };
    return termMap[termValue] || termValue;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'upcoming':
        return <Clock size={16} className="text-blue-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-gray-600" />;
      default:
        return <Calendar size={16} className="text-gray-600" />;
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
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const filteredTerms = terms.filter(term => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (
      (term.name && term.name.toLowerCase().includes(searchString)) ||
      (term.status && term.status.toLowerCase().includes(searchString)) ||
      (term.term && term.term.toLowerCase().includes(searchString)) ||
      (term.session?.name && term.session.name.toLowerCase().includes(searchString))
    );
    
    const matchesFilter = filterStatus === 'all' || term.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: terms.length,
    active: terms.filter(t => t.status === 'active').length,
    current: terms.find(t => t.is_current)?.name || 'None',
    firstTerm: terms.filter(t => t.term === 'first').length,
    secondTerm: terms.filter(t => t.term === 'second').length,
    thirdTerm: terms.filter(t => t.term === 'third').length
  };

  if (loading) {
    return (
      <DashboardLayout title="Academic Terms">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Loading academic terms...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    {
      title: 'Total Terms',
      value: stats.total,
      icon: Calendar,
      color: 'bg-gray-50',
      iconColor: 'text-gray-700',
      detail: 'Academic terms'
    },
    {
      title: 'Active Terms',
      value: stats.active,
      icon: CheckCircle,
      color: 'bg-gray-50',
      iconColor: 'text-green-600',
      detail: 'Currently active'
    },
    {
      title: 'Current Term',
      value: stats.current,
      icon: CheckCircle,
      color: 'bg-gray-50',
      iconColor: 'text-blue-600',
      detail: 'First Term 2024/2025'
    },
    {
      title: 'Term Breakdown',
      value: `${stats.firstTerm}/${stats.secondTerm}/${stats.thirdTerm}`,
      icon: Hash,
      color: 'bg-gray-50',
      iconColor: 'text-gray-700',
      detail: '1st/2nd/3rd Terms'
    }
  ];

  return (
    <DashboardLayout title="Academic Terms">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button
              onClick={fetchData}
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
              Add Term
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
                  placeholder="Search terms by name or status..."
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
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
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
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mr-3`}>
                  <stat.icon className={stat.iconColor} size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-800 truncate">{stat.value}</p>
                  {stat.detail && (
                    <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Terms Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Term Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
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
                {filteredTerms.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-12 w-12 text-gray-400 mb-3" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No terms found</h3>
                        <p className="text-sm text-gray-500">Get started by creating a new academic term.</p>
                        <Button
                          onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                          }}
                          variant="primary"
                          className="mt-4"
                        >
                          <Plus size={18} className="mr-2" />
                          Add Term
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTerms.map((term) => (
                    <tr key={term.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                            <CalendarDays size={18} className="text-gray-700" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{term.name || 'Unnamed Term'}</div>
                            <div className="text-sm text-gray-500">
                              {getTermLabel(term.term)}
                            </div>
                            {term.is_current && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mt-1">
                                Current Term
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {term.session?.name || 'No Session'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(term.start_date)} - {formatDate(term.end_date)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {calculateDuration(term.start_date, term.end_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getStatusIcon(term.status)}
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(term.status)}`}>
                            {term.status?.charAt(0).toUpperCase() + term.status?.slice(1) || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(term)}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => handleEdit(term)}
                                className="text-gray-600 hover:text-gray-900 flex items-center"
                                title="Edit term"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(term)}
                                className="text-gray-600 hover:text-red-700 flex items-center"
                                title="Delete term"
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
          
          {filteredTerms.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{filteredTerms.length}</span> of{' '}
                  <span className="font-medium">{terms.length}</span> terms
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
        title={editingTerm ? 'Edit Academic Term' : 'Create Academic Term'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Select
              label="Academic Session *"
              value={formData.session}
              onChange={(e) => setFormData({...formData, session: e.target.value})}
              options={[
                { value: '', label: 'Select session' }, 
                ...sessions.map(s => ({ 
                  value: s.id, 
                  label: s.name 
                }))
              ]}
              required
            />
            
            <Select
              label="Term *"
              value={formData.term}
              onChange={(e) => setFormData({...formData, term: e.target.value})}
              options={termOptions}
              required
            />
            
            <div>
              <Input
                label="Term Name"
                placeholder="e.g., First Term 2024/2025"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <p className="mt-1 text-xs text-gray-500">
                Will be auto-generated from session and term if left empty
              </p>
            </div>
            
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
                  Set as current term
                </span>
              </label>
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
              {editingTerm ? 'Update Term' : 'Create Term'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTerm(null);
        }}
        title="Term Details"
        size="md"
      >
        {selectedTerm && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedTerm.name || 'Unnamed Term'}</h4>
              <p className="text-sm text-gray-600">{getTermLabel(selectedTerm.term)}</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Academic Session</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedTerm.session?.name || 'No Session'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(selectedTerm.start_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(selectedTerm.end_date)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-900">
                    {calculateDuration(selectedTerm.start_date, selectedTerm.end_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center">
                    {getStatusIcon(selectedTerm.status)}
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(selectedTerm.status)}`}>
                      {selectedTerm.status?.charAt(0).toUpperCase() + selectedTerm.status?.slice(1) || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Current Term</p>
                <span className={`px-2 py-1 text-xs font-medium rounded border ${
                  selectedTerm.is_current 
                    ? 'text-blue-700 bg-blue-50 border-blue-200' 
                    : 'text-gray-700 bg-gray-50 border-gray-200'
                }`}>
                  {selectedTerm.is_current ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedTerm(null);
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
          setTermToDelete(null);
        }}
        title="Confirm Delete"
        size="sm"
      >
        {termToDelete && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Academic Term</h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete "<span className="font-medium">{termToDelete.name || 'Unnamed Term'}</span>"? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <CalendarDays size={16} className="text-gray-500 mr-2" />
                <p className="text-sm font-medium text-gray-900">{getTermLabel(termToDelete.term)}</p>
              </div>
              <div className="flex items-center">
                <BookOpen size={16} className="text-gray-500 mr-2" />
                <p className="text-sm text-gray-600">
                  {termToDelete.session?.name || 'No Session'}
                </p>
              </div>
              <div className="flex items-center mt-1">
                {getStatusIcon(termToDelete.status)}
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(termToDelete.status)}`}>
                  {termToDelete.status?.charAt(0).toUpperCase() + termToDelete.status?.slice(1) || 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setTermToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="danger"
                onClick={handleDelete}
              >
                Delete Term
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default AcademicTerms;