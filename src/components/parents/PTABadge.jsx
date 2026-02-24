// src/components/parents/PTABadge.jsx
import React from 'react';

const PTABadge = ({ isPTAMember }) => {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${isPTAMember ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
      {isPTAMember ? 'PTA Member' : 'Not PTA'}
    </span>
  );
};

export default PTABadge;