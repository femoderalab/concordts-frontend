import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StaffForm from '../../components/staff/StaffForm';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import staffService from '../../services/staffService';

const StaffEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is admin
  const isAdmin = user?.role === 'head' || user?.role === 'principal' || 
                  user?.role === 'vice_principal';

  useEffect(() => {
    fetchStaff();
  }, [id]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffService.getAllStaff(filters);
      
      // Handle different response formats
      if (response && Array.isArray(response)) {
        setStaff(response);
      } else if (response && response.results && Array.isArray(response.results)) {
        setStaff(response.results);
      } else if (response && response.data && Array.isArray(response.data)) {
        setStaff(response.data);
      } else {
        setStaff([]);
      }
      
      setError('');
    } catch (err) {
      console.error('Error loading staff:', err);
      setError('Failed to load staff. Please try again.');
      setStaff([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (staffData) => {
    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      await staffService.updateStaff(id, staffData);
      
      setSuccess('Staff member updated successfully!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/staff/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update staff member');
    } finally {
      setUpdating(false);
    }
  };

  if (!isAdmin) {
    navigate('/dashboard');
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (!staff) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Staff member not found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Edit Staff Member</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update staff information for {staff.user?.first_name} {staff.user?.last_name}
            </p>
          </div>

          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}

          {success && (
            <Alert type="success" message={success} />
          )}

          <StaffForm
            staff={staff}
            onSubmit={handleSubmit}
            loading={updating}
            error={error}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffEdit;