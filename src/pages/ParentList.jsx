// src/pages/ParentList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ParentTable from '../components/parents/ParentTable';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import useAuth from '../hooks/useAuth';
import { getParents, deleteParent } from '../services/parentService';
import { handleApiError } from '../services/api';

const ParentList = () => {
  const { user } = useAuth();
  
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const canCreate = user?.role === 'head' || user?.role === 'principal' || user?.role === 'vice_principal' || user?.role === 'secretary' || user?.is_staff;

  useEffect(() => {
    fetchParents();
  }, []);

  useEffect(() => {
    filterParents();
  }, [parents, searchTerm, filterType, filterStatus]);

  
  const fetchParents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getParents();
      
      // Extract the array from the response
      const parentsData = response.results || response.data || response;
      
      // Ensure it's an array
      const parentsArray = Array.isArray(parentsData) ? parentsData : [];
      
      setParents(parentsArray);
      setFilteredParents(parentsArray);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching parents:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterParents = () => {
    let filtered = parents;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(parent =>
        parent.user?.first_name?.toLowerCase().includes(term) ||
        parent.user?.last_name?.toLowerCase().includes(term) ||
        parent.user?.email?.toLowerCase().includes(term) ||
        parent.parent_id?.toLowerCase().includes(term) ||
        parent.occupation?.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(parent => parent.parent_type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'active') {
        filtered = filtered.filter(parent => parent.is_active);
      } else if (filterStatus === 'inactive') {
        filtered = filtered.filter(parent => !parent.is_active);
      } else if (filterStatus === 'verified') {
        filtered = filtered.filter(parent => parent.is_verified);
      } else if (filterStatus === 'pending') {
        filtered = filtered.filter(parent => !parent.is_verified);
      } else if (filterStatus === 'pta') {
        filtered = filtered.filter(parent => parent.is_pta_member);
      }
    }

    setFilteredParents(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilter = (e) => {
    setFilterType(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleDelete = async (parent) => {
    if (!window.confirm(`Are you sure you want to delete ${parent.user.first_name} ${parent.user.last_name}? This action cannot be undone.`)) {
      return;
    }

    try {
      setError('');
      await deleteParent(parent.id);
      
      setSuccess(`Parent ${parent.user.first_name} ${parent.user.last_name} deleted successfully`);
      fetchParents(); // Refresh list
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const handleEdit = (parent) => {
    // Navigate to edit page
    window.location.href = `/parents/${parent.id}/update`;
  };

  const handleView = (parent) => {
    // Navigate to view page
    window.location.href = `/parents/${parent.id}`;
  };

  return (
    <DashboardLayout title="Parents Management">
      {/* Alerts */}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
          className="mb-6"
        />
      )}

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Parents Management</h1>
            <p className="text-gray-600 mt-1">
              Manage parent accounts and their relationships with students
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            {canCreate && (
              <Link to="/parents/create">
                <Button>Add New Parent</Button>
              </Link>
            )}
            <Link to="/parents/link-child">
              <Button variant="outline">Link Child to Parent</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              label="Search Parents"
              placeholder="Search by name, email, ID..."
              value={searchTerm}
              onChange={handleSearch}
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Type</label>
            <select
              value={filterType}
              onChange={handleTypeFilter}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="guardian">Guardian</option>
              <option value="relative">Relative</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
            <select
              value={filterStatus}
              onChange={handleStatusFilter}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending Verification</option>
              <option value="pta">PTA Members</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">
                Showing {filteredParents.length} of {parents.length} parents
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {loading && 'Loading...'}
            </div>
          </div>
        </div>
      </div>

      {/* Parents Table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <ParentTable
          parents={filteredParents}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          currentUser={user}
        />
      </div>
    </DashboardLayout>
  );
};

export default ParentList;