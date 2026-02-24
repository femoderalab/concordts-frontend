// import React from 'react';
// import { Users, GraduationCap, UserCog, Briefcase } from 'lucide-react';

// const StatCard = ({
//   title,
//   value,
//   icon,
//   color = 'primary',
//   trend,
//   loading = false,
// }) => {
//   const colorClasses = {
//     primary: {
//       bg: 'bg-primary-50',
//       icon: 'bg-primary-500',
//       text: 'text-primary-700',
//       trend: 'text-primary-600',
//     },
//     success: {
//       bg: 'bg-green-50',
//       icon: 'bg-green-500',
//       text: 'text-green-700',
//       trend: 'text-green-600',
//     },
//     warning: {
//       bg: 'bg-yellow-50',
//       icon: 'bg-yellow-500',
//       text: 'text-yellow-700',
//       trend: 'text-yellow-600',
//     },
//     info: {
//       bg: 'bg-blue-50',
//       icon: 'bg-blue-500',
//       text: 'text-blue-700',
//       trend: 'text-blue-600',
//     },
//     secondary: {
//       bg: 'bg-secondary-50',
//       icon: 'bg-secondary-500',
//       text: 'text-secondary-700',
//       trend: 'text-secondary-600',
//     },
//   };

//   const currentColor = colorClasses[color] || colorClasses.primary;

//   // Default icons for common stats
//   const getDefaultIcon = () => {
//     if (icon) return icon;
    
//     switch (title?.toLowerCase()) {
//       case 'total users':
//         return <Users size={24} />;
//       case 'total students':
//         return <GraduationCap size={24} />;
//       case 'total teachers':
//         return <UserCog size={24} />;
//       case 'total staff':
//         return <Briefcase size={24} />;
//       default:
//         return <Users size={24} />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-soft p-6 animate-pulse">
//         <div className="flex items-center justify-between">
//           <div className="flex-1">
//             <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
//             <div className="h-8 bg-gray-200 rounded w-16"></div>
//           </div>
//           <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 p-6 border border-gray-100">
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
//           <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
          
//           {trend && (
//             <div className="flex items-center mt-2">
//               <span className={`text-sm font-medium ${currentColor.trend}`}>
//                 {trend}
//               </span>
//             </div>
//           )}
//         </div>
        
//         <div className={`${currentColor.bg} p-3 rounded-lg`}>
//           <div className={`${currentColor.icon} text-white w-10 h-10 flex items-center justify-center rounded-lg`}>
//             {getDefaultIcon()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatCard;

import React from 'react';

const StatCard = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  loading = false,
  subtitle = '',
  percentage = null
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'bg-primary-500',
      text: 'text-primary-700',
      trend: 'text-primary-600',
      border: 'border-primary-100'
    },
    success: {
      bg: 'bg-green-50',
      icon: 'bg-green-500',
      text: 'text-green-700',
      trend: 'text-green-600',
      border: 'border-green-100'
    },
    warning: {
      bg: 'bg-yellow-50',
      icon: 'bg-yellow-500',
      text: 'text-yellow-700',
      trend: 'text-yellow-600',
      border: 'border-yellow-100'
    },
    info: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-500',
      text: 'text-blue-700',
      trend: 'text-blue-600',
      border: 'border-blue-100'
    },
    secondary: {
      bg: 'bg-secondary-50',
      icon: 'bg-secondary-500',
      text: 'text-secondary-700',
      trend: 'text-secondary-600',
      border: 'border-secondary-100'
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'bg-emerald-500',
      text: 'text-emerald-700',
      trend: 'text-emerald-600',
      border: 'border-emerald-100'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-500',
      text: 'text-purple-700',
      trend: 'text-purple-600',
      border: 'border-purple-100'
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'bg-amber-500',
      text: 'text-amber-700',
      trend: 'text-amber-600',
      border: 'border-amber-100'
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'bg-indigo-500',
      text: 'text-indigo-700',
      trend: 'text-indigo-600',
      border: 'border-indigo-100'
    }
  };

  const currentColor = colorClasses[color] || colorClasses.primary;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-6 animate-pulse border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-32"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 p-6 border border-gray-100 group hover:border-primary-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {percentage !== null && (
              <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${currentColor.bg} ${currentColor.text}`}>
                {percentage}%
              </span>
            )}
          </div>
          
          {subtitle && (
            <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
          )}
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${currentColor.trend}`}>
                {trend}
              </span>
            </div>
          )}
        </div>
        
        <div className={`${currentColor.bg} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
          <div className={`${currentColor.icon} text-white w-10 h-10 flex items-center justify-center rounded-lg`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;