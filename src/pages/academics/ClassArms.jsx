// school-management-frontend/src/pages/academics/ClassArms.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import DataTable from '../../components/common/DataTable';
import { 
  Users2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw,
  Search,
  Filter,
  School,
  Hash,
  Building
} from 'lucide-react';
import { 
  getClassArms,
  createClassArm,
  updateClassArm,
  deleteClassArm,
  getClasses,
  getClassLevels
} from '../../services/academicService';
import { handleApiError } from '../../services/api';

const ClassArms = () => {
  const [classArms, setClassArms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classLevels, setClassLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArm, setEditingArm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    class_level: '',
    parent_class: '',
    description: '',
    capacity: 40,
    room_number: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch class arms, but handle 404 gracefully
      let armsData = [];
      try {
        const armsResponse = await getClassArms();
        armsData = armsResponse.results || armsResponse || [];
      } catch (armError) {
        // If 404, it means the endpoint doesn't exist yet
        if (armError.response?.status === 404 || armError.message?.includes('not found')) {
          console.warn('Class Arms API endpoint not implemented yet');
          setError('⚠️ Class Arms feature is not yet implemented on the backend. The API endpoint /api/academic/class-arms/ needs to be created in your Django backend.');
        } else {
          throw armError;
        }
      }
      
      const [classesData, levelsData] = await Promise.all([
        getClasses(),
        getClassLevels()
      ]);
      
      setClassArms(armsData);
      setClasses(classesData.results || classesData || []);
      setClassLevels(levelsData.results || levelsData || []);
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
      
      if (editingArm) {
        await updateClassArm(editingArm.id, formData);
        setSuccess('Class arm updated successfully!');
      } else {
        await createClassArm(formData);
        setSuccess('Class arm created successfully!');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleEdit = (arm) => {
    setEditingArm(arm);
    setFormData({
      name: arm.name || '',
      code: arm.code || '',
      class_level: arm.class_level?.id || arm.class_level || '',
      parent_class: arm.parent_class?.id || arm.parent_class || '',
      description: arm.description || '',
      capacity: arm.capacity || 40,
      room_number: arm.room_number || '',
      is_active: arm.is_active !== undefined ? arm.is_active : true
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (arm) => {
    if (!window.confirm(`Are you sure you want to delete "${arm.name}"?`)) {
      return;
    }

    try {
      await deleteClassArm(arm.id);
      setSuccess('Class arm deleted successfully!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleView = (arm) => {
    const details = `Class Arm Details:

Name: ${arm.name || 'N/A'}
Code: ${arm.code || 'N/A'}
Class Level: ${arm.class_level?.name || arm.class_level_name || 'N/A'}
Parent Class: ${arm.parent_class?.name || arm.parent_class_name || 'N/A'}
Capacity: ${arm.capacity || 0} students
Room: ${arm.room_number || 'Not assigned'}
Status: ${arm.is_active ? 'Active' : 'Inactive'}

Description: ${arm.description || 'No description'}`;
    
    alert(details);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      class_level: '',
      parent_class: '',
      description: '',
      capacity: 40,
      room_number: '',
      is_active: true
    });
    setEditingArm(null);
  };

  const filteredArms = classArms.filter(arm => {
    const searchString = searchTerm.toLowerCase();
    const name = arm.name || '';
    const code = arm.code || '';
    const room = arm.room_number || '';
    
    return (
      name.toLowerCase().includes(searchString) ||
      code.toLowerCase().includes(searchString) ||
      room.toLowerCase().includes(searchString)
    );
  });

  const columns = [
    { 
      header: 'Class Arm', 
      accessor: 'name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value || 'Unnamed Arm'}</div>
          {row.code && <div className="text-xs text-gray-500">{row.code}</div>}
        </div>
      )
    },
    { 
      header: 'Class Level', 
      accessor: 'class_level',
      render: (value) => (
        <div className="text-sm text-gray-700">
          {value?.name || 'No Level'}
        </div>
      )
    },
    { 
      header: 'Parent Class', 
      accessor: 'parent_class',
      render: (value) => (
        <div className="text-sm text-gray-700">
          {value?.name || 'No Parent'}
        </div>
      )
    },
    { 
      header: 'Capacity', 
      accessor: 'capacity',
      render: (value) => (
        <div className="flex items-center">
          <Users2 size={14} className="mr-1 text-gray-500" />
          <span>{value || 0}</span>
        </div>
      )
    },
    { 
      header: 'Room', 
      accessor: 'room_number',
      render: (value) => (
        <div className="flex items-center">
          <Building size={14} className="mr-1 text-gray-500" />
          <span>{value || '-'}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'is_active',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <DashboardLayout title="Class Arms">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Class Arms</h1>
            <p className="text-gray-600">Manage class arms and sections (e.g., JSS 1A, JSS 1B, JSS 1C)</p>
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
              Add Class Arm
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
                <Input
                  type="text"
                  placeholder="Search class arms by name, code, or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm text-gray-600">Filter:</span>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Users2 className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Arms</p>
                <p className="text-xl font-bold text-gray-800">{classArms.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Arms</p>
                <p className="text-xl font-bold text-gray-800">
                  {classArms.filter(a => a.is_active).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <School className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Capacity</p>
                <p className="text-xl font-bold text-gray-800">
                  {classArms.length > 0 
                    ? Math.round(classArms.reduce((sum, a) => sum + (a.capacity || 0), 0) / classArms.length)
                    : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Hash className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">With Rooms</p>
                <p className="text-xl font-bold text-gray-800">
                  {classArms.filter(a => a.room_number).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Arms Table */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredArms}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No class arms found. Click 'Add Class Arm' to create one."
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
        title={editingArm ? 'Edit Class Arm' : 'Add New Class Arm'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Arm Name *"
                placeholder="e.g., JSS 1A, SSS 2 Science B"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              
              <Input
                label="Arm Code *"
                placeholder="e.g., JSS1A, SSS2SB"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                required
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
            
            <Select
              label="Parent Class (Optional)"
              value={formData.parent_class}
              onChange={(e) => setFormData({...formData, parent_class: e.target.value})}
              options={[{ value: '', label: 'Select parent class' }, ...classes.map(c => ({ 
                value: c.id, 
                label: c.name 
              }))]}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                min="1"
                max="100"
              />
              
              <Input
                label="Room Number"
                placeholder="e.g., Room 101"
                value={formData.room_number}
                onChange={(e) => setFormData({...formData, room_number: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Arm description..."
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
                  Class arm is active
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
              {editingArm ? 'Update Class Arm' : 'Create Class Arm'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default ClassArms;