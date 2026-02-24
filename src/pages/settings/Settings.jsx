import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import useAuth from '../../hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    sms_notifications: true,
    push_notifications: true,
    marketing_emails: false,
  });

  // Display preferences
  const [display, setDisplay] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'Africa/Lagos',
    date_format: 'DD/MM/YYYY',
    time_format: '12h',
  });

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handleDisplayChange = (e) => {
    const { name, value } = e.target;
    setDisplay(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      
      // This would save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Notification preferences saved successfully!');
    } catch (err) {
      setError('Failed to save notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDisplay = async () => {
    try {
      setLoading(true);
      setError('');
      
      // This would save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Display preferences saved successfully!');
    } catch (err) {
      setError('Failed to save display preferences');
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

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Account Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h4 className="font-medium text-gray-800">Account Status</h4>
              <p className="text-sm text-gray-600">
                {user?.is_active ? 'Your account is active' : 'Your account is inactive'}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {user?.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h4 className="font-medium text-gray-800">Verification Status</h4>
              <p className="text-sm text-gray-600">
                {user?.is_verified ? 'Your account is verified' : 'Your account requires verification'}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${user?.is_verified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {user?.is_verified ? 'Verified' : 'Pending'}
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <h4 className="font-medium text-gray-800">Account Role</h4>
              <p className="text-sm text-gray-600">
                {user?.role_display || user?.role}
              </p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {user?.role_display || user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive important updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="email_notifications"
                checked={notifications.email_notifications}
                onChange={handleNotificationChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">SMS Notifications</h4>
              <p className="text-sm text-gray-600">Receive alerts via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="sms_notifications"
                checked={notifications.sms_notifications}
                onChange={handleNotificationChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">Push Notifications</h4>
              <p className="text-sm text-gray-600">Receive browser push notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="push_notifications"
                checked={notifications.push_notifications}
                onChange={handleNotificationChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">Marketing Emails</h4>
              <p className="text-sm text-gray-600">Receive promotional emails</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="marketing_emails"
                checked={notifications.marketing_emails}
                onChange={handleNotificationChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={handleSaveNotifications}
            loading={loading}
            disabled={loading}
          >
            Save Notification Preferences
          </Button>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Display Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              name="theme"
              value={display.theme}
              onChange={handleDisplayChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              name="language"
              value={display.language}
              onChange={handleDisplayChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              name="timezone"
              value={display.timezone}
              onChange={handleDisplayChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New York (GMT-5)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              name="date_format"
              value={display.date_format}
              onChange={handleDisplayChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
            <select
              name="time_format"
              value={display.time_format}
              onChange={handleDisplayChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="12h">12-hour</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={handleSaveDisplay}
            loading={loading}
            disabled={loading}
          >
            Save Display Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;