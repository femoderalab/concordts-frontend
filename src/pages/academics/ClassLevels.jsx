import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
  Hash,
  Users,
  CheckCircle,
  AlertCircle,
  School,
  BookOpen,
  GraduationCap,
  Baby
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { 
  getClassLevels, 
  createClassLevel, 
  updateClassLevel, 
  deleteClassLevel,
  getPrograms
} from '../../services/academicService';
import { handleApiError } from '../../services/api';

const ClassLevels = () => {
  const { user, isAdmin } = useAuth();
  const [classLevels, setClassLevels] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingClassLevel, setEditingClassLevel] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [levelToDelete, setLevelToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    program: '',
    level: 'primary_1',
    name: '',
    code: '',
    order: 1,
    min_age: 5,
    max_age: 6,
    is_active: true
  });

  const levelOptions = [
    // Creche
    { value: 'creche', label: 'Creche' },
    // Nursery
    { value: 'nursery_1', label: 'Nursery 1' },
    { value: 'nursery_2', label: 'Nursery 2' },
    { value: 'kg_1', label: 'Kindergarten 1 (KG 1)' },
    { value: 'kg_2', label: 'Kindergarten 2 (KG 2)' },
    // Primary
    { value: 'primary_1', label: 'Primary 1 (Basic 1)' },
    { value: 'primary_2', label: 'Primary 2 (Basic 2)' },
    { value: 'primary_3', label: 'Primary 3 (Basic 3)' },
    { value: 'primary_4', label: 'Primary 4 (Basic 4)' },
    { value: 'primary_5', label: 'Primary 5 (Basic 5)' },
    { value: 'primary_6', label: 'Primary 6 (Basic 6)' },
    // Junior Secondary
    { value: 'jss_1', label: 'JSS 1 (Basic 7)' },
    { value: 'jss_2', label: 'JSS 2 (Basic 8)' },
    { value: 'jss_3', label: 'JSS 3 (Basic 9)' },
    // Senior Secondary
    { value: 'sss_1', label: 'SSS 1' },
    { value: 'sss_2', label: 'SSS 2' },
    { value: 'sss_3', label: 'SSS 3' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'creche', label: 'Creche' },
    { value: 'nursery', label: 'Nursery' },
    { value: 'primary', label: 'Primary' },
    { value: 'jss', label: 'JSS' },
    { value: 'sss', label: 'SSS' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [levelsData, programsData] = await Promise.all([
        getClassLevels(),
        getPrograms()
      ]);
      
      setClassLevels(levelsData.results || levelsData || []);
      setPrograms(programsData.results || programsData || []);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const checkDuplicateLevel = (programId, level, excludeId = null) => {
    return classLevels.some(cl => 
      cl.id !== excludeId && 
      (cl.program?.id === programId || cl.program === programId) && 
      cl.level === level
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (!editingClassLevel && checkDuplicateLevel(parseInt(formData.program), formData.level)) {
        setError('This class level already exists for the selected program. Each program can only have one instance of each level.');
        return;
      }
      
      if (editingClassLevel) {
        await updateClassLevel(editingClassLevel.id, formData);
        setSuccess('Class level updated successfully');
      } else {
        await createClassLevel(formData);
        setSuccess('Class level created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = handleApiError(err);
      if (errorMsg.includes('unique set') || errorMsg.includes('already exists')) {
        setError('This class level already exists for the selected program. Each program can only have one instance of each level.');
      } else {
        setError(errorMsg);
      }
    }
  };

  const handleEdit = (classLevel) => {
    setEditingClassLevel(classLevel);
    setFormData({
      program: classLevel.program?.id || classLevel.program || '',
      level: classLevel.level || 'primary_1',
      name: classLevel.name || '',
      code: classLevel.code || '',
      order: classLevel.order || 1,
      min_age: classLevel.min_age || 5,
      max_age: classLevel.max_age || 6,
      is_active: classLevel.is_active !== undefined ? classLevel.is_active : true
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (classLevel) => {
    setLevelToDelete(classLevel);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteClassLevel(levelToDelete.id);
      setSuccess('Class level deleted successfully');
      fetchData();
      setIsDeleteModalOpen(false);
      setLevelToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
      setIsDeleteModalOpen(false);
    }
  };

  const handleView = (classLevel) => {
    setSelectedLevel(classLevel);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      program: '',
      level: 'primary_1',
      name: '',
      code: '',
      order: 1,
      min_age: 5,
      max_age: 6,
      is_active: true
    });
    setEditingClassLevel(null);
    setError('');
  };

  const getLevelCategory = (level) => {
    if (!level) return 'other';
    if (level === 'creche') return 'creche';
    if (['nursery_1', 'nursery_2', 'kg_1', 'kg_2'].includes(level)) return 'nursery';
    if (level.startsWith('primary')) return 'primary';
    if (level.startsWith('jss')) return 'jss';
    if (level.startsWith('sss')) return 'sss';
    return 'other';
  };

  const getLevelLabel = (level) => {
    const option = levelOptions.find(opt => opt.value === level);
    return option?.label || level || '-';
  };

  const getLevelIcon = (level) => {
    if (level === 'creche') return <Baby size={16} className="text-gray-600" />;
    if (['nursery_1', 'nursery_2', 'kg_1', 'kg_2'].includes(level)) return <Baby size={16} className="text-gray-600" />;
    if (level.startsWith('primary')) return <School size={16} className="text-gray-600" />;
    if (level.startsWith('jss')) return <BookOpen size={16} className="text-gray-600" />;
    if (level.startsWith('sss')) return <GraduationCap size={16} className="text-gray-600" />;
    return <Layers size={16} className="text-gray-600" />;
  };

  const getLevelColor = (level) => {
    return 'text-gray-700 bg-gray-50 border-gray-200';
  };

  const filteredClassLevels = classLevels.filter(level => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      (level.name && level.name.toLowerCase().includes(searchString)) ||
      (level.code && level.code.toLowerCase().includes(searchString)) ||
      (level.level && level.level.toLowerCase().includes(searchString)) ||
      (level.program?.name && level.program.name.toLowerCase().includes(searchString));
    
    const matchesFilter = filterCategory === 'all' || getLevelCategory(level.level) === filterCategory;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: classLevels.length,
    active: classLevels.filter(l => l.is_active).length,
    primary: classLevels.filter(l => l.level?.startsWith('primary')).length,
    avgMinAge: classLevels.length > 0 
      ? Math.round((classLevels.reduce((sum, l) => sum + (l.min_age || 0), 0) / classLevels.length))
      : 0
  };

  if (loading) {
    return (
      <DashboardLayout title="Class Levels">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Loading class levels...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    {
      title: 'Total Levels',
      value: stats.total,
      icon: Layers,
      color: 'bg-gray-50',
      iconColor: 'text-gray-700',
      detail: 'Class levels'
    },
    {
      title: 'Active Levels',
      value: stats.active,
      icon: CheckCircle,
      color: 'bg-gray-50',
      iconColor: 'text-green-600',
      detail: 'Currently active'
    },
    {
      title: 'Primary Levels',
      value: stats.primary,
      icon: School,
      color: 'bg-gray-50',
      iconColor: 'text-gray-700',
      detail: 'Primary school levels'
    },
    {
      title: 'Avg Start Age',
      value: `${stats.avgMinAge} yrs`,
      icon: Users,
      color: 'bg-gray-50',
      iconColor: 'text-gray-700',
      detail: 'Average starting age'
    }
  ];

  return (
    <DashboardLayout title="Class Levels">
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
              Add Class Level
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
                  placeholder="Search class levels by name or code..."
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
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
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

        {/* Class Levels Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Level Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age Range
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClassLevels.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Layers className="h-12 w-12 text-gray-400 mb-3" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No class levels found</h3>
                        <p className="text-sm text-gray-500">Get started by creating a new class level.</p>
                        <Button
                          onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                          }}
                          variant="primary"
                          className="mt-4"
                        >
                          <Plus size={18} className="mr-2" />
                          Add Class Level
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredClassLevels.map((level) => (
                    <tr key={level.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                            <Layers size={18} className="text-gray-700" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{level.name || 'Unnamed Level'}</div>
                            <div className="text-sm text-gray-500">{level.code || 'No Code'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getLevelIcon(level.level)}
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded border ${getLevelColor(level.level)}`}>
                            {getLevelLabel(level.level)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {level.program?.name || 'No Program'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Users size={16} className="text-gray-500 mr-2" />
                          <span className="text-sm text-gray-900">
                            {level.min_age || 0}-{level.max_age || 0} years
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Hash size={16} className="text-gray-500 mr-2" />
                          <span className="text-sm text-gray-900">{level.order || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(level)}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => handleEdit(level)}
                                className="text-gray-600 hover:text-gray-900 flex items-center"
                                title="Edit class level"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(level)}
                                className="text-gray-600 hover:text-red-700 flex items-center"
                                title="Delete class level"
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
          
          {filteredClassLevels.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{filteredClassLevels.length}</span> of{' '}
                  <span className="font-medium">{classLevels.length}</span> levels
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
        title={editingClassLevel ? 'Edit Class Level' : 'Create Class Level'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Validation Warning */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start">
              <AlertCircle size={18} className="text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-800">
                Each program can only have one instance of each level. For example, you cannot create two "Primary 1" levels under the same program.
              </p>
            </div>

            <Select
              label="Program *"
              value={formData.program}
              onChange={(e) => setFormData({...formData, program: e.target.value})}
              options={[
                { value: '', label: 'Select program' }, 
                ...programs.map(p => ({ 
                  value: p.id, 
                  label: p.name 
                }))
              ]}
              required
            />
            
            <Select
              label="Level *"
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
              options={levelOptions}
              required
            />
            
            <Input
              label="Class Level Name *"
              placeholder="e.g., Primary 1"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <div>
              <Input
                label="Class Code *"
                placeholder="e.g., PRI1"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Unique code for this class level
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="number"
                label="Order"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                min="0"
              />
              
              <Input
                type="number"
                label="Minimum Age"
                value={formData.min_age}
                onChange={(e) => setFormData({...formData, min_age: parseInt(e.target.value) || 0})}
                min="0"
              />
              
              <Input
                type="number"
                label="Maximum Age"
                value={formData.max_age}
                onChange={(e) => setFormData({...formData, max_age: parseInt(e.target.value) || 0})}
                min="0"
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
                  Class level is active
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
              {editingClassLevel ? 'Update Class Level' : 'Create Class Level'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedLevel(null);
        }}
        title="Class Level Details"
        size="md"
      >
        {selectedLevel && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <Layers size={20} className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{selectedLevel.name || 'Unnamed Level'}</h4>
                  <p className="text-sm text-gray-600">{selectedLevel.code || 'No Code'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Level</p>
                  <div className="flex items-center mt-1">
                    {getLevelIcon(selectedLevel.level)}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {getLevelLabel(selectedLevel.level)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedLevel.program?.name || 'No Program'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order</p>
                  <div className="flex items-center mt-1">
                    <Hash size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedLevel.order || 0}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age Range</p>
                  <div className="flex items-center mt-1">
                    <Users size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedLevel.min_age || 0}-{selectedLevel.max_age || 0} years
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded border ${
                  selectedLevel.is_active 
                    ? 'text-green-700 bg-green-50 border-green-200' 
                    : 'text-gray-700 bg-gray-50 border-gray-200'
                }`}>
                  {selectedLevel.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedLevel(null);
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
          setLevelToDelete(null);
        }}
        title="Confirm Delete"
        size="sm"
      >
        {levelToDelete && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Class Level</h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete "<span className="font-medium">{levelToDelete.name || 'Unnamed Level'}</span>"? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                {getLevelIcon(levelToDelete.level)}
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {getLevelLabel(levelToDelete.level)}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <School size={16} className="text-gray-500 mr-2" />
                <p className="text-sm text-gray-600">
                  {levelToDelete.program?.name || 'No Program'}
                </p>
              </div>
              <div className="flex items-center">
                <Users size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">
                  {levelToDelete.min_age || 0}-{levelToDelete.max_age || 0} years
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setLevelToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="danger"
                onClick={handleDelete}
              >
                Delete Level
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default ClassLevels;