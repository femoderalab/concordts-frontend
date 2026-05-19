// src/pages/students/components/StudentTable.jsx - COMPLETE CORRECTED VERSION

import React from 'react';
import { Text } from '../../../components/ui';
import { 
  User, Eye, Edit2, Trash2, Lock, CheckCircle, XCircle, Activity, 
  Shield, UserCheck, UserX, Award, Archive, RefreshCw  // ✅ Added Archive and RefreshCw
} from 'lucide-react';

const StatusBadge = ({ isActive, isGraduated }) => {
  if (!isActive) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-red-100 text-red-700">
        <UserX size={10} /> Archived
      </span>
    );
  }
  if (isGraduated) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-purple-100 text-purple-700">
        <Award size={10} /> Graduated
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-700">
      <UserCheck size={10} /> Active
    </span>
  );
};

const FeeBadge = ({ feeStatus }) => {
  const config = {
    paid_full: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={10} />, label: 'Paid' },
    paid_partial: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Activity size={10} />, label: 'Partial' },
    not_paid: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={10} />, label: 'Unpaid' },
    scholarship: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Shield size={10} />, label: 'Scholarship' },
    exempted: { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Shield size={10} />, label: 'Exempted' }
  };
  const c = config[feeStatus] || config.not_paid;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium ${c.bg} ${c.text}`}>
      {c.icon} {c.label}
    </span>
  );
};

export const StudentTable = ({ 
  students, 
  onView, 
  onEdit, 
  onArchive,      // For archiving active students
  onRestore,      // For restoring archived students
  onResetPassword, 
  isAdmin, 
  formatCurrency 
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Student</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Admission</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Class</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Balance</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Fee Status</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {students.map((student) => {
            const firstName = student.first_name || student.user?.first_name || '—';
            const lastName = student.last_name || student.user?.last_name || '—';
            const fullName = `${firstName} ${lastName}`.trim() || student.full_name || '—';
            const email = student.email || student.user?.email || 'No email';
            const classLevelName = student.class_level_name || student.class_level?.name || 'Not assigned';
            const admissionNumber = student.admission_number || '—';
            const imageUrl = student.student_image_url || null;
            const totalFee = student.total_fee_amount || 0;
            const amountPaid = student.amount_paid || 0;
            const balanceDue = totalFee - amountPaid;
            
            return (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={fullName} className="w-full h-full object-cover" />
                      ) : (
                        <User size={14} className="text-blue-600" />
                      )}
                    </div>
                    <div>
                      <Text variant="small" className="font-medium text-gray-800">{fullName}</Text>
                      <Text variant="tiny" className="text-gray-400">{email}</Text>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <Text variant="tiny" className="font-mono">{admissionNumber}</Text>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <Text variant="small" className="text-gray-700">{classLevelName}</Text>
                </td>
                <td className="px-4 py-3">
                  <Text variant="small" className="font-bold text-red-600">{formatCurrency(balanceDue)}</Text>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <FeeBadge feeStatus={student.fee_status} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge isActive={student.is_active} isGraduated={student.is_graduated} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onView(student)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                      <Eye size={14} />
                    </button>
                    {isAdmin && (
                      <>
                        <button onClick={() => onEdit(student)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => onResetPassword(student)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Reset Password">
                          <Lock size={14} />
                        </button>
                        {student.is_active ? (
                          <button onClick={() => onArchive(student)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Archive">
                            <Archive size={14} />
                          </button>
                        ) : (
                          <button onClick={() => onRestore(student)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Restore">
                            <RefreshCw size={14} />
                          </button>
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