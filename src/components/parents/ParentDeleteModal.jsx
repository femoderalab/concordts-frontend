/**
 * Parent Archive Modal Component
 */

import React, { useState } from 'react';
import { Trash2, XCircle, AlertTriangle } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/modal';

const ParentDeleteModal = ({ isOpen, onClose, onConfirm, parent, loading }) => {
  const [reason, setReason] = useState('');
  const [isArchiving, setIsArchiving] = useState(false);

  const handleConfirm = () => {
    setIsArchiving(true);
    onConfirm(reason);
    setTimeout(() => {
      setIsArchiving(false);
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Archive Parent" size="sm">
      <div className="py-4">
        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        
        <h3 className="text-center text-base font-extrabold text-gray-900 mb-1">
          Archive {parent?.full_name || parent?.user?.first_name}?
        </h3>
        
        <p className="text-center text-sm text-gray-500 mb-4">
          This parent will no longer be able to log in to the parent portal.
          The account can be restored later.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
          <div className="flex items-start gap-2">
            <XCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-yellow-800">What happens when you archive?</p>
              <ul className="text-xs text-yellow-700 mt-1 space-y-0.5">
                <li>• Parent cannot log in to portal</li>
                <li>• All children relationships are preserved</li>
                <li>• Parent can be restored later</li>
                <li>• Historical records remain intact</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Reason for archiving (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="2"
            placeholder="e.g., Parent requested account deactivation, no longer has children in school..."
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all"
          />
        </div>
        
        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            loading={loading || isArchiving} 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {loading || isArchiving ? 'Archiving...' : 'Archive Parent'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ParentDeleteModal;