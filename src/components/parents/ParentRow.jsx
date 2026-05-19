/**
 * Parent Row Component - Table/list view for parent list
 * WITH REGISTRATION NUMBER
 */

import React from 'react';
import { Eye, Edit2, Lock, UserX, User, Phone, Mail, Users, Shield, CreditCard } from 'lucide-react';

const ParentRow = ({ parent, onView, onEdit, onPassword, onArchive, canEdit }) => {
  const fullName = parent.full_name || 'Unknown Parent';
  const email = parent.email || 'Not provided';
  const phone = parent.phone || 'Not provided';
  const registrationNumber = parent.registration_number || parent.user?.registration_number || 'N/A';
  const childrenCount = parent.children_count || parent.children?.length || 0;
  const occupation = parent.occupation || 'Not specified';
  const parentId = parent.parent_id || parent.id || 'N/A';
  const isActive = parent.is_active !== false;
  const isVerified = parent.is_verified || false;
  const imageUrl = parent.profile_picture || parent.user?.profile_picture || null;

  const getParentTypeBadge = () => {
    const config = {
      father: 'bg-blue-100 text-blue-700',
      mother: 'bg-pink-100 text-pink-700',
      guardian: 'bg-purple-100 text-purple-700',
      relative: 'bg-orange-100 text-orange-700',
      other: 'bg-gray-100 text-gray-700',
    };
    const typeKey = parent.parent_type || 'other';
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${config[typeKey] || config.other}`}>
        {typeKey.charAt(0).toUpperCase() + typeKey.slice(1)}
      </span>
    );
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <button onClick={() => onView(parent)} className="text-left hover:text-secondary-700 transition-colors w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-secondary-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<User size={16} className="text-secondary-600" />'; }}
                />
              ) : (
                <User size={16} className="text-secondary-600" />
              )}
            </div>
            <div>
              <div className="font-medium text-gray-800 text-sm">{fullName}</div>
              <div className="text-xs text-gray-400">ID: {parentId}</div>
              {/* NEW: Registration Number */}
              <div className="text-[10px] text-gray-500 font-mono">Reg: {registrationNumber}</div>
            </div>
          </div>
        </button>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col gap-1">
          {getParentTypeBadge()}
          <div className="text-xs text-gray-500">{occupation}</div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <Users size={14} className="text-gray-400" />
          <span>{childrenCount}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Phone size={12} className="text-gray-400" />
            <span className="truncate">{phone}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Mail size={12} className="text-gray-400" />
            <span className="truncate">{email}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {!isActive && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">
              Archived
            </span>
          )}
          {isVerified && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
              Verified
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(parent)}
            className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={14} />
          </button>
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(parent)}
                className="p-1.5 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 rounded-lg transition-colors"
                title="Edit Parent"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onPassword(parent)}
                className="p-1.5 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 rounded-lg transition-colors"
                title="Reset Password"
              >
                <Lock size={14} />
              </button>
              <button
                onClick={() => onArchive(parent)}
                className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                title="Archive Parent"
              >
                <UserX size={14} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ParentRow;