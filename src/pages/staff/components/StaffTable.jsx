// src/pages/staff/components/StaffTable.jsx
import React from 'react';
import { Text } from '../../../components/ui';
import { User, Eye, Edit2, Lock, UserX, UserCheck, Shield, Briefcase, Mail, Phone, Users } from 'lucide-react';

const StatusBadge = ({ isActive, isRetired, isOnLeave }) => {
  if (!isActive) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-red-100 text-red-700"><UserX size={10} /> Inactive</span>;
  if (isRetired) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-purple-100 text-purple-700"><Shield size={10} /> Retired</span>;
  if (isOnLeave) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-yellow-100 text-yellow-700">On Leave</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-700"><UserCheck size={10} /> Active</span>;
};

const RoleBadge = ({ role }) => {
  const roleDisplay = { 'head': 'Head', 'hm': 'Head Master', 'principal': 'Principal', 'vice_principal': 'Vice Principal', 'teacher': 'Teacher', 'form_teacher': 'Form Teacher', 'subject_teacher': 'Subject Teacher', 'accountant': 'Accountant', 'secretary': 'Secretary' }[role] || role || 'Staff';
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-gray-100 text-gray-600">{roleDisplay}</span>;
};

const DepartmentBadge = ({ department }) => {
  const deptDisplay = { 'administration': 'Admin', 'academic': 'Academic', 'finance': 'Finance', 'library': 'Library', 'laboratory': 'Lab', 'ict': 'ICT', 'security': 'Security' }[department] || department || 'Staff';
  return <span className="inline-block px-2 py-0.5 text-[9px] font-medium bg-gray-100 text-gray-600 rounded">{deptDisplay}</span>;
};

export const StaffTable = ({ staff, onView, onEdit, onArchive, onRestore, onResetPassword, isAdmin }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Staff</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Staff ID</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Position</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Role/Dept</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {staff.map((staffMember) => {
            const user = staffMember.user || {};
            const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || staffMember.full_name || '—';
            const email = user.email || '—';
            const phone = user.phone_number || '—';
            const positionTitle = staffMember.position_title || '—';
            const staffId = staffMember.staff_id || '—';
            const imageUrl = staffMember.passport_photo || null;
            
            return (
              <tr key={staffMember.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {imageUrl ? <img src={imageUrl} alt={fullName} className="w-full h-full object-cover" /> : <User size={14} className="text-blue-600" />}
                    </div>
                    <div><Text variant="small" className="font-medium text-gray-800">{fullName}</Text></div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell"><Text variant="tiny" className="font-mono">{staffId}</Text></td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div><Text variant="tiny" className="text-gray-500">{email}</Text><Text variant="tiny" className="text-gray-400">{phone}</Text></div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell"><Text variant="tiny" className="text-gray-600">{positionTitle}</Text></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1"><RoleBadge role={user.role} /><DepartmentBadge department={staffMember.department} /></div>
                </td>
                <td className="px-4 py-3"><StatusBadge isActive={staffMember.is_active} isRetired={staffMember.is_retired} isOnLeave={staffMember.is_on_leave} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onView(staffMember)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title="View"><Eye size={14} /></button>
                    {isAdmin && (
                      <>
                        <button onClick={() => onEdit(staffMember)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title="Edit"><Edit2 size={14} /></button>
                        <button onClick={() => onResetPassword(staffMember)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title="Reset Password"><Lock size={14} /></button>
                        {staffMember.is_active ? (
                          <button onClick={() => onArchive(staffMember)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Archive"><UserX size={14} /></button>
                        ) : (
                          <button onClick={() => onRestore(staffMember)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg" title="Restore"><UserCheck size={14} /></button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};