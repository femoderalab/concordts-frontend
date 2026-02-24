import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import useAuth from '../../hooks/useAuth';

const Security = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Change password form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Two-factor authentication
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // This would call your change password API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password changed successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err) {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    try {
      setLoading(true);
      
      // This would call your two-factor API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTwoFactorEnabled(!twoFactorEnabled);
      setSuccess(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`);
    } catch (err) {
      setError('Failed to update two-factor authentication');
    } finally {
      setLoading(false);
    }
  };

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

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Change Password</h3>
        
        <form onSubmit={handleChangePassword} className="space-y-6">
          <Input
            label="Current Password"
            name="current_password"
            type="password"
            value={passwordData.current_password}
            onChange={handlePasswordChange}
            required
            disabled={loading}
            placeholder="Enter your current password"
          />
          
          <Input
            label="New Password"
            name="new_password"
            type="password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
            required
            disabled={loading}
            placeholder="Enter new password (min. 8 characters)"
            helperText="Password must be at least 8 characters long"
          />
          
          <Input
            label="Confirm New Password"
            name="confirm_password"
            type="password"
            value={passwordData.confirm_password}
            onChange={handlePasswordChange}
            required
            disabled={loading}
            placeholder="Confirm your new password"
          />
          
          <div className="pt-4">
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Two-Factor Authentication</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={handleToggleTwoFactor}
                className="sr-only peer"
                disabled={loading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          {twoFactorEnabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">Two-Factor Enabled</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your account is now protected with two-factor authentication. 
                    You'll need to enter a verification code from your authenticator app when logging in.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Active Sessions</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h4 className="font-medium text-gray-800">Current Session</h4>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString()} • {navigator.userAgent}
              </p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              Active
            </span>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-800">Previous Session</h4>
              <p className="text-sm text-gray-600">
                Yesterday • Chrome on Windows
              </p>
            </div>
            <button className="text-sm text-red-600 hover:text-red-800">
              Revoke
            </button>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => {
              // This would revoke all sessions except current
              setSuccess('All other sessions have been revoked');
            }}
            disabled={loading}
          >
            Revoke All Other Sessions
          </Button>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-red-200">
        <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <Button
            variant="danger"
            onClick={() => {
              const confirmed = window.confirm(
                'Are you sure you want to delete your account? This action cannot be undone.'
              );
              if (confirmed) {
                // This would delete the account
                alert('Account deletion requested. Please contact support for confirmation.');
              }
            }}
            disabled={loading}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Security;