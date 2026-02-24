import React from 'react';

const StaffStatusBadge = ({ staff }) => {
  const getStatusInfo = () => {
    if (!staff.is_active) {
      return { text: 'Inactive', color: 'bg-red-100 text-red-800' };
    }
    
    if (staff.is_on_leave) {
      return { text: 'On Leave', color: 'bg-yellow-100 text-yellow-800' };
    }
    
    if (staff.is_on_probation) {
      return { text: 'Probation', color: 'bg-blue-100 text-blue-800' };
    }
    
    if (staff.is_retired) {
      return { text: 'Retired', color: 'bg-purple-100 text-purple-800' };
    }
    
    return { text: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const status = getStatusInfo();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
      {status.text}
    </span>
  );
};

export default StaffStatusBadge;