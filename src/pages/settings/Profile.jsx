import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import useAuth from '../../hooks/useAuth';
import { updateUserProfile } from '../../services/authService';
import { handleApiError } from '../../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state_of_origin: '',
    lga: '',
    date_of_birth: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        city: user.city || '',
        state_of_origin: user.state_of_origin || '',
        lga: user.lga || '',
        date_of_birth: user.date_of_birth || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await updateUserProfile(formData);
      
      if (response.user) {
        updateUser(response.user);
        setSuccess('Profile updated successfully!');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout title="My Profile">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
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

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <div className="flex items-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold ${user.is_admin ? 'bg-purple-500' : 'bg-primary-500'}`}>
            {user.first_name?.[0] || 'U'}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-600">
              {user.role_display || user.role} • {user.registration_number}
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${user.is_verified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {user.is_verified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              disabled={loading}
            />
            
            <Input
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              disabled={loading}
            />
            
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            
            <Input
              label="Phone Number"
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              required
              disabled={loading}
            />
            
            <Input
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              disabled={loading}
            />
            
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
            
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={loading}
            />
            
            <Input
              label="State of Origin"
              name="state_of_origin"
              value={formData.state_of_origin}
              onChange={handleChange}
              disabled={loading}
            />
            
            <Input
              label="Local Government Area"
              name="lga"
              value={formData.lga}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;