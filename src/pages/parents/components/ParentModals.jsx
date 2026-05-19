// src/pages/parents/components/ParentModals.jsx
import React, { useState } from 'react';
import Modal from '../../../components/common/modal';
import { Text, Button } from '../../../components/ui';
import { UserX, Lock, Eye, EyeOff, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';

export const ArchiveParentModal = ({ isOpen, onClose, parent, onConfirm, loading }) => {
  const [reason, setReason] = useState('');
  const fullName = parent?.full_name || `${parent?.user?.first_name || ''} ${parent?.user?.last_name || ''}`.trim() || 'this parent';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Archive Parent" size="sm">
      <div className="py-4 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserX size={20} className="text-red-600" />
        </div>
        <Text variant="h4" className="font-semibold mb-2">Archive Parent?</Text>
        <Text variant="caption" className="text-gray-500 mb-4 block">
          Are you sure you want to archive <span className="font-medium">{fullName}</span>?
          <br />Archived parents cannot login to the parent portal.
        </Text>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <Text variant="tiny" className="text-yellow-800 flex items-center gap-2"><AlertCircle size={14} /> Archiving a parent will:</Text>
          <ul className="text-[10px] text-yellow-700 list-disc list-inside mt-1">
            <li>Prevent portal login access</li><li>Show "Account Archived" error message on login</li>
            <li>Parent must contact administration to restore access</li>
          </ul>
        </div>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} placeholder="Reason for archiving (optional)" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-4" />
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={() => onConfirm(reason)} disabled={loading} className="flex-1">
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <UserX size={14} />} Archive
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const RestoreParentModal = ({ isOpen, onClose, parent, onConfirm, loading }) => {
  const fullName = parent?.full_name || `${parent?.user?.first_name || ''} ${parent?.user?.last_name || ''}`.trim() || 'this parent';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restore Parent" size="sm">
      <div className="py-4 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw size={20} className="text-green-600" />
        </div>
        <Text variant="h4" className="font-semibold mb-2">Restore Parent?</Text>
        <Text variant="caption" className="text-gray-500 mb-4 block">
          Are you sure you want to restore <span className="font-medium">{fullName}</span>?
          <br />The parent will be able to access the portal again.
        </Text>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="success" onClick={onConfirm} disabled={loading} className="flex-1">
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />} Restore
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const PasswordResetModal = ({ isOpen, onClose, parent, formData, setFormData, errors, onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const fullName = parent?.full_name || `${parent?.user?.first_name || ''} ${parent?.user?.last_name || ''}`.trim() || 'Parent';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset Parent Password" size="md">
      <form onSubmit={onSubmit} className="py-4 space-y-4">
        <div className="text-center"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><Lock size={20} className="text-blue-600" /></div>
          <Text variant="h4" className="font-semibold">Reset Password for {fullName}</Text>
          <Text variant="tiny" className="text-gray-500 mt-1">Only administrators can reset passwords</Text>
        </div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">New Password *</label>
          <div className="relative"><input type={showPassword ? 'text' : 'password'} name="new_password" value={formData.new_password} onChange={(e) => setFormData(prev => ({ ...prev, new_password: e.target.value }))} className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] ${errors.new_password ? 'border-red-500' : 'border-gray-200'}`} placeholder="Enter new password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>{errors.new_password && <Text variant="tiny" className="text-red-500 mt-1">{errors.new_password}</Text>}
        </div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Confirm Password *</label>
          <input type={showPassword ? 'text' : 'password'} name="confirm_password" value={formData.confirm_password} onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))} className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] ${errors.confirm_password ? 'border-red-500' : 'border-gray-200'}`} placeholder="Confirm new password" />
          {errors.confirm_password && <Text variant="tiny" className="text-red-500 mt-1">{errors.confirm_password}</Text>}
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"><Text variant="tiny" className="text-yellow-800"><strong>Note:</strong> Password must be at least 5 characters long.</Text></div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" type="submit" disabled={loading} className="flex-1">{loading ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />} Reset Password</Button>
        </div>
      </form>
    </Modal>
  );
};