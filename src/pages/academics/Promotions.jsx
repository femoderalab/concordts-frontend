// school-management-frontend/src/pages/academics/Promotions.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import DataTable from '../../components/common/DataTable';
import { 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw,
  Search,
  Filter,
  Calendar,
  School,
  Users,
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getClasses,
  getAcademicSessions,
  getAcademicTerms
} from '../../services/academicService';
import { handleApiError } from '../../services/api';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    from_session: '',
    to_session: '',
    from_term: '',
    to_term: '',
    from_class: '',
    to_class: '',
    promotion_date: '',
    is_bulk: true,
    status: 'pending',
    is_active: true
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [promotionsData, classesData, sessionsData, termsData] = await Promise.all([
        getPromotions(),
        getClasses(),
        getAcademicSessions(),
        getAcademicTerms()
      ]);
      
      setPromotions(promotionsData.results || promotionsData || []);
      setClasses(classesData.results || classesData || []);
      setSessions(sessionsData.results || sessionsData || []);
      setTerms(termsData.results || termsData || []);
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
      
      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, formData);
        setSuccess('Promotion updated successfully!');
      } else {
        await createPromotion(formData);
        setSuccess('Promotion created successfully!');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      name: promotion.name || '',
      description: promotion.description || '',
      from_session: promotion.from_session?.id || promotion.from_session || '',
      to_session: promotion.to_session?.id || promotion.to_session || '',
      from_term: promotion.from_term?.id || promotion.from_term || '',
      to_term: promotion.to_term?.id || promotion.to_term || '',
      from_class: promotion.from_class?.id || promotion.from_class || '',
      to_class: promotion.to_class?.id || promotion.to_class || '',
      promotion_date: promotion.promotion_date || '',
      is_bulk: promotion.is_bulk || true,
      status: promotion.status || 'pending',
      is_active: promotion.is_active || true
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (promotion) => {
    if (!window.confirm(`Are you sure you want to delete "${promotion.name}"?`)) {
      return;
    }

    try {
      await deletePromotion(promotion.id);
      setSuccess('Promotion deleted successfully!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleView = (promotion) => {
    const details = `
Promotion Details:

Name: ${promotion.name || 'N/A'}
Description: ${promotion.description || 'N/A'}

From Session: ${promotion.from_session?.name || promotion.from_session_name || 'N/A'}
To Session: ${promotion.to_session?.name || promotion.to_session_name || 'N/A'}
From Term: ${promotion.from_term?.name || promotion.from_term_name || 'N/A'}
To Term: ${promotion.to_term?.name || promotion.to_term_name || 'N/A'}

From Class: ${promotion.from_class?.name || promotion.from_class_name || 'N/A'}
To Class: ${promotion.to_class?.name || promotion.to_class_name || 'N/A'}

Promotion Date: ${promotion.promotion_date || 'N/A'}
Type: ${promotion.is_bulk ? 'Bulk Promotion' : 'Individual'}
Status: ${promotion.status || 'N/A'}
Active: ${promotion.is_active ? 'Yes' : 'No'}

Students Promoted: ${promotion.students_promoted || 0}
Students Failed: ${promotion.students_failed || 0}
    `;
    
    alert(details);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      from_session: '',
      to_session: '',
      from_term: '',
      to_term: '',
      from_class: '',
      to_class: '',
      promotion_date: '',
      is_bulk: true,
      status: 'pending',
      is_active: true
    });
    setEditingPromotion(null);
  };

  const filteredPromotions = promotions.filter(promotion => {
    const searchString = searchTerm.toLowerCase();
    const name = promotion.name || '';
    const status = promotion.status || '';
    
    return (
      name.toLowerCase().includes(searchString) ||
      status.toLowerCase().includes(searchString)
    );
  });

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    { 
      header: 'Promotion Name', 
      accessor: 'name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value || 'Unnamed Promotion'}</div>
          <div className="text-xs text-gray-500">
            {row.is_bulk ? 'Bulk Promotion' : 'Individual'}
          </div>
        </div>
      )
    },
    { 
      header: 'Promotion Path', 
      accessor: 'promotion_path',
      render: (_, row) => (
        <div className="text-sm">
          <div className="flex items-center">
            <span className="text-gray-700">{row.from_class?.name || row.from_class_name || 'N/A'}</span>
            <ArrowRight size={12} className="mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">{row.to_class?.name || row.to_class_name || 'N/A'}</span>
          </div>
          <div className="text-xs text-gray-500">
            {row.from_session?.name || row.from_session_name || ''} → {row.to_session?.name || row.to_session_name || ''}
          </div>
        </div>
      )
    },
    { 
      header: 'Date', 
      accessor: 'promotion_date',
      render: (value) => (
        <div className="flex items-center">
          <Calendar size={14} className="mr-1 text-gray-500" />
          <span>{value ? new Date(value).toLocaleDateString() : '-'}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value) => {
        const displayText = value ? 
          value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 
          'Unknown';
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
            {displayText}
          </span>
        );
      }
    },
    { 
      header: 'Students', 
      accessor: 'students',
      render: (_, row) => (
        <div className="text-xs">
          <div className="flex items-center">
            <CheckCircle size={12} className="mr-1 text-green-500" />
            <span>Promoted: {row.students_promoted || 0}</span>
          </div>
          <div className="flex items-center">
            <XCircle size={12} className="mr-1 text-red-500" />
            <span>Failed: {row.students_failed || 0}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Active', 
      accessor: 'is_active',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Edit Promotion"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete Promotion"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout title="Promotions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Promotions</h1>
            <p className="text-gray-600">Manage student promotions between classes and sessions</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button
              onClick={fetchData}
              variant="outline"
              className="flex items-center"
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
              Add Promotion
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
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search promotions by name or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm text-gray-600">Filter:</span>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Promotions</p>
                <p className="text-xl font-bold text-gray-800">{promotions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-800">
                  {promotions.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Students Promoted</p>
                <p className="text-xl font-bold text-gray-800">
                  {promotions.reduce((sum, p) => sum + (p.students_promoted || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <School className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-gray-800">
                  {promotions.filter(p => p.is_active).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Promotions Table */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredPromotions}
            loading={loading}
            emptyMessage="No promotions found. Click 'Add Promotion' to create one."
          />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
        size="xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Promotion Name *"
              placeholder="e.g., End of Year Promotion 2024"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Promotion description..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="From Session *"
                value={formData.from_session}
                onChange={(e) => setFormData({...formData, from_session: e.target.value})}
                options={[{ value: '', label: 'Select session' }, ...sessions.map(s => ({ 
                  value: s.id, 
                  label: s.name 
                }))]}
                required
              />
              
              <Select
                label="To Session *"
                value={formData.to_session}
                onChange={(e) => setFormData({...formData, to_session: e.target.value})}
                options={[{ value: '', label: 'Select session' }, ...sessions.map(s => ({ 
                  value: s.id, 
                  label: s.name 
                }))]}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="From Term *"
                value={formData.from_term}
                onChange={(e) => setFormData({...formData, from_term: e.target.value})}
                options={[{ value: '', label: 'Select term' }, ...terms.map(t => ({ 
                  value: t.id, 
                  label: t.name 
                }))]}
                required
              />
              
              <Select
                label="To Term *"
                value={formData.to_term}
                onChange={(e) => setFormData({...formData, to_term: e.target.value})}
                options={[{ value: '', label: 'Select term' }, ...terms.map(t => ({ 
                  value: t.id, 
                  label: t.name 
                }))]}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="From Class *"
                value={formData.from_class}
                onChange={(e) => setFormData({...formData, from_class: e.target.value})}
                options={[{ value: '', label: 'Select class' }, ...classes.map(c => ({ 
                  value: c.id, 
                  label: c.name 
                }))]}
                required
              />
              
              <Select
                label="To Class *"
                value={formData.to_class}
                onChange={(e) => setFormData({...formData, to_class: e.target.value})}
                options={[{ value: '', label: 'Select class' }, ...classes.map(c => ({ 
                  value: c.id, 
                  label: c.name 
                }))]}
                required
              />
            </div>
            
            <Input
              type="date"
              label="Promotion Date *"
              value={formData.promotion_date}
              onChange={(e) => setFormData({...formData, promotion_date: e.target.value})}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_bulk}
                    onChange={(e) => setFormData({...formData, is_bulk: e.target.checked})}
                    className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Bulk promotion
                  </span>
                </label>
              </div>
              
              <Select
                label="Status *"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                options={statusOptions}
                required
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Promotion is active
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
              {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Promotions;