import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/modal';
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
  ChevronRight,
  Clock,
  Hash,
  CheckCircle,
  BookOpen,
  Baby,
  GraduationCap
} from 'lucide-react';
import { 
  getPrograms, 
  createProgram, 
  updateProgram, 
  deleteProgram 
} from '../../services/academicService';
import { handleApiError } from '../../services/api';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    program_type: 'primary',
    code: '',
    description: '',
    duration_years: 6,
    is_active: true
  });

  const programTypeOptions = [
    { value: 'creche', label: 'Creche' },
    { value: 'nursery', label: 'Nursery' },
    { value: 'primary', label: 'Primary School' },
    { value: 'junior_secondary', label: 'Junior Secondary School (JSS)' },
    { value: 'senior_secondary', label: 'Senior Secondary School (SSS)' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'creche', label: 'Creche' },
    { value: 'nursery', label: 'Nursery' },
    { value: 'primary', label: 'Primary' },
    { value: 'junior_secondary', label: 'JSS' },
    { value: 'senior_secondary', label: 'SSS' }
  ];

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await getPrograms();
      setPrograms(response.results || response || []);
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
      
      if (editingProgram) {
        await updateProgram(editingProgram.id, formData);
        setSuccess('Program updated successfully');
      } else {
        await createProgram(formData);
        setSuccess('Program created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchPrograms();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name || '',
      program_type: program.program_type || 'primary',
      code: program.code || '',
      description: program.description || '',
      duration_years: program.duration_years || 6,
      is_active: program.is_active || true
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (program) => {
    setProgramToDelete(program);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProgram(programToDelete.id);
      setSuccess('Program deleted successfully');
      fetchPrograms();
      setIsDeleteModalOpen(false);
      setProgramToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
      setIsDeleteModalOpen(false);
    }
  };

  const handleView = (program) => {
    setSelectedProgram(program);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      program_type: 'primary',
      code: '',
      description: '',
      duration_years: 6,
      is_active: true
    });
    setEditingProgram(null);
  };

  const getProgramTypeLabel = (type) => {
    const typeMap = {
      'creche': 'Creche',
      'nursery': 'Nursery',
      'primary': 'Primary School',
      'junior_secondary': 'Junior Secondary (JSS)',
      'senior_secondary': 'Senior Secondary (SSS)'
    };
    return typeMap[type] || type;
  };

  const getProgramIcon = (type) => {
    switch (type) {
      case 'creche':
        return <Baby size={16} className="text-gray-600" />;
      case 'nursery':
        return <Baby size={16} className="text-gray-600" />;
      case 'primary':
        return <School size={16} className="text-gray-600" />;
      case 'junior_secondary':
        return <GraduationCap size={16} className="text-gray-600" />;
      case 'senior_secondary':
        return <GraduationCap size={16} className="text-gray-600" />;
      default:
        return <School size={16} className="text-gray-600" />;
    }
  };

  const getProgramColor = (type) => {
    switch (type) {
      case 'creche':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'nursery':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'primary':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'junior_secondary':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'senior_secondary':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const filteredPrograms = programs.filter(program => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (
      (program.name && program.name.toLowerCase().includes(searchString)) ||
      (program.code && program.code.toLowerCase().includes(searchString)) ||
      (program.program_type && program.program_type.toLowerCase().includes(searchString))
    );
    
    const matchesFilter = filterType === 'all' || program.program_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: programs.length,
    active: programs.filter(p => p.is_active).length,
    primary: programs.filter(p => p.program_type === 'primary').length,
    avgDuration: programs.length > 0 
      ? (programs.reduce((sum, p) => sum + (p.duration_years || 0), 0) / programs.length).toFixed(1)
      : '0.0'
  };

  if (loading) {
    return (
      <DashboardLayout title="Academic Programs">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Loading academic programs...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    {
      title: 'Total Programs',
      value: stats.total,
      icon: School,
      color: 'bg-gray-50',
      iconColor: 'text-gray-700',
      detail: 'Academic programs'
    },
    {
      title: 'Active Programs',
      value: stats.active,
      icon: CheckCircle,
      color: 'bg-gray-50',
      iconColor: 'text-green-600',
      detail: 'Currently active'
    },
    {
      title: 'Primary Programs',
      value: stats.primary,
      icon: School,
      color: 'bg-gray-50',
      iconColor: 'text-gray-700',
      detail: 'Primary level'
    },
    {
      title: 'Avg Duration',
      value: `${stats.avgDuration} yrs`,
      icon: Clock,
      color: 'bg-gray-50',
      iconColor: 'text-gray-700',
      detail: 'Average program length'
    }
  ];

  return (
    <DashboardLayout title="Academic Programs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button
              onClick={fetchPrograms}
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
              Add Program
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
                  placeholder="Search programs by name or code..."
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

        {/* Programs Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
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
                {filteredPrograms.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <School className="h-12 w-12 text-gray-400 mb-3" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No programs found</h3>
                        <p className="text-sm text-gray-500">Get started by creating a new academic program.</p>
                        <Button
                          onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                          }}
                          variant="primary"
                          className="mt-4"
                        >
                          <Plus size={18} className="mr-2" />
                          Add Program
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPrograms.map((program) => (
                    <tr key={program.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                            <School size={18} className="text-gray-700" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{program.name}</div>
                            <div className="text-sm text-gray-500">{program.code}</div>
                            {program.description && (
                              <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                {program.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getProgramIcon(program.program_type)}
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded border ${getProgramColor(program.program_type)}`}>
                            {getProgramTypeLabel(program.program_type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Clock size={16} className="text-gray-500 mr-2" />
                          <span className="text-sm text-gray-900">{program.duration_years} years</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${
                          program.is_active 
                            ? 'text-green-700 bg-green-50 border-green-200' 
                            : 'text-gray-700 bg-gray-50 border-gray-200'
                        }`}>
                          {program.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(program)}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(program)}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                            title="Edit program"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(program)}
                            className="text-gray-600 hover:text-red-700 flex items-center"
                            title="Delete program"
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
          
          {filteredPrograms.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{filteredPrograms.length}</span> of{' '}
                  <span className="font-medium">{programs.length}</span> programs
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
        title={editingProgram ? 'Edit Academic Program' : 'Create Academic Program'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Program Name *"
                placeholder="e.g., Primary School Program"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              
              <Input
                label="Program Code *"
                placeholder="e.g., PRI"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                required
              />
            </div>
            
            <Select
              label="Program Type *"
              value={formData.program_type}
              onChange={(e) => setFormData({...formData, program_type: e.target.value})}
              options={programTypeOptions}
              required
            />
            
            <Input
              type="number"
              label="Duration (Years) *"
              value={formData.duration_years}
              onChange={(e) => setFormData({...formData, duration_years: parseInt(e.target.value) || 0})}
              min="0"
              max="12"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Program description..."
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
                  Program is active
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
              {editingProgram ? 'Update Program' : 'Create Program'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedProgram(null);
        }}
        title="Program Details"
        size="md"
      >
        {selectedProgram && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <School size={20} className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{selectedProgram.name}</h4>
                  <p className="text-sm text-gray-600">{selectedProgram.code}</p>
                </div>
              </div>
              {selectedProgram.description && (
                <p className="text-sm text-gray-600 mt-2">{selectedProgram.description}</p>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Program Type</p>
                  <div className="flex items-center mt-1">
                    {getProgramIcon(selectedProgram.program_type)}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {getProgramTypeLabel(selectedProgram.program_type)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <div className="flex items-center mt-1">
                    <Clock size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedProgram.duration_years} years
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded border ${
                  selectedProgram.is_active 
                    ? 'text-green-700 bg-green-50 border-green-200' 
                    : 'text-gray-700 bg-gray-50 border-gray-200'
                }`}>
                  {selectedProgram.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedProgram(null);
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
          setProgramToDelete(null);
        }}
        title="Confirm Delete"
        size="sm"
      >
        {programToDelete && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Academic Program</h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete "<span className="font-medium">{programToDelete.name}</span>"? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <School size={16} className="text-gray-500 mr-2" />
                <p className="text-sm font-medium text-gray-900">{programToDelete.code}</p>
              </div>
              <div className="flex items-center mb-2">
                {getProgramIcon(programToDelete.program_type)}
                <span className="ml-2 text-sm text-gray-600">
                  {getProgramTypeLabel(programToDelete.program_type)}
                </span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">
                  {programToDelete.duration_years} years
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProgramToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="danger"
                onClick={handleDelete}
              >
                Delete Program
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default Programs;