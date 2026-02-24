// /**
//  * Reusable Loader Component
//  * Displays loading spinner with optional text and overlay
//  */

// import React from 'react';

// /**
//  * Loader component for loading states
//  * @param {Object} props - Component props
//  * @param {string} props.size - Spinner size (sm, md, lg, xl)
//  * @param {string} props.text - Loading text to display
//  * @param {boolean} props.fullScreen - Show as full screen overlay
//  * @param {string} props.className - Additional CSS classes
//  * @param {string} props.color - Spinner color (primary, white, secondary)
//  */
// const Loader = ({
//   size = 'md',
//   text = '',
//   fullScreen = false,
//   className = '',
//   color = 'primary',
// }) => {
//   // Size variants for spinner
//   const sizeClasses = {
//     sm: 'w-6 h-6 border-2',
//     md: 'w-10 h-10 border-3',
//     lg: 'w-16 h-16 border-4',
//     xl: 'w-24 h-24 border-4',
//   };

//   // Color variants
//   const colorClasses = {
//     primary: 'border-primary-200 border-t-primary-600',
//     white: 'border-white/30 border-t-white',
//     secondary: 'border-secondary-200 border-t-secondary-600',
//   };

//   // Spinner element
//   const spinner = (
//     <div
//       className={`
//         ${sizeClasses[size]} 
//         ${colorClasses[color]} 
//         rounded-full 
//         animate-spin
//       `}
//       role="status"
//       aria-label="Loading"
//     />
//   );

//   // Full screen overlay variant
//   if (fullScreen) {
//     return (
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center space-y-4">
//           {spinner}
//           {text && (
//             <p className="text-gray-700 font-medium text-lg">{text}</p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Inline variant
//   return (
//     <div className={`flex flex-col items-center justify-center ${className}`}>
//       {spinner}
//       {text && (
//         <p className="mt-3 text-gray-600 font-medium">{text}</p>
//       )}
//     </div>
//   );
// };

// /**
//  * Simple spinner without wrapper
//  * Useful for inline loading states
//  */
// export const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
//   const sizeClasses = {
//     xs: 'w-4 h-4 border-2',
//     sm: 'w-6 h-6 border-2',
//     md: 'w-8 h-8 border-3',
//     lg: 'w-12 h-12 border-3',
//   };

//   const colorClasses = {
//     primary: 'border-primary-200 border-t-primary-600',
//     white: 'border-white/30 border-t-white',
//     secondary: 'border-secondary-200 border-t-secondary-600',
//   };

//   return (
//     <div
//       className={`
//         ${sizeClasses[size]} 
//         ${colorClasses[color]} 
//         rounded-full 
//         animate-spin
//         ${className}
//       `}
//       role="status"
//       aria-label="Loading"
//     />
//   );
// };

// /**
//  * Skeleton loader for content placeholders
//  * Shows a pulsing placeholder while content loads
//  */
// export const Skeleton = ({ 
//   width = '100%', 
//   height = '20px', 
//   className = '',
//   variant = 'text' // text, circular, rectangular
// }) => {
//   const variantClasses = {
//     text: 'rounded',
//     circular: 'rounded-full',
//     rectangular: 'rounded-lg',
//   };

//   return (
//     <div
//       className={`
//         bg-gray-200 
//         animate-pulse 
//         ${variantClasses[variant]}
//         ${className}
//       `}
//       style={{ width, height }}
//       aria-label="Loading content"
//     />
//   );
// };

// /**
//  * Page loader - centered on page
//  */
// export const PageLoader = ({ text = 'Loading...' }) => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="text-center">
//         <Loader size="lg" color="primary" />
//         <p className="mt-4 text-gray-600 font-medium text-lg">{text}</p>
//       </div>
//     </div>
//   );
// };

// /**
//  * Button loader - small spinner for buttons
//  */
// export const ButtonLoader = () => {
//   return (
//     <Spinner size="sm" color="white" className="mr-2" />
//   );
// };

// export default Loader;

import React from 'react';

const Loader = ({
  size = 'md',
  text = '',
  fullScreen = false,
  className = '',
  color = 'primary',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4',
  };

  const colorClasses = {
    primary: 'border-[#2b2f83]/30 border-t-[#2b2f83]',
    white: 'border-white/30 border-t-white',
    secondary: 'border-secondary-200 border-t-secondary-600',
  };

  const spinner = (
    <div
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        rounded-full 
        animate-spin
      `}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center space-y-4">
          {spinner}
          {text && (
            <p className="text-gray-700 font-medium text-lg">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {spinner}
      {text && (
        <p className="mt-3 text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );
};

export const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-3',
  };

  const colorClasses = {
    primary: 'border-[#2b2f83]/30 border-t-[#2b2f83]',
    white: 'border-white/30 border-t-white',
    secondary: 'border-secondary-200 border-t-secondary-600',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        rounded-full 
        animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
};

export const Skeleton = ({ 
  width = '100%', 
  height = '20px', 
  className = '',
  variant = 'text'
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`
        bg-gray-200 
        animate-pulse 
        ${variantClasses[variant]}
        ${className}
      `}
      style={{ width, height }}
      aria-label="Loading content"
    />
  );
};

export const PageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader size="lg" color="primary" />
        <p className="mt-4 text-gray-600 font-medium text-lg">{text}</p>
      </div>
    </div>
  );
};

export const ButtonLoader = () => {
  return (
    <Spinner size="sm" color="white" className="mr-2" />
  );
};

export default Loader;