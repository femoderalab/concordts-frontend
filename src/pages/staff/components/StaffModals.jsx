// src/pages/staff/components/StaffModals.jsx
import React from 'react';
import Modal from '../../../components/common/modal';
import { Text, Button } from '../../../components/ui';
import { Eye, XCircle, Trash2, Lock, AlertCircle, User, Briefcase, Mail, Phone, Calendar, MapPin, Heart, DollarSign, RefreshCw, Shield, UserCheck, UserX } from 'lucide-react';

// View Staff Modal
export const ViewStaffModal = ({ isOpen, onClose, staff, staffDetails, loading, onEdit, onResetPassword, onArchive, onRestore, onPrint, formatCurrency, formatDate }) => {
  if (!staff && !staffDetails) return null;
  const data = staffDetails || staff;
  const user = data?.user || {};
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Not Available';
  const departmentDisplay = { 'administration': 'Administration', 'academic': 'Academic', 'finance': 'Finance', 'library': 'Library', 'laboratory': 'Laboratory', 'ict': 'ICT', 'security': 'Security' }[data?.department] || data?.department || 'Not Assigned';
  const isActive = data?.is_active;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Staff Details" size="lg">
      {loading ? (
        <div className="py-20 flex justify-center"><RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" /></div>
      ) : (
        <div className="py-3 max-h-[75vh] overflow-y-auto space-y-4 px-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
              {data?.passport_photo ? <img src={data.passport_photo} alt={fullName} className="w-full h-full object-cover" /> : <User size={24} className="text-blue-600" />}
            </div>
            <div>
              <Text variant="h3" className="font-bold">{fullName}</Text>
              <div className="flex flex-wrap gap-2 mt-1"><Text variant="tiny" className="bg-blue-100 px-2 py-1 rounded">{data?.staff_id}</Text><Text variant="tiny" className="bg-gray-100 px-2 py-1 rounded">{user.registration_number}</Text></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4"><Text variant="caption" className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><User size={14} /> Personal Information</Text>
              <div className="space-y-2"><div><Text variant="tiny" className="text-gray-500">Full Name</Text><Text variant="small" className="font-medium">{fullName}</Text></div><div><Text variant="tiny" className="text-gray-500">Email</Text><Text variant="small">{user.email || 'Not provided'}</Text></div><div><Text variant="tiny" className="text-gray-500">Phone</Text><Text variant="small">{user.phone_number || 'Not provided'}</Text></div><div><Text variant="tiny" className="text-gray-500">Gender</Text><Text variant="small">{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}</Text></div><div><Text variant="tiny" className="text-gray-500">Date of Birth</Text><Text variant="small">{formatDate(user.date_of_birth)}</Text></div></div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4"><Text variant="caption" className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Briefcase size={14} /> Employment Information</Text>
              <div className="space-y-2"><div><Text variant="tiny" className="text-gray-500">Staff ID</Text><Text variant="small" className="font-medium">{data?.staff_id}</Text></div><div><Text variant="tiny" className="text-gray-500">Department</Text><Text variant="small">{departmentDisplay}</Text></div><div><Text variant="tiny" className="text-gray-500">Position</Text><Text variant="small">{data?.position_title || 'Not specified'}</Text></div><div><Text variant="tiny" className="text-gray-500">Employment Date</Text><Text variant="small">{formatDate(data?.employment_date)}</Text></div><div><Text variant="tiny" className="text-gray-500">Employment Type</Text><Text variant="small">{data?.employment_type || 'Full-Time'}</Text></div></div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4"><Text variant="caption" className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><DollarSign size={14} /> Salary Information</Text>
              <div className="space-y-2"><div><Text variant="tiny" className="text-gray-500">Basic Salary</Text><Text variant="small" className="font-bold text-green-600">{formatCurrency(data?.basic_salary || 0)}</Text></div><div><Text variant="tiny" className="text-gray-500">Salary Scale</Text><Text variant="small">{data?.salary_scale || 'Not specified'}</Text></div><div><Text variant="tiny" className="text-gray-500">Salary Step</Text><Text variant="small">{data?.salary_step || '1'}</Text></div></div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4"><Text variant="caption" className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Heart size={14} /> Health Information</Text>
              <div className="space-y-2"><div><Text variant="tiny" className="text-gray-500">Blood Group</Text><Text variant="small">{data?.blood_group || 'Not specified'}</Text></div><div><Text variant="tiny" className="text-gray-500">Genotype</Text><Text variant="small">{data?.genotype || 'Not specified'}</Text></div><div><Text variant="tiny" className="text-gray-500">Medical Conditions</Text><Text variant="small">{data?.medical_conditions || 'None'}</Text></div></div>
            </div>
          </div>
          
          {(data?.emergency_contact_name || data?.next_of_kin_name) && (
            <div className="bg-gray-50 rounded-xl p-4"><Text variant="caption" className="font-semibold text-gray-700 mb-3">Emergency Contact & Next of Kin</Text>
              <div className="grid grid-cols-2 gap-3"><div><Text variant="tiny" className="text-gray-500">Emergency Contact</Text><Text variant="small">{data?.emergency_contact_name || 'N/A'}</Text><Text variant="tiny">{data?.emergency_contact_phone}</Text></div><div><Text variant="tiny" className="text-gray-500">Next of Kin</Text><Text variant="small">{data?.next_of_kin_name || 'N/A'}</Text><Text variant="tiny">{data?.next_of_kin_phone}</Text></div></div>
            </div>
          )}
          
          <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
            <Button variant="outline" size="small" onClick={onPrint} icon={Eye}>Print Record</Button>
            <Button variant="outline" size="small" onClick={() => { onClose(); onEdit(data); }} icon={Eye}>Edit</Button>
            {isActive ? (
              <Button variant="danger" size="small" onClick={() => { onClose(); onArchive(data); }} icon={UserX}>Archive</Button>
            ) : (
              <Button variant="success" size="small" onClick={() => { onClose(); onRestore(data); }} icon={UserCheck}>Restore</Button>
            )}
            <Button variant="primary" size="small" onClick={onClose}>Close</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// Archive Staff Modal
export const ArchiveStaffModal = ({ isOpen, onClose, staff, onConfirm, loading }) => {
  if (!staff) return null;
  const user = staff.user || {};
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'this staff member';
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Archive Staff" size="sm">
      <div className="py-4 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={20} className="text-red-600" /></div>
        <Text variant="h4" className="font-semibold mb-2">Archive Staff?</Text>
        <Text variant="caption" className="text-gray-500 mb-4 block">Are you sure you want to archive <span className="font-medium">{fullName}</span>?<br />Archived staff cannot access the portal.<br />This action can be reversed.</Text>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4"><Text variant="tiny" className="text-yellow-800 flex items-center gap-2"><AlertCircle size={14} /> Archiving a staff will:</Text>
          <ul className="text-[10px] text-yellow-700 list-disc list-inside mt-1"><li>Prevent portal login access</li><li>Show "Account Archived" error message on login</li><li>Staff must contact administration to restore access</li></ul>
        </div>
        <div className="flex gap-2"><Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button><Button variant="danger" onClick={onConfirm} disabled={loading} className="flex-1">{loading ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}Archive</Button></div>
      </div>
    </Modal>
  );
};

// Restore Staff Modal
export const RestoreStaffModal = ({ isOpen, onClose, staff, onConfirm, loading }) => {
  if (!staff) return null;
  const user = staff.user || {};
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'this staff member';
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restore Staff" size="sm">
      <div className="py-4 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><RefreshCw size={20} className="text-green-600" /></div>
        <Text variant="h4" className="font-semibold mb-2">Restore Staff?</Text>
        <Text variant="caption" className="text-gray-500 mb-4 block">Are you sure you want to restore <span className="font-medium">{fullName}</span>?<br />The staff will be able to access the portal again.</Text>
        <div className="flex gap-2"><Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button><Button variant="success" onClick={onConfirm} disabled={loading} className="flex-1">{loading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}Restore</Button></div>
      </div>
    </Modal>
  );
};

// Password Reset Modal
export const PasswordResetModal = ({ isOpen, onClose, staff, formData, setFormData, errors, onSubmit, loading }) => {
  if (!staff) return null;
  const user = staff.user || {};
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Staff';
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset Staff Password" size="md">
      <form onSubmit={onSubmit} className="py-4 space-y-4">
        <div className="text-center"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><Lock size={20} className="text-blue-600" /></div><Text variant="h4" className="font-semibold">Reset Password for {fullName}</Text><Text variant="tiny" className="text-gray-500 mt-1">Only administrators can reset passwords</Text></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">New Password *</label><input type="password" name="new_password" value={formData.new_password} onChange={(e) => setFormData(prev => ({ ...prev, new_password: e.target.value }))} className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] ${errors.new_password ? 'border-red-500' : 'border-gray-200'}`} placeholder="Enter new password" />{errors.new_password && <Text variant="tiny" className="text-red-500 mt-1">{errors.new_password}</Text>}</div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Confirm Password *</label><input type="password" name="confirm_password" value={formData.confirm_password} onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))} className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] ${errors.confirm_password ? 'border-red-500' : 'border-gray-200'}`} placeholder="Confirm new password" />{errors.confirm_password && <Text variant="tiny" className="text-red-500 mt-1">{errors.confirm_password}</Text>}</div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"><Text variant="tiny" className="text-yellow-800"><strong>Note:</strong> Password must be at least 5 characters long.</Text></div>
        <div className="flex gap-3 pt-2"><Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button><Button variant="primary" type="submit" disabled={loading} className="flex-1">{loading ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}Reset Password</Button></div>
      </form>
    </Modal>
  );
};