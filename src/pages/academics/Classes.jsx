import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { 
  School, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw,
  Search,
  Filter,
  Users,
  Building,
  GraduationCap,
  Calendar,
  Clock,
  ChevronRight,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  getClasses, 
  createClass, 
  updateClass, 
  deleteClass,
  getClassLevels,
  getAcademicSessions,
  getAcademicTerms
} from '../../services/academicService';
import { handleApiError } from '../../services/api';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [classLevels, setClassLevels] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [allTerms, setAllTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classToDelete, setClassToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    session: '',
    term: '',
    class_level: '',
    name: '',
    stream: '',
    max_capacity: 40,
    class_teacher: '',
    room_number: '',
    building: '',
    status: 'active',
    is_active: true
  });

  const streamOptions = [
    { value: '', label: 'Select stream (optional)' },
    { value: 'science', label: 'Science' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'arts', label: 'Arts/Humanities' },
    { value: 'general', label: 'General' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesData, classLevelsData, sessionsData, termsData] = await Promise.all([
        getClasses(),
        getClassLevels(),
        getAcademicSessions(),
        getAcademicTerms()
      ]);

      setClasses(classesData.results || classesData || []);
      setClassLevels(classLevelsData.results || classLevelsData || []);
      setSessions(sessionsData.results || sessionsData || []);
      setAllTerms(termsData.results || termsData || []);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTerms = () => {
    if (!formData.session) {
      return [];
    }
    
    return allTerms.filter(term => {
      const termSessionId = term.session?.id || term.session;
      return termSessionId === formData.session || termSessionId === parseInt(formData.session);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      const selectedTerm = allTerms.find(t => t.id === parseInt(formData.term));
      const selectedSessionId = parseInt(formData.session);
      
      if (selectedTerm) {
        const termSessionId = selectedTerm.session?.id || selectedTerm.session;
        if (termSessionId !== selectedSessionId) {
          setError('Selected term does not belong to the selected session. Please choose a term from the selected session.');
          return;
        }
      }
      
      if (editingClass) {
        await updateClass(editingClass.id, formData);
        setSuccess('Class updated successfully');
      } else {
        await createClass(formData);
        setSuccess('Class created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      session: classItem.session?.id || classItem.session || '',
      term: classItem.term?.id || classItem.term || '',
      class_level: classItem.class_level?.id || classItem.class_level || '',
      name: classItem.name || '',
      stream: classItem.stream || '',
      max_capacity: classItem.max_capacity || 40,
      class_teacher: classItem.class_teacher?.id || classItem.class_teacher || '',
      room_number: classItem.room_number || '',
      building: classItem.building || '',
      status: classItem.status || 'active',
      is_active: classItem.is_active !== undefined ? classItem.is_active : true
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (classItem) => {
    setClassToDelete(classItem);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteClass(classToDelete.id);
      setSuccess('Class deleted successfully');
      fetchData();
      setIsDeleteModalOpen(false);
      setClassToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
      setIsDeleteModalOpen(false);
    }
  };

  const handleView = (classItem) => {
    setSelectedClass(classItem);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      session: '',
      term: '',
      class_level: '',
      name: '',
      stream: '',
      max_capacity: 40,
      class_teacher: '',
      room_number: '',
      building: '',
      status: 'active',
      is_active: true
    });
    setEditingClass(null);
  };

  const handleSessionChange = (e) => {
    const newSession = e.target.value;
    setFormData({
      ...formData, 
      session: newSession,
      term: ''
    });
  };

  const getCapacityPercentage = (current, max) => {
    if (!max || max === 0) return 0;
    return Math.round((current / max) * 100);
  };

  const formatDateFromTerm = (termData) => {
    if (!termData) return 'N/A';
    if (termData.start_date && termData.end_date) {
      return `${new Date(termData.start_date).toLocaleDateString()} - ${new Date(termData.end_date).toLocaleDateString()}`;
    }
    return 'N/A';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'inactive':
        return <XCircle size={16} className="text-gray-600" />;
      case 'graduated':
        return <GraduationCap size={16} className="text-blue-600" />;
      default:
        return <Info size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'graduated':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStreamColor = (stream) => {
    switch (stream) {
      case 'science':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'commercial':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'arts':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'general':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  const filteredClasses = classes.filter(classItem => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (
      (classItem.name && classItem.name.toLowerCase().includes(searchString)) ||
      (classItem.code && classItem.code.toLowerCase().includes(searchString)) ||
      (classItem.room_number && classItem.room_number.toLowerCase().includes(searchString)) ||
      (classItem.class_level?.name && classItem.class_level.name.toLowerCase().includes(searchString))
    );
    const matchesFilter = statusFilter === 'all' || classItem.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: classes.length,
    active: classes.filter(c => c.status === 'active').length,
    totalStudents: classes.reduce((total, c) => total + (c.current_enrollment || 0), 0),
    totalCapacity: classes.reduce((total, c) => total + (c.max_capacity || 40), 0),
    capacityPercentage: () => {
      const totalCapacity = stats.totalCapacity;
      const totalEnrolled = stats.totalStudents;
      return totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Classes">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Loading classes data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Classes">
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
              Add Class
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
                  placeholder="Search classes by name, code, or room..."
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
                <School className="text-gray-700" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="text-gray-700" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-xl font-bold text-gray-800">
                  {stats.totalStudents}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Classes</p>
                <p className="text-xl font-bold text-gray-800">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <Building className="text-gray-700" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacity Used</p>
                <p className="text-xl font-bold text-gray-800">
                  {stats.capacityPercentage()}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Classes Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment
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
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <School className="h-12 w-12 text-gray-400 mb-3" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No classes found</h3>
                        <p className="text-sm text-gray-500">Get started by creating a new class.</p>
                        <Button
                          onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                          }}
                          variant="primary"
                          className="mt-4"
                        >
                          <Plus size={18} className="mr-2" />
                          Add Class
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((classItem) => {
                    const current = classItem.current_enrollment || 0;
                    const max = classItem.max_capacity || 40;
                    const percentage = getCapacityPercentage(current, max);
                    
                    return (
                      <tr key={classItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                              <School size={18} className="text-gray-700" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{classItem.name}</div>
                              {classItem.code && <div className="text-xs text-gray-500">{classItem.code}</div>}
                              {classItem.class_level?.name && (
                                <div className="text-xs text-gray-600 mt-1">{classItem.class_level.name}</div>
                              )}
                              {classItem.stream && (
                                <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-medium rounded border ${getStreamColor(classItem.stream)}`}>
                                  {classItem.stream.charAt(0).toUpperCase() + classItem.stream.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Calendar size={14} className="text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {classItem.session?.name || classItem.session_name || 'No Session'}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock size={14} className="text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {classItem.term?.name || classItem.term_name || 'No Term'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {current}/{max} ({percentage}%)
                              </div>
                              <div className="w-32 bg-gray-200 rounded-full h-1.5 mt-1">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    percentage >= 90 ? 'bg-red-500' : 
                                    percentage >= 70 ? 'bg-yellow-500' : 
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(100, percentage)}%` }}
                                ></div>
                              </div>
                            </div>
                            {classItem.room_number && (
                              <div className="text-xs text-gray-500">
                                Room: {classItem.room_number}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(classItem.status)}
                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(classItem.status)}`}>
                              {classItem.status?.charAt(0).toUpperCase() + classItem.status?.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleView(classItem)}
                              className="text-gray-600 hover:text-gray-900 flex items-center"
                              title="View details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(classItem)}
                              className="text-gray-600 hover:text-gray-900 flex items-center"
                              title="Edit class"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(classItem)}
                              className="text-gray-600 hover:text-red-700 flex items-center"
                              title="Delete class"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {filteredClasses.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{filteredClasses.length}</span> of{' '}
                  <span className="font-medium">{classes.length}</span> classes
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
        title={editingClass ? 'Edit Class' : 'Create New Class'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Academic Session *"
                value={formData.session}
                onChange={handleSessionChange}
                options={[{ value: '', label: 'Select session' }, ...sessions.map(s => ({ 
                  value: s.id, 
                  label: s.name 
                }))]}
                required
              />
              
              <Select
                label="Academic Term *"
                value={formData.term}
                onChange={(e) => setFormData({...formData, term: e.target.value})}
                options={[
                  { value: '', label: formData.session ? 'Select term' : 'Select session first' }, 
                  ...getFilteredTerms().map(t => ({ 
                    value: t.id, 
                    label: `${t.name} (${t.term_display || t.term || ''})` 
                  }))
                ]}
                required
                disabled={!formData.session}
              />
            </div>
            
            <Select
              label="Class Level *"
              value={formData.class_level}
              onChange={(e) => setFormData({...formData, class_level: e.target.value})}
              options={[{ value: '', label: 'Select class level' }, ...classLevels.map(cl => ({ 
                value: cl.id, 
                label: cl.name 
              }))]}
              required
            />
            
            <Input
              label="Class Name *"
              placeholder="e.g., JSS 1 Three, SSS 2 Science A"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <Select
              label="Stream (for SSS only)"
              value={formData.stream}
              onChange={(e) => setFormData({...formData, stream: e.target.value})}
              options={streamOptions}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Maximum Capacity"
                value={formData.max_capacity}
                onChange={(e) => setFormData({...formData, max_capacity: parseInt(e.target.value) || 0})}
                min="1"
                max="100"
              />
              
              <Input
                label="Class Teacher ID (Optional)"
                placeholder="Teacher ID"
                value={formData.class_teacher}
                onChange={(e) => setFormData({...formData, class_teacher: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Room Number"
                placeholder="e.g., Room 101"
                value={formData.room_number}
                onChange={(e) => setFormData({...formData, room_number: e.target.value})}
              />
              
              <Input
                label="Building"
                placeholder="e.g., Main Building"
                value={formData.building}
                onChange={(e) => setFormData({...formData, building: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Status *"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                options={statusOptions}
                required
              />
              
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="h-4 w-4 text-gray-700 rounded border-gray-300"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Class is active
                </label>
              </div>
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
              {editingClass ? 'Update Class' : 'Create Class'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedClass(null);
        }}
        title="Class Details"
        size="md"
      >
        {selectedClass && (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <School size={24} className="text-gray-700" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{selectedClass.name}</h4>
                {selectedClass.code && <p className="text-sm text-gray-600">{selectedClass.code}</p>}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Class Level</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedClass.class_level?.name || selectedClass.class_level_name || 'N/A'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Academic Session</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedClass.session?.name || selectedClass.session_name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Academic Term</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedClass.term?.name || selectedClass.term_name || 'N/A'}
                  </p>
                </div>
              </div>
              
              {selectedClass.stream && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Stream</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getStreamColor(selectedClass.stream)}`}>
                    {selectedClass.stream.charAt(0).toUpperCase() + selectedClass.stream.slice(1)}
                  </span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Enrollment</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedClass.current_enrollment || 0}/{selectedClass.max_capacity || 40}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className={`h-1.5 rounded-full ${
                        getCapacityPercentage(selectedClass.current_enrollment, selectedClass.max_capacity) >= 90 ? 'bg-red-500' : 
                        getCapacityPercentage(selectedClass.current_enrollment, selectedClass.max_capacity) >= 70 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, getCapacityPercentage(selectedClass.current_enrollment, selectedClass.max_capacity))}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <div className="flex items-center">
                    {getStatusIcon(selectedClass.status)}
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(selectedClass.status)}`}>
                      {selectedClass.status?.charAt(0).toUpperCase() + selectedClass.status?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Room Number</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedClass.room_number || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Building</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedClass.building || 'Not assigned'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Class Teacher</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedClass.class_teacher?.get_full_name || 
                   selectedClass.class_teacher?.full_name || 
                   selectedClass.class_teacher_name || 
                   'Not assigned'}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedClass(null);
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
          setClassToDelete(null);
        }}
        title="Confirm Delete"
        size="sm"
      >
        {classToDelete && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Class</h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete "<span className="font-medium">{classToDelete.name}</span>"? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <School size={16} className="text-gray-500 mr-2" />
                <p className="text-sm text-gray-600">{classToDelete.name}</p>
              </div>
              <div className="flex items-center mt-1">
                {getStatusIcon(classToDelete.status)}
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(classToDelete.status)}`}>
                  {classToDelete.status?.charAt(0).toUpperCase() + classToDelete.status?.slice(1)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {classToDelete.current_enrollment || 0} students enrolled
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setClassToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="danger"
                onClick={handleDelete}
              >
                Delete Class
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default Classes;