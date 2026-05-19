// src/pages/students/components/StudentCard.jsx - UPDATE imports

import React from 'react';
import { Text, Card } from '../../../components/ui';
import { 
  User, Eye, Edit2, Trash2, Lock, CheckCircle, XCircle, Activity, 
  Shield, UserCheck, UserX, Award, Archive, RefreshCw  // ADD Archive and RefreshCw
} from 'lucide-react';

const StatusBadge = ({ isActive, isGraduated }) => {
  if (!isActive) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-red-100 text-red-700">
        <UserX size={10} /> Inactive
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

export const StudentCard = ({ student, onView, onEdit, onDelete, onResetPassword, isAdmin, formatCurrency }) => {
  const firstName = student.first_name || student.user?.first_name || '—';
  const lastName = student.last_name || student.user?.last_name || '—';
  const fullName = `${firstName} ${lastName}`.trim() || student.full_name || '—';
  const classLevelName = student.class_level_name || student.class_level?.name || 'Not assigned';
  const admissionNumber = student.admission_number || '—';
  const imageUrl = student.student_image_url || null;
  const totalFee = student.total_fee_amount || 0;
  const amountPaid = student.amount_paid || 0;
  const balanceDue = totalFee - amountPaid;

  return (
    <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <User size={14} className="text-blue-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Text variant="tiny" className="font-bold text-gray-800 truncate">{fullName}</Text>
            <Text variant="caption" className="text-gray-400 truncate text-[8px]">{admissionNumber}</Text>
          </div>
        </div>
        <StatusBadge isActive={student.is_active} isGraduated={student.is_graduated} />
      </div>
      
      <div>
        <Text variant="tiny" className="text-gray-500">{classLevelName}</Text>
        <div className="flex items-center justify-between mt-1">
          <FeeBadge feeStatus={student.fee_status} />
          <Text variant="tiny" className="font-bold text-red-500">{formatCurrency(balanceDue)}</Text>
        </div>
      </div>
      
      <div className="flex justify-end gap-1 pt-1">
  <button onClick={() => onView(student)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="View">
    <Eye size={12} />
  </button>
  {isAdmin && (
    <>
      <button onClick={() => onEdit(student)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
        <Edit2 size={12} />
      </button>
      <button onClick={() => onResetPassword(student)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Reset Password">
        <Lock size={12} />
      </button>
      {student.is_active ? (
        <button onClick={() => onArchive(student)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Archive">
          <Archive size={12} />
        </button>
      ) : (
        <button onClick={() => onRestore(student)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Restore">
          <RefreshCw size={12} />
        </button>
      )}
    </>
  )}
</div>
    </Card>
  );
};