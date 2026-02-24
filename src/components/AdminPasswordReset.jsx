// components/AdminPasswordReset.js
import React, { useState } from 'react';
import { Lock, CheckCircle, XCircle } from 'lucide-react';
import { updateStudentPassword } from '../services/studentService';
import Button from './common/Button';
import Modal from './common/Modal';
import Alert from './common/Alert';

const AdminPasswordReset = ({ student, isOpen, onClose, onSuccess }) => {
  const [passwordForm, setPasswordForm] = useState({
    new_password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {};
    if (!passwordForm.new_password) newErrors.new_password = 'Password is required';
    if (!passwordForm.confirm_password) newErrors.confirm_password = 'Please confirm password';
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    if (passwordForm.new_password && passwordForm.new_password.length < 5) {
      newErrors.new_password = 'Password must be at least 5 characters';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    try {
      setLoading(true);
      
      await updateStudentPassword(student.id, {
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password
      });
      
      setSuccess('Password reset successfully!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setPasswordForm({ new_password: '', confirm_password: '' });
      }, 1500);
      
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset Student Password" size="md">
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
          <CheckCircle size={18} className="mr-2" />
          {success}
        </div>
      )}
      
      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <XCircle size={18} className="mr-2" />
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="py-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="text-secondary-600" size={24} />
          </div>
          <h3 className="text-lg font-medium">
            Reset Password for {student?.user?.first_name} {student?.user?.last_name}
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            Only Head of School or Head Master can reset passwords
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="new_password"
              value={passwordForm.new_password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${
                errors.new_password ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Minimum 5 characters"
            />
            {errors.new_password && (
              <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
            )}
            <p className="mt-1 text-xs text-neutral-500">
              Simple password - minimum 5 characters only
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirm_password"
              value={passwordForm.confirm_password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${
                errors.confirm_password ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Re-enter password"
            />
            {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3 mt-8">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminPasswordReset;