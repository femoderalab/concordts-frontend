import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import useAuth from '../../hooks/useAuth';
import { getPeriods, createPeriod, updatePeriod, deletePeriod } from '../../services/timetableService';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/modal';
import {
  Clock, Plus, Edit2, Trash2, Save, X, RefreshCw,
  AlertCircle, ChevronUp, ChevronDown, Loader2
} from 'lucide-react';

const ManagePeriods = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [periods, setPeriods] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    start_time: '08:00',
    end_time: '09:00',
    order: 1,
    is_active: true
  });
  
  const canManage = ['head', 'hm', 'principal', 'vice_principal', 'secretary'].includes(user?.role);

  useEffect(() => {
    if (canManage) {
      loadPeriods();
    }
  }, [canManage]);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const data = await getPeriods();
      const periodsList = data.results || data || [];
      setPeriods(periodsList.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Error loading periods:', err);
      setError('Failed to load periods');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (period = null) => {
    if (period) {
      setEditingPeriod(period);
      setFormData({
        name: period.name,
        start_time: period.start_time?.slice(0, 5) || '08:00',
        end_time: period.end_time?.slice(0, 5) || '09:00',
        order: period.order,
        is_active: period.is_active
      });
    } else {
      setEditingPeriod(null);
      setFormData({
        name: '',
        start_time: '08:00',
        end_time: '09:00',
        order: periods.length + 1,
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      if (!formData.name.trim()) {
        setError('Period name is required');
        return;
      }
      if (!formData.start_time) {
        setError('Start time is required');
        return;
      }
      if (!formData.end_time) {
        setError('End time is required');
        return;
      }
      
      const data = {
        name: formData.name,
        start_time: formData.start_time,
        end_time: formData.end_time,
        order: parseInt(formData.order),
        is_active: formData.is_active
      };
      
      if (editingPeriod) {
        await updatePeriod(editingPeriod.id, data);
        setSuccess('Period updated successfully');
      } else {
        await createPeriod(data);
        setSuccess('Period created successfully');
      }
      
      setShowModal(false);
      loadPeriods();
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error saving period:', err);
      setError(err.message || 'Failed to save period');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (period) => {
    if (!window.confirm(`Are you sure you want to delete "${period.name}"? This will also delete all timetable entries using this period.`)) {
      return;
    }
    
    try {
      await deletePeriod(period.id);
      setSuccess('Period deleted successfully');
      loadPeriods();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting period:', err);
      setError(err.message || 'Failed to delete period');
    }
  };

  const movePeriod = async (period, direction) => {
    const newOrder = direction === 'up' ? period.order - 1 : period.order + 1;
    const otherPeriod = periods.find(p => p.order === newOrder);
    
    if (!otherPeriod) return;
    
    try {
      await updatePeriod(period.id, { ...period, order: newOrder });
      await updatePeriod(otherPeriod.id, { ...otherPeriod, order: period.order });
      loadPeriods();
      setSuccess(`Period moved ${direction}`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error moving period:', err);
      setError('Failed to reorder periods');
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.slice(0, 5);
  };

  if (!canManage) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
            <p className="text-gray-600 mt-2">Only administrators can manage periods.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manage Periods">
      <div className="py-6 px-4 sm:px-0">
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Time Periods</h1>
            <p className="text-gray-500 text-sm mt-1">Create, edit, and delete time slots for timetable</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleOpenModal()} className="bg-gray-900 hover:bg-gray-700">
              <Plus size={16} className="mr-2" /> Add Period
            </Button>
            <Button onClick={loadPeriods} variant="outline" className="border-gray-300">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Button>
          </div>
        </div>

        {/* Periods List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={40} className="animate-spin mx-auto text-gray-400" />
          </div>
        ) : periods.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Clock size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No time periods created yet</p>
            <Button onClick={() => handleOpenModal()} className="mt-4">
              Create First Period
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Period Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Start Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">End Time</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {periods.map((period, index) => (
                  <tr key={period.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600 w-8">{period.order}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => movePeriod(period, 'up')}
                            disabled={index === 0}
                            className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            onClick={() => movePeriod(period, 'down')}
                            disabled={index === periods.length - 1}
                            className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">{period.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{formatTime(period.start_time)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{formatTime(period.end_time)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        period.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {period.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleOpenModal(period)}
                          className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(period)}
                          className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingPeriod ? 'Edit Period' : 'Add New Period'} size="md">
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Period 1, First Period, Morning Session"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 1})}
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <p className="text-xs text-gray-400 mt-1">Controls the order in which periods appear</p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="h-4 w-4 text-gray-900 rounded focus:ring-gray-900"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                Active (show in timetable)
              </label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} loading={saving} className="flex-1 bg-gray-900 hover:bg-gray-700">
                {editingPeriod ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ManagePeriods;