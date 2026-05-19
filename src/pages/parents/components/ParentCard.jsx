// src/pages/parents/components/ParentCard.jsx - FIXED

import React from 'react';
import { Text, Card } from '../../../components/ui';
import { User, Eye, Edit2, Lock, UserX, Users, Phone, Mail, Shield, Award, UserCheck, RefreshCw } from 'lucide-react';

const StatusBadge = ({ isActive }) => {
  if (!isActive) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-red-100 text-red-700"><UserX size={10} /> Archived</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-700"><UserCheck size={10} /> Active</span>;
};

const ParentTypeBadge = ({ parentType }) => {
  const config = {
    father: 'bg-blue-100 text-blue-700',
    mother: 'bg-pink-100 text-pink-700',
    guardian: 'bg-purple-100 text-purple-700',
    relative: 'bg-orange-100 text-orange-700',
    other: 'bg-gray-100 text-gray-700'
  };
  const typeKey = parentType || 'other';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium ${config[typeKey]}`}>{typeKey.charAt(0).toUpperCase() + typeKey.slice(1)}</span>;
};

export const ParentCard = ({ parent, onView, onEdit, onResetPassword, onArchive, onRestore, isAdmin }) => {
  // Get name from multiple possible sources
  const fullName = parent.full_name || 
                   parent.user?.full_name || 
                   `${parent.user?.first_name || ''} ${parent.user?.last_name || ''}`.trim() || 
                   parent.name || 
                   'Unknown Parent';
  
  const email = parent.email || parent.user?.email || 'No email';
  const phone = parent.phone || parent.user?.phone_number || 'No phone';
  const childrenCount = parent.children_count || parent.children?.length || 0;
  const isActive = parent.is_active !== false;
  const imageUrl = parent.profile_picture || parent.user?.profile_picture || null;

  return (
    <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={fullName} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <User size={14} className="text-blue-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Text variant="tiny" className="font-bold text-gray-800 truncate">{fullName}</Text>
            <Text variant="caption" className="text-gray-400 truncate text-[8px]">{parent.parent_id || 'No ID'}</Text>
          </div>
        </div>
        <StatusBadge isActive={isActive} />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <ParentTypeBadge parentType={parent.parent_type} />
          <div className="flex items-center gap-1">
            <Users size={10} className="text-gray-400" />
            <Text variant="tiny" className="text-gray-500">{childrenCount} child{childrenCount !== 1 ? 'ren' : ''}</Text>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-gray-500 truncate">
        {email}
      </div>

      <div className="flex justify-end gap-1 pt-1">
        <button onClick={() => onView(parent)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="View">
          <Eye size={12} />
        </button>
        {isAdmin && (
          <>
            <button onClick={() => onEdit(parent)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
              <Edit2 size={12} />
            </button>
            <button onClick={() => onResetPassword(parent)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Reset Password">
              <Lock size={12} />
            </button>
            {isActive ? (
              <button onClick={() => onArchive(parent)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Archive">
                <UserX size={12} />
              </button>
            ) : (
              <button onClick={() => onRestore(parent)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Restore">
                <RefreshCw size={12} />
              </button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};