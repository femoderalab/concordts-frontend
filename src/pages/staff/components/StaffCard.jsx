// src/pages/staff/components/StaffCard.jsx
import React from 'react';
import { Text, Card } from '../../../components/ui';
import { User, Eye, Edit2, Lock, UserX, UserCheck, Shield, Briefcase, Mail, Phone } from 'lucide-react';

const StatusBadge = ({ isActive, isRetired, isOnLeave }) => {
  if (!isActive) {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-red-100 text-red-700"><UserX size={10} /> Inactive</span>;
  }
  if (isRetired) {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-purple-100 text-purple-700"><Shield size={10} /> Retired</span>;
  }
  if (isOnLeave) {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-yellow-100 text-yellow-700">On Leave</span>;
  }
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-700"><UserCheck size={10} /> Active</span>;
};

const RoleBadge = ({ role }) => {
  const roleDisplay = {
    'head': 'Head of School', 'hm': 'Head Master', 'principal': 'Principal',
    'vice_principal': 'Vice Principal', 'teacher': 'Teacher', 'form_teacher': 'Form Teacher',
    'subject_teacher': 'Subject Teacher', 'accountant': 'Accountant', 'secretary': 'Secretary'
  }[role] || role || 'Staff';
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-gray-100 text-gray-600">{roleDisplay}</span>;
};

export const StaffCard = ({ staff, onView, onEdit, onArchive, onRestore, onResetPassword, isAdmin }) => {
  const user = staff.user || {};
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || staff.full_name || '—';
  const email = user.email || '—';
  const phone = user.phone_number || '—';
  const positionTitle = staff.position_title || 'Not Specified';
  const staffId = staff.staff_id || '—';
  const imageUrl = staff.passport_photo || null;
  const isActive = staff.is_active;
  
  const departmentDisplay = {
    'administration': 'Admin', 'academic': 'Academic', 'finance': 'Finance',
    'library': 'Library', 'laboratory': 'Lab', 'ict': 'ICT',
    'security': 'Security', 'maintenance': 'Maintenance'
  }[staff.department] || staff.department || 'Staff';
  
  return (
    <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {imageUrl ? <img src={imageUrl} alt={fullName} className="w-full h-full object-cover" /> : <User size={14} className="text-blue-600" />}
          </div>
          <div className="flex-1 min-w-0">
            <Text variant="tiny" className="font-bold text-gray-800 truncate">{fullName}</Text>
            <Text variant="caption" className="text-gray-400 truncate text-[8px]">{staffId}</Text>
          </div>
        </div>
        <StatusBadge isActive={isActive} isRetired={staff.is_retired} isOnLeave={staff.is_on_leave} />
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <Briefcase size={10} className="text-gray-400" />
          <Text variant="tiny" className="text-gray-500 truncate">{positionTitle}</Text>
        </div>
        <div className="flex items-center gap-1">
          <Mail size={10} className="text-gray-400" />
          <Text variant="tiny" className="text-gray-500 truncate">{email}</Text>
        </div>
        <div className="flex items-center gap-1">
          <Phone size={10} className="text-gray-400" />
          <Text variant="tiny" className="text-gray-500 truncate">{phone}</Text>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-1">
        <RoleBadge role={user.role} />
        <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{departmentDisplay}</span>
      </div>
      
      <div className="flex justify-end gap-1 pt-1">
        <button onClick={() => onView(staff)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="View"><Eye size={12} /></button>
        {isAdmin && (
          <>
            <button onClick={() => onEdit(staff)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Edit"><Edit2 size={12} /></button>
            <button onClick={() => onResetPassword(staff)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Reset Password"><Lock size={12} /></button>
            {isActive ? (
              <button onClick={() => onArchive(staff)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Archive"><UserX size={12} /></button>
            ) : (
              <button onClick={() => onRestore(staff)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Restore"><UserCheck size={12} /></button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};