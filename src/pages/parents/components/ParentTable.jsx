// src/pages/parents/components/ParentTable.jsx - FIXED

import React from 'react';
import { Text } from '../../../components/ui';
import { User, Eye, Edit2, Lock, UserX, Users, Phone, Mail, RefreshCw } from 'lucide-react';

const StatusBadge = ({ isActive }) => {
  if (!isActive) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-red-100 text-red-700"><UserX size={10} /> Archived</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-700">Active</span>;
};

export const ParentTable = ({ parents, onView, onEdit, onResetPassword, onArchive, onRestore, isAdmin }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Parent</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase hidden sm:table-cell">Type</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase hidden md:table-cell">Children</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase hidden lg:table-cell">Contact</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {parents.map((parent) => {
            const fullName = parent.full_name || 
                           parent.user?.full_name || 
                           `${parent.user?.first_name || ''} ${parent.user?.last_name || ''}`.trim() || 
                           'Unknown Parent';
            const email = parent.email || parent.user?.email || 'No email';
            const phone = parent.phone || parent.user?.phone_number || 'No phone';
            const childrenCount = parent.children_count || parent.children?.length || 0;
            const imageUrl = parent.profile_picture || parent.user?.profile_picture || null;
            const isActive = parent.is_active !== false;

            return (
              <tr key={parent.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={fullName} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <User size={14} className="text-blue-600" />
                      )}
                    </div>
                    <div>
                      <Text variant="small" className="font-medium text-gray-800">{fullName}</Text>
                      <Text variant="tiny" className="text-gray-400">{parent.parent_id || 'No ID'}</Text>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`inline-flex px-2 py-1 rounded text-[10px] font-medium bg-blue-100 text-blue-700`}>
                    {parent.parent_type?.charAt(0).toUpperCase() + parent.parent_type?.slice(1) || 'Other'}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <Users size={12} className="text-gray-400" />
                    <Text variant="tiny" className="text-gray-600">{childrenCount} child{childrenCount !== 1 ? 'ren' : ''}</Text>
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1"><Phone size={10} className="text-gray-400" /><Text variant="tiny" className="text-gray-500">{phone}</Text></div>
                    <div className="flex items-center gap-1"><Mail size={10} className="text-gray-400" /><Text variant="tiny" className="text-gray-500 truncate max-w-[120px]">{email}</Text></div>
                  </div>
                </td>
                <td className="px-4 py-3"><StatusBadge isActive={isActive} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onView(parent)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title="View"><Eye size={14} /></button>
                    {isAdmin && (
                      <>
                        <button onClick={() => onEdit(parent)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title="Edit"><Edit2 size={14} /></button>
                        <button onClick={() => onResetPassword(parent)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title="Reset Password"><Lock size={14} /></button>
                        {isActive ? (
                          <button onClick={() => onArchive(parent)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Archive"><UserX size={14} /></button>
                        ) : (
                          <button onClick={() => onRestore(parent)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg" title="Restore"><RefreshCw size={14} /></button>
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