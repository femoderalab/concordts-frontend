import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import useAuth from '../../hooks/useAuth';
import { getDays, updateDay } from '../../services/timetableService';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import {
  Calendar, RefreshCw, Edit2, Check, X, Loader2, AlertCircle
} from 'lucide-react';

const ManageDays = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [days, setDays] = useState([]);
  const [editingDay, setEditingDay] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    is_school_day: true,
    order: 0
  });
  
  const canManage = ['head', 'hm', 'principal', 'vice_principal', 'secretary'].includes(user?.role);

  useEffect(() => {
    if (canManage) {
      loadDays();
    }
  }, [canManage]);

  const loadDays = async () => {
    try {
      setLoading(true);
      const data = await getDays();
      const daysList = data.results || data || [];
      setDays(daysList.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Error loading days:', err);
      setError('Failed to load days');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (day) => {
    setEditingDay(day);
    setEditForm({
      name: day.name,
      is_school_day: day.is_school_day,
      order: day.order
    });
  };

  const handleCancelEdit = () => {
    setEditingDay(null);
    setEditForm({ name: '', is_school_day: true, order: 0 });
  };

  const handleSaveEdit = async () => {
    if (!editingDay) return;
    
    try {
      setSaving(true);
      await updateDay(editingDay.id, {
        ...editingDay,
        name: editForm.name,
        is_school_day: editForm.is_school_day,
        order: editForm.order
      });
      setSuccess('Day updated successfully');
      setEditingDay(null);
      loadDays();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating day:', err);
      setError(err.message || 'Failed to update day');
    } finally {
      setSaving(false);
    }
  };

  const toggleSchoolDay = async (day) => {
    try {
      await updateDay(day.id, {
        ...day,
        is_school_day: !day.is_school_day
      });
      setSuccess(`${day.name} ${!day.is_school_day ? 'enabled' : 'disabled'}`);
      loadDays();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error toggling day:', err);
      setError('Failed to update day');
    }
  };

  if (!canManage) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
            <p className="text-gray-600 mt-2">Only administrators can manage school days.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manage School Days">
      <div className="py-6 px-4 sm:px-0">
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage School Days</h1>
            <p className="text-gray-500 text-sm mt-1">Configure which days are school days</p>
          </div>
          <Button onClick={loadDays} variant="outline" className="border-gray-300">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
        </div>

        {/* Days List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={40} className="animate-spin mx-auto text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {days.map((day) => (
              <div key={day.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all">
                {editingDay?.id === day.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={editForm.is_school_day}
                          onChange={(e) => setEditForm({...editForm, is_school_day: e.target.checked})}
                          className="h-4 w-4 rounded"
                        />
                        School Day
                      </label>
                      <input
                        type="number"
                        value={editForm.order}
                        onChange={(e) => setEditForm({...editForm, order: parseInt(e.target.value) || 0})}
                        className="w-20 px-2 py-1 border border-gray-200 rounded text-sm text-center"
                        placeholder="Order"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={saving}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-1"
                      >
                        <Check size={14} /> Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-1"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{day.name}</h3>
                        <p className="text-xs text-gray-400 mt-1">Order: {day.order}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(day)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <button
                          onClick={() => toggleSchoolDay(day)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            day.is_school_day 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {day.is_school_day ? 'School Day' : 'Not School Day'}
                        </button>
                      </div>
                      <Calendar size={20} className="text-gray-300" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageDays;