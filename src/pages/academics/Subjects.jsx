import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { 
  Book, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw,
  Search,
  Filter,
  Percent,
  Award,
  CheckCircle,
  XCircle,
  ChevronRight,
  Hash,
  AlertCircle,
  BookOpen,
  Users,
  GraduationCap
} from 'lucide-react';
import { 
  getSubjects, 
  createSubject, 
  updateSubject, 
  deleteSubject 
} from '../../services/academicService';
import { handleApiError } from '../../services/api';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    short_name: '',
    subject_type: 'core',
    stream: 'general',
    is_compulsory: true,
    is_examinable: true,
    has_practical: false,
    ca_weight: 40,
    exam_weight: 60,
    total_marks: 100,
    pass_mark: 40,
    available_for_creche: false,
    available_for_nursery: false,
    available_for_primary: false,
    available_for_jss: false,
    available_for_sss: false,
    is_active: true,
    description: ''
  });

  const subjectTypeOptions = [
    { value: 'core', label: 'Core Subject' },
    { value: 'elective', label: 'Elective Subject' },
    { value: 'vocational', label: 'Vocational Subject' },
    { value: 'religious', label: 'Religious Studies' },
    { value: 'language', label: 'Language' },
    { value: 'science', label: 'Science' },
    { value: 'arts', label: 'Arts/Humanities' },
    { value: 'commercial', label: 'Commercial/Business' },
    { value: 'technical', label: 'Technical' },
    { value: 'pre_school', label: 'Pre-School Subject' }
  ];

  const streamOptions = [
    { value: 'science', label: 'Science Stream' },
    { value: 'commercial', label: 'Commercial Stream' },
    { value: 'arts', label: 'Arts/Humanities Stream' },
    { value: 'general', label: 'General (All Streams)' },
    { value: 'technical', label: 'Technical Stream' },
    { value: 'pre_school', label: 'Pre-School' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'core', label: 'Core Subjects' },
    { value: 'elective', label: 'Elective Subjects' },
    { value: 'vocational', label: 'Vocational Subjects' },
    { value: 'language', label: 'Language Subjects' },
    { value: 'science', label: 'Science Subjects' },
    { value: 'arts', label: 'Arts/Humanities' },
    { value: 'commercial', label: 'Commercial/Business' },
    { value: 'technical', label: 'Technical' },
    { value: 'religious', label: 'Religious Studies' },
    { value: 'pre_school', label: 'Pre-School' }
  ];

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await getSubjects();
      setSubjects(response.results || response || []);
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
      
      if (editingSubject) {
        await updateSubject(editingSubject.id, formData);
        setSuccess('Subject updated successfully!');
      } else {
        await createSubject(formData);
        setSuccess('Subject created successfully!');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchSubjects();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name || '',
      code: subject.code || '',
      short_name: subject.short_name || '',
      subject_type: subject.subject_type || 'core',
      stream: subject.stream || 'general',
      is_compulsory: subject.is_compulsory || true,
      is_examinable: subject.is_examinable || true,
      has_practical: subject.has_practical || false,
      ca_weight: subject.ca_weight || 40,
      exam_weight: subject.exam_weight || 60,
      total_marks: subject.total_marks || 100,
      pass_mark: subject.pass_mark || 40,
      available_for_creche: subject.available_for_creche || false,
      available_for_nursery: subject.available_for_nursery || false,
      available_for_primary: subject.available_for_primary || false,
      available_for_jss: subject.available_for_jss || false,
      available_for_sss: subject.available_for_sss || false,
      is_active: subject.is_active || true,
      description: subject.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (subject) => {
    setSubjectToDelete(subject);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSubject(subjectToDelete.id);
      setSuccess('Subject deleted successfully!');
      fetchSubjects();
      setIsDeleteModalOpen(false);
      setSubjectToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
      setIsDeleteModalOpen(false);
    }
  };

  const handleView = (subject) => {
    setSelectedSubject(subject);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      short_name: '',
      subject_type: 'core',
      stream: 'general',
      is_compulsory: true,
      is_examinable: true,
      has_practical: false,
      ca_weight: 40,
      exam_weight: 60,
      total_marks: 100,
      pass_mark: 40,
      available_for_creche: false,
      available_for_nursery: false,
      available_for_primary: false,
      available_for_jss: false,
      available_for_sss: false,
      is_active: true,
      description: ''
    });
    setEditingSubject(null);
    setError('');
  };

  const getSubjectIcon = (type) => {
    switch(type) {
      case 'science': return <GraduationCap size={16} className="text-gray-600" />;
      case 'language': return <BookOpen size={16} className="text-gray-600" />;
      case 'arts': return <Users size={16} className="text-gray-600" />;
      default: return <Book size={16} className="text-gray-600" />;
    }
  };

  const getSubjectColor = (type) => {
    return 'text-gray-700 bg-gray-50 border-gray-200';
  };

  const getAvailabilityLabels = (subject) => {
    const labels = [];
    if (subject.available_for_creche) labels.push('Creche');
    if (subject.available_for_nursery) labels.push('Nursery/KG');
    if (subject.available_for_primary) labels.push('Primary');
    if (subject.available_for_jss) labels.push('JSS');
    if (subject.available_for_sss) labels.push('SSS');
    return labels.length > 0 ? labels.join(', ') : 'Not specified';
  };

  const filteredSubjects = subjects.filter(subject => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      (subject.name && subject.name.toLowerCase().includes(searchString)) ||
      (subject.code && subject.code.toLowerCase().includes(searchString)) ||
      (subject.short_name && subject.short_name.toLowerCase().includes(searchString)) ||
      (subject.subject_type && subject.subject_type.toLowerCase().includes(searchString));
    
    const matchesFilter = filterType === 'all' || subject.subject_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: subjects.length,
    active: subjects.filter(s => s.is_active).length,
    core: subjects.filter(s => s.subject_type === 'core').length,
    compulsory: subjects.filter(s => s.is_compulsory).length,
    avgCaWeight: subjects.length > 0 
      ? Math.round(subjects.reduce((sum, s) => sum + (s.ca_weight || 0), 0) / subjects.length)
      : 0,
    avgPassMark: subjects.length > 0
      ? Math.round(subjects.reduce((sum, s) => sum + (s.pass_mark || 0), 0) / subjects.length)
      : 0
  };

  if (loading) {
    return (
      <DashboardLayout title="Subjects">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Loading subjects...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    {
      title: 'Total Subjects',
      value: stats.total,
      icon: Book,
      color: 'bg-gray-50',
      iconColor: 'text-gray-700',
      detail: 'Academic subjects'
    },
    {
      title: 'Core Subjects',
      value: stats.core,
      icon: CheckCircle,
      color: 'bg-gray-50',
      iconColor: 'text-gray-700',
      detail: 'Mandatory subjects'
    },
    {
      title: 'Avg CA Weight',
      value: `${stats.avgCaWeight}%`,
      icon: Percent,
      color: 'bg-gray-50',
      iconColor: 'text-gray-700',
      detail: 'Average continuous assessment'
    },
    {
      title: 'Avg Pass Mark',
      value: stats.avgPassMark,
      icon: Award,
      color: 'bg-gray-50',
      iconColor: 'text-gray-700',
      detail: 'Average passing score'
    }
  ];

  return (
    <DashboardLayout title="Subjects">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button
              onClick={fetchSubjects}
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
              Add Subject
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
                  placeholder="Search subjects by name, code, or type..."
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
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
                  <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                  {stat.detail && (
                    <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subjects Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Stream
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
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
                {filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Book className="h-12 w-12 text-gray-400 mb-3" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No subjects found</h3>
                        <p className="text-sm text-gray-500">Get started by creating a new subject.</p>
                        <Button
                          onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                          }}
                          variant="primary"
                          className="mt-4"
                        >
                          <Plus size={18} className="mr-2" />
                          Add Subject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                            <Book size={18} className="text-gray-700" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{subject.name || 'Unnamed Subject'}</div>
                            <div className="text-sm text-gray-500">
                              {subject.code || 'No Code'} {subject.short_name && `• ${subject.short_name}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            {getSubjectIcon(subject.subject_type)}
                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded border ${getSubjectColor(subject.subject_type)}`}>
                              {subject.subject_type || 'Unknown'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Stream: {subject.stream || 'General'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Percent size={16} className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-900">
                              CA: {subject.ca_weight || 0}%
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Award size={16} className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-900">
                              Pass: {subject.pass_mark || 0}/{subject.total_marks || 100}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {getAvailabilityLabels(subject)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${
                            subject.is_active 
                              ? 'text-green-700 bg-green-50 border-green-200' 
                              : 'text-gray-700 bg-gray-50 border-gray-200'
                          }`}>
                            {subject.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <div className="flex items-center">
                            {subject.is_compulsory ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <CheckCircle size={12} className="mr-1" />
                                Compulsory
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <XCircle size={12} className="mr-1" />
                                Elective
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(subject)}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(subject)}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                            title="Edit subject"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(subject)}
                            className="text-gray-600 hover:text-red-700 flex items-center"
                            title="Delete subject"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredSubjects.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{filteredSubjects.length}</span> of{' '}
                  <span className="font-medium">{subjects.length}</span> subjects
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
        title={editingSubject ? 'Edit Subject' : 'Create Subject'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Subject Name *"
                placeholder="e.g., Mathematics"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              
              <Input
                label="Subject Code *"
                placeholder="e.g., MAT"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                required
              />
            </div>
            
            <Input
              label="Short Name"
              placeholder="e.g., Maths"
              value={formData.short_name}
              onChange={(e) => setFormData({...formData, short_name: e.target.value})}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Subject Type *"
                value={formData.subject_type}
                onChange={(e) => setFormData({...formData, subject_type: e.target.value})}
                options={subjectTypeOptions}
                required
              />
              
              <Select
                label="Stream *"
                value={formData.stream}
                onChange={(e) => setFormData({...formData, stream: e.target.value})}
                options={streamOptions}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CA Weight (%) *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.ca_weight}
                    onChange={(e) => setFormData({...formData, ca_weight: parseInt(e.target.value) || 0})}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium">{formData.ca_weight}%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Weight (%) *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.exam_weight}
                    onChange={(e) => setFormData({...formData, exam_weight: parseInt(e.target.value) || 0})}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium">{formData.exam_weight}%</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Total Marks"
                value={formData.total_marks}
                onChange={(e) => setFormData({...formData, total_marks: parseInt(e.target.value) || 0})}
                min="0"
                max="200"
              />
              
              <Input
                type="number"
                label="Pass Mark"
                value={formData.pass_mark}
                onChange={(e) => setFormData({...formData, pass_mark: parseInt(e.target.value) || 0})}
                min="0"
                max="100"
              />
            </div>
            
            {/* Availability Checkboxes */}
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Available For:</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.available_for_creche}
                    onChange={(e) => setFormData({...formData, available_for_creche: e.target.checked})}
                    className="h-4 w-4 text-gray-700 rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Creche</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.available_for_nursery}
                    onChange={(e) => setFormData({...formData, available_for_nursery: e.target.checked})}
                    className="h-4 w-4 text-gray-700 rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Nursery/KG</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.available_for_primary}
                    onChange={(e) => setFormData({...formData, available_for_primary: e.target.checked})}
                    className="h-4 w-4 text-gray-700 rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Primary</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.available_for_jss}
                    onChange={(e) => setFormData({...formData, available_for_jss: e.target.checked})}
                    className="h-4 w-4 text-gray-700 rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">JSS</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.available_for_sss}
                    onChange={(e) => setFormData({...formData, available_for_sss: e.target.checked})}
                    className="h-4 w-4 text-gray-700 rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">SSS</span>
                </label>
              </div>
            </div>
            
            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_compulsory}
                  onChange={(e) => setFormData({...formData, is_compulsory: e.target.checked})}
                  className="h-4 w-4 text-gray-700 rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Compulsory Subject</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_examinable}
                  onChange={(e) => setFormData({...formData, is_examinable: e.target.checked})}
                  className="h-4 w-4 text-gray-700 rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Examinable</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.has_practical}
                  onChange={(e) => setFormData({...formData, has_practical: e.target.checked})}
                  className="h-4 w-4 text-gray-700 rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Has Practical</span>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Subject description..."
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="h-4 w-4 text-gray-700 rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Subject is active
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
              {editingSubject ? 'Update Subject' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSubject(null);
        }}
        title="Subject Details"
        size="md"
      >
        {selectedSubject && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <Book size={20} className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{selectedSubject.name || 'Unnamed Subject'}</h4>
                  <p className="text-sm text-gray-600">
                    {selectedSubject.code || 'No Code'} 
                    {selectedSubject.short_name && ` • ${selectedSubject.short_name}`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Subject Type</p>
                  <div className="flex items-center mt-1">
                    {getSubjectIcon(selectedSubject.subject_type)}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {selectedSubject.subject_type || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stream</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedSubject.stream || 'General'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">CA Weight</p>
                  <div className="flex items-center mt-1">
                    <Percent size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedSubject.ca_weight || 0}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Exam Weight</p>
                  <div className="flex items-center mt-1">
                    <Award size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedSubject.exam_weight || 0}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Marks</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedSubject.total_marks || 100}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pass Mark</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedSubject.pass_mark || 40}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Available For</p>
                <p className="text-sm text-gray-900 mt-1">
                  {getAvailabilityLabels(selectedSubject)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Compulsory</p>
                <div className="flex items-center mt-1 space-x-2">
                  {selectedSubject.is_compulsory ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <CheckCircle size={12} className="mr-1" />
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <XCircle size={12} className="mr-1" />
                      No
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${
                    selectedSubject.is_active 
                      ? 'text-green-700 bg-green-50 border-green-200' 
                      : 'text-gray-700 bg-gray-50 border-gray-200'
                  }`}>
                    {selectedSubject.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              {selectedSubject.description && (
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-2 rounded">
                    {selectedSubject.description}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedSubject(null);
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
          setSubjectToDelete(null);
        }}
        title="Confirm Delete"
        size="sm"
      >
        {subjectToDelete && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Subject</h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete "<span className="font-medium">{subjectToDelete.name || 'Unnamed Subject'}</span>"? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <Book size={16} className="text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {subjectToDelete.code || 'No Code'}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <Percent size={16} className="text-gray-500 mr-2" />
                <p className="text-sm text-gray-600">
                  CA Weight: {subjectToDelete.ca_weight || 0}%
                </p>
              </div>
              <div className="flex items-center">
                <Award size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">
                  Pass Mark: {subjectToDelete.pass_mark || 0}/{subjectToDelete.total_marks || 100}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSubjectToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="danger"
                onClick={handleDelete}
              >
                Delete Subject
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default Subjects;