/**
 * Parent Password Reset Modal Component
 */

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/modal';

const ParentPasswordModal = ({ isOpen, onClose, onConfirm, parent, loading }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 5) {
      setError('Password must be at least 5 characters');
      return;
    }
    
    onConfirm(password);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset Parent Password" size="sm">
      <div className="py-4">
        <div className="w-14 h-14 bg-secondary-100 border border-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Lock size={22} className="text-secondary-600" />
        </div>
        
        <h3 className="text-center text-base font-extrabold text-gray-900 mb-1">
          Reset Password for {parent?.full_name || parent?.user?.first_name}
        </h3>
        
        <p className="text-center text-xs text-gray-500 mb-4">
          The parent will use this new password to log in
        </p>
        
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-400/30 focus:border-secondary-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-400/30 focus:border-secondary-400 transition-all"
            />
          </div>
        </div>
        
        <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> Password must be at least 5 characters long. No special characters required.
          </p>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading} className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white">
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ParentPasswordModal;