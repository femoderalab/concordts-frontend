/**
 * Parent Card Component - Card view for parent list
 */

import React from 'react';
import { Eye, Edit2, Lock, UserX, User, Phone, Mail, Users, Shield } from 'lucide-react';

const ParentCard = ({ parent, onView, onEdit, onPassword, onArchive, canEdit }) => {
  const fullName = parent.full_name || 'Unknown Parent';
  const email = parent.email || 'Not provided';
  const phone = parent.phone || 'Not provided';
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
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${config[typeKey] || config.other}`}>
        {typeKey.charAt(0).toUpperCase() + typeKey.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 group">
      {/* Header with image */}
      <div className="p-4 pb-2">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={fullName}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<User size={24} className="text-secondary-600" />'; }}
              />
            ) : (
              <User size={24} className="text-secondary-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-extrabold text-gray-900 truncate">{fullName}</h3>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">ID: {parentId}</p>
            <div className="flex items-center gap-2 mt-1">
              {getParentTypeBadge()}
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
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 pb-3 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Phone size={12} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail size={12} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Users size={12} className="text-gray-400 flex-shrink-0" />
          <span>{childrenCount} child{childrenCount !== 1 ? 'ren' : ''}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield size={12} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{occupation}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-end gap-1">
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
    </div>
  );
};

export default ParentCard;