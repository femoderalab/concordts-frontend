// import React from 'react';

// const Badge = ({ children, variant = 'default', className = '' }) => {
//   const variants = {
//     default: 'bg-gray-100 text-gray-800',
//     primary: 'bg-primary-100 text-primary-800',
//     success: 'bg-green-100 text-green-800',
//     warning: 'bg-yellow-100 text-yellow-800',
//     danger: 'bg-red-100 text-red-800',
//     info: 'bg-blue-100 text-blue-800',
//   };

//   return (
//     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
//       {children}
//     </span>
//   );
// };

// export default Badge;

// src/components/common/Badge.jsx
import React from 'react';

const Badge = ({ children, type = 'neutral', className = '' }) => {
  const typeClasses = {
    primary: 'bg-primary-100 text-primary-800 border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-800 border-secondary-200',
    accent: 'bg-accent-100 text-accent-800 border-accent-200',
    success: 'bg-success-100 text-success-800 border-success-200',
    warning: 'bg-warning-100 text-warning-800 border-warning-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-neutral-100 text-neutral-800 border-neutral-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeClasses[type]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;