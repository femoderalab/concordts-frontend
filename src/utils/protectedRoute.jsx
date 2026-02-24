
// /**
//  * ProtectedRoute Component
//  * Comprehensive route guard with role-based access control,
//  * permission checks, and advanced routing features
//  */

// import React, { useEffect } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
// import { PageLoader } from '../components/common/Loader';

// /**
//  * Permission configuration for different user roles
//  */
// const PERMISSIONS = {
//   // Admin permissions (full access)
//   admin: {
//     routes: ['*'], // All routes
//     features: ['*'], // All features
//   },
  
//   // Head Master permissions (same as principal)
//   hm: {
//     routes: ['*'], // All routes
//     features: ['*'], // All features
//   },
  
//   // Principal permissions
//   principal: {
//     routes: ['*'], // All routes
//     features: ['*'], // All features
//   },
  
//   // Vice Principal permissions
//   vice_principal: {
//     routes: ['*'], // All routes
//     features: ['*'], // All features
//   },
  
//   // Teacher permissions
//   teacher: {
//     routes: ['/dashboard', '/students', '/academics/classes', '/reports/attendance', '/reports/results'],
//     features: ['view_students', 'manage_attendance', 'view_grades'],
//   },
  
//   // Form Teacher permissions (same as teacher but with more access)
//   form_teacher: {
//     routes: ['/dashboard', '/students', '/academics/classes', '/reports/attendance', '/reports/results'],
//     features: ['view_students', 'manage_attendance', 'view_grades', 'manage_class'],
//   },
  
//   // Subject Teacher permissions
//   subject_teacher: {
//     routes: ['/dashboard', '/students', '/academics/classes', '/reports/attendance', '/reports/results'],
//     features: ['view_students', 'manage_attendance', 'view_grades'],
//   },
  
//   // Parent permissions
//   parent: {
//     routes: ['/dashboard', '/parents/dashboard', '/parents', '/parents/:id', '/parents/:id/update'],
//     features: ['view_children', 'view_grades', 'view_attendance', 'make_payments'],
//   },
  
//   // Student permissions
//   student: {
//     routes: ['/student-dashboard', '/profile', '/settings'],
//     features: ['view_grades', 'view_attendance', 'view_schedule'],
//   },
  
//   // Accountant permissions
//   accountant: {
//     routes: ['/dashboard', '/students', '/parents', '/reports', '/finance'],
//     features: ['manage_fees', 'view_financial_reports', 'process_payments'],
//   },
  
//   // Secretary permissions
//   secretary: {
//     routes: ['/dashboard', '/students', '/parents', '/staff/secretary'],
//     features: ['manage_registrations', 'view_records', 'send_notifications'],
//   },
  
//   // Librarian permissions
//   librarian: {
//     routes: ['/dashboard'],
//     features: ['manage_library'],
//   },
  
//   // Laboratory Technician permissions
//   laboratory: {
//     routes: ['/dashboard'],
//     features: ['manage_lab'],
//   },
  
//   // Security permissions
//   security: {
//     routes: ['/dashboard'],
//     features: ['view_schedule'],
//   },
  
//   // Cleaner permissions
//   cleaner: {
//     routes: ['/dashboard'],
//     features: ['view_schedule'],
//   },
// };

// /**
//  * Check if route matches pattern
//  * @param {string} route - Current route
//  * @param {string} pattern - Route pattern (can include wildcards)
//  * @returns {boolean} - True if route matches pattern
//  */
// const routeMatches = (route, pattern) => {
//   if (pattern === '*') return true;
  
//   // Convert pattern to regex
//   const regexPattern = pattern
//     .replace(/\*/g, '.*') // Convert * to .*
//     .replace(/:\w+/g, '([^/]+)'); // Convert :param to capture group
  
//   const regex = new RegExp(`^${regexPattern}$`);
//   return regex.test(route);
// };

// /**
//  * Check if user has permission for a route
//  * @param {Object} user - User object
//  * @param {string} route - Route to check
//  * @param {Array<string>} requiredFeatures - Required features
//  * @returns {boolean} - True if user has permission
//  */
// const hasPermission = (user, route, requiredFeatures = []) => {
//   if (!user) return false;
  
//   const userRole = user.role;
//   const userPermissions = PERMISSIONS[userRole] || {};
  
//   // If no permissions defined for role, deny access
//   if (!userPermissions.routes) return false;
  
//   // Check route permission
//   const hasRoutePermission = userPermissions.routes.some(pattern => 
//     routeMatches(route, pattern)
//   );
  
//   if (!hasRoutePermission) return false;
  
//   // Check feature permissions
//   if (requiredFeatures.length > 0 && userPermissions.features) {
//     const hasAllFeatures = requiredFeatures.every(feature => 
//       userPermissions.features.includes(feature) || 
//       userPermissions.features.includes('*')
//     );
    
//     if (!hasAllFeatures) return false;
//   }
  
//   return true;
// };

// /**
//  * Protected route wrapper
//  * Enhanced with advanced permission checking and route guarding
//  * @param {Object} props - Component props
//  */
// const ProtectedRoute = ({
//   children,
//   allowedRoles = [],
//   requiredFeatures = [],
//   redirectTo = '/login',
//   unauthorizedRedirect = '/unauthorized',
//   requireVerification = false,
//   requireActive = true,
// }) => {
//   const { user, loading, isAuthenticated } = useAuth();
//   const location = useLocation();
//   const currentPath = location.pathname;

//   // Show loader while checking authentication
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <PageLoader text="Checking authentication..." />
//       </div>
//     );
//   }

//   // Redirect to login if not authenticated
//   if (!isAuthenticated) {
//     // Save the attempted URL for redirect after login
//     sessionStorage.setItem('redirectAfterLogin', currentPath);
//     return <Navigate to={redirectTo} state={{ from: location }} replace />;
//   }

//   // Check if user account is active
//   if (requireActive && user && !user.is_active) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.928-.833-2.698 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Inactive</h2>
//           <p className="text-gray-600 mb-6">Your account has been deactivated. Please contact the administrator.</p>
//           <button
//             onClick={() => {
//               // Logout and redirect to login
//               sessionStorage.clear();
//               window.location.href = '/login';
//             }}
//             className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//           >
//             Return to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Check if user verification is required
//   if (requireVerification && user && !user.is_verified) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Verification Required</h2>
//           <p className="text-gray-600 mb-4">
//             Your account needs to be verified before you can access this page. 
//             Please check your email for verification instructions or contact the administrator.
//           </p>
//           <div className="space-y-3">
//             <button
//               onClick={() => window.location.href = '/dashboard'}
//               className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full"
//             >
//               Go to Dashboard
//             </button>
//             <button
//               onClick={() => {
//                 // Request verification email
//                 alert('Verification email requested. Please check your inbox.');
//               }}
//               className="px-6 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors w-full"
//             >
//               Request Verification Email
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Check role-based access if roles are specified
//   if (allowedRoles.length > 0 && user) {
//     const hasRequiredRole = allowedRoles.includes(user.role);
//     if (!hasRequiredRole) {
//       // User doesn't have required role
//       return <Navigate to={unauthorizedRedirect} state={{ from: location }} replace />;
//     }
//   }

//   // Check advanced permissions
//   if (user && !hasPermission(user, currentPath, requiredFeatures)) {
//     // User doesn't have required permissions
//     return <Navigate to={unauthorizedRedirect} state={{ from: location }} replace />;
//   }

//   // User is authenticated and has all required permissions
//   return children;
// };

// /**
//  * Admin-only route wrapper
//  * Enhanced with admin-specific checks
//  * Includes all administrative roles: head, hm, principal, vice_principal
//  */
// export const AdminRoute = ({ children, ...props }) => {
//   return (
//     <ProtectedRoute
//       allowedRoles={['head', 'hm', 'principal', 'vice_principal']}
//       requireVerification={true}
//       {...props}
//     >
//       {children}
//     </ProtectedRoute>
//   );
// };

// /**
//  * Teacher-only route wrapper
//  * Enhanced with teacher-specific features
//  * Includes all teaching roles
//  */
// export const TeacherRoute = ({ children, ...props }) => {
//   return (
//     <ProtectedRoute
//       allowedRoles={[
//         'head',
//         'hm',
//         'principal',
//         'vice_principal',
//         'teacher',
//         'form_teacher',
//         'subject_teacher',
//       ]}
//       requireActive={true}
//       {...props}
//     >
//       {children}
//     </ProtectedRoute>
//   );
// };

// /**
//  * Student-only route wrapper
//  * Enhanced with student-specific features
//  */
// export const StudentRoute = ({ children, ...props }) => {
//   return (
//     <ProtectedRoute
//       allowedRoles={['student']}
//       requireActive={true}
//       {...props}
//     >
//       {children}
//     </ProtectedRoute>
//   );
// };

// /**
//  * Parent-only route wrapper
//  * Enhanced with parent-specific features
//  */
// export const ParentRoute = ({ children, ...props }) => {
//   return (
//     <ProtectedRoute
//       allowedRoles={['parent']}
//       requireActive={true}
//       {...props}
//     >
//       {children}
//     </ProtectedRoute>
//   );
// };

// /**
//  * Staff route wrapper (non-teaching staff)
//  * Includes accountant, secretary, librarian, laboratory, security, cleaner
//  */
// export const StaffRoute = ({ children, ...props }) => {
//   return (
//     <ProtectedRoute
//       allowedRoles={[
//         'accountant',
//         'secretary',
//         'librarian',
//         'laboratory',
//         'security',
//         'cleaner'
//       ]}
//       requireActive={true}
//       {...props}
//     >
//       {children}
//     </ProtectedRoute>
//   );
// };

// /**
//  * Public route wrapper
//  * Enhanced with smart redirects
//  */
// export const PublicRoute = ({ 
//   children, 
//   redirectTo = '/dashboard',
//   redirectIfVerified = false,
// }) => {
//   const { user, loading, isAuthenticated } = useAuth();
//   const location = useLocation();

//   // Show loader while checking
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <PageLoader text="Loading..." />
//       </div>
//     );
//   }

//   // Redirect authenticated users
//   if (isAuthenticated && user) {
//     // Determine redirect based on role
//     let dashboardPath = '/dashboard';
//     if (user.role === 'student') {
//       dashboardPath = '/student-dashboard';
//     } else if (user.role === 'parent') {
//       dashboardPath = '/parents/dashboard';
//     }
    
//     // Special handling based on verification status
//     if (redirectIfVerified && user.is_verified) {
//       return <Navigate to={dashboardPath} replace />;
//     }
    
//     // Default redirect for authenticated users
//     return <Navigate to={dashboardPath} replace />;
//   }

//   // Not authenticated, show public page
//   return children;
// };

// /**
//  * Feature-based route wrapper
//  * Checks specific feature permissions
//  */
// export const FeatureRoute = ({ 
//   children, 
//   feature, 
//   redirectTo = '/unauthorized',
//   ...props 
// }) => {
//   const { user } = useAuth();
  
//   if (!user || !hasPermission(user, location.pathname, [feature])) {
//     return <Navigate to={redirectTo} replace />;
//   }
  
//   return children;
// };

// /**
//  * Department-based route wrapper
//  * Checks if user belongs to specific department
//  */
// export const DepartmentRoute = ({ 
//   children, 
//   department, 
//   redirectTo = '/unauthorized',
//   ...props 
// }) => {
//   const { user } = useAuth();
  
//   if (!user || user.department !== department) {
//     return <Navigate to={redirectTo} replace />;
//   }
  
//   return children;
// };

// /**
//  * Export all route components and helper functions
//  */
// export {
//   ProtectedRoute as default,
//   hasPermission,
//   routeMatches,
//   PERMISSIONS,
// };


/**
 * ProtectedRoute Component
 * Comprehensive route guard with role-based access control,
 * permission checks, and advanced routing features
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { PageLoader } from '../components/common/Loader';

/**
 * Permission configuration for different user roles
 * Admin roles (head, hm, principal, vice_principal) have full access.
 */
const PERMISSIONS = {
  // Admin roles – full access
  head: {
    routes: ['*'],
    features: ['*'],
  },
  hm: {
    routes: ['*'],
    features: ['*'],
  },
  principal: {
    routes: ['*'],
    features: ['*'],
  },
  vice_principal: {
    routes: ['*'],
    features: ['*'],
  },

  // Teaching staff
  teacher: {
    routes: [
      '/dashboard',
      '/students',
      '/academics/classes',
      '/reports/attendance',
      '/reports/results',
    ],
    features: ['view_students', 'manage_attendance', 'view_grades'],
  },
  form_teacher: {
    routes: [
      '/dashboard',
      '/students',
      '/academics/classes',
      '/reports/attendance',
      '/reports/results',
    ],
    features: ['view_students', 'manage_attendance', 'view_grades', 'manage_class'],
  },
  subject_teacher: {
    routes: [
      '/dashboard',
      '/students',
      '/academics/classes',
      '/reports/attendance',
      '/reports/results',
    ],
    features: ['view_students', 'manage_attendance', 'view_grades'],
  },

  // Parents
  parent: {
    routes: [
      '/dashboard',
      '/parents/dashboard',
      '/parents',
      '/parents/:id',
      '/parents/:id/update',
    ],
    features: ['view_children', 'view_grades', 'view_attendance', 'make_payments'],
  },

  // Students
  student: {
    routes: ['/student-dashboard', '/profile', '/settings'],
    features: ['view_grades', 'view_attendance', 'view_schedule'],
  },

  // Non‑teaching staff
  accountant: {
    routes: ['/dashboard', '/students', '/parents', '/reports', '/finance'],
    features: ['manage_fees', 'view_financial_reports', 'process_payments'],
  },
  secretary: {
    routes: ['/dashboard', '/students', '/parents', '/staff/secretary'],
    features: ['manage_registrations', 'view_records', 'send_notifications'],
  },
  librarian: {
    routes: ['/dashboard'],
    features: ['manage_library'],
  },
  laboratory: {
    routes: ['/dashboard'],
    features: ['manage_lab'],
  },
  security: {
    routes: ['/dashboard'],
    features: ['view_schedule'],
  },
  cleaner: {
    routes: ['/dashboard'],
    features: ['view_schedule'],
  },
};

/**
 * Check if route matches pattern
 * @param {string} route - Current route
 * @param {string} pattern - Route pattern (can include wildcards)
 * @returns {boolean} - True if route matches pattern
 */
const routeMatches = (route, pattern) => {
  if (pattern === '*') return true;

  // Convert pattern to regex
  const regexPattern = pattern
    .replace(/\*/g, '.*') // Convert * to .*
    .replace(/:\w+/g, '([^/]+)'); // Convert :param to capture group

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(route);
};

/**
 * Check if user has permission for a route
 * @param {Object} user - User object
 * @param {string} route - Route to check
 * @param {Array<string>} requiredFeatures - Required features
 * @returns {boolean} - True if user has permission
 */
const hasPermission = (user, route, requiredFeatures = []) => {
  if (!user) return false;

  const userRole = user.role;
  const userPermissions = PERMISSIONS[userRole] || {};

  // If no permissions defined for role, deny access
  if (!userPermissions.routes) return false;

  // Check route permission
  const hasRoutePermission = userPermissions.routes.some((pattern) =>
    routeMatches(route, pattern)
  );

  if (!hasRoutePermission) return false;

  // Check feature permissions
  if (requiredFeatures.length > 0 && userPermissions.features) {
    const hasAllFeatures = requiredFeatures.every(
      (feature) =>
        userPermissions.features.includes(feature) ||
        userPermissions.features.includes('*')
    );

    if (!hasAllFeatures) return false;
  }

  return true;
};

/**
 * Protected route wrapper
 * Enhanced with advanced permission checking and route guarding
 * @param {Object} props - Component props
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requiredFeatures = [],
  redirectTo = '/login',
  unauthorizedRedirect = '/unauthorized',
  requireVerification = false,
  requireActive = true,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader text="Checking authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirect after login
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user account is active
  if (requireActive && user && !user.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.928-.833-2.698 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Inactive</h2>
          <p className="text-gray-600 mb-6">
            Your account has been deactivated. Please contact the administrator.
          </p>
          <button
            onClick={() => {
              // Logout and redirect to login
              sessionStorage.clear();
              window.location.href = '/login';
            }}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Check if user verification is required
  if (requireVerification && user && !user.is_verified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Account Verification Required
          </h2>
          <p className="text-gray-600 mb-4">
            Your account needs to be verified before you can access this page.
            Please check your email for verification instructions or contact the
            administrator.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = '/dashboard')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                // Request verification email
                alert('Verification email requested. Please check your inbox.');
              }}
              className="px-6 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors w-full"
            >
              Request Verification Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && user) {
    const hasRequiredRole = allowedRoles.includes(user.role);
    if (!hasRequiredRole) {
      // User doesn't have required role
      return <Navigate to={unauthorizedRedirect} state={{ from: location }} replace />;
    }
  }

  // Check advanced permissions
  if (user && !hasPermission(user, currentPath, requiredFeatures)) {
    // User doesn't have required permissions
    return <Navigate to={unauthorizedRedirect} state={{ from: location }} replace />;
  }

  // User is authenticated and has all required permissions
  return children;
};

/**
 * Admin-only route wrapper
 * Enhanced with admin-specific checks
 * Includes all administrative roles: head, hm, principal, vice_principal
 */
export const AdminRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute
      allowedRoles={['head', 'hm', 'principal', 'vice_principal']}
      requireVerification={true}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Teacher-only route wrapper
 * Enhanced with teacher-specific features
 * Includes all teaching roles
 */
export const TeacherRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute
      allowedRoles={[
        'head',
        'hm',
        'principal',
        'vice_principal',
        'teacher',
        'form_teacher',
        'subject_teacher',
      ]}
      requireActive={true}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Student-only route wrapper
 * Enhanced with student-specific features
 */
export const StudentRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute
      allowedRoles={['student']}
      requireActive={true}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Parent-only route wrapper
 * Enhanced with parent-specific features
 */
export const ParentRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute
      allowedRoles={['parent']}
      requireActive={true}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Staff route wrapper (non-teaching staff)
 * Includes accountant, secretary, librarian, laboratory, security, cleaner
 */
export const StaffRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute
      allowedRoles={[
        'accountant',
        'secretary',
        'librarian',
        'laboratory',
        'security',
        'cleaner',
      ]}
      requireActive={true}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Public route wrapper
 * Enhanced with smart redirects
 */
export const PublicRoute = ({
  children,
  redirectTo = '/dashboard',
  redirectIfVerified = false,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loader while checking
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader text="Loading..." />
      </div>
    );
  }

  // Redirect authenticated users
  if (isAuthenticated && user) {
    // Determine redirect based on role
    let dashboardPath = '/dashboard';
    if (user.role === 'student') {
      dashboardPath = '/student-dashboard';
    } else if (user.role === 'parent') {
      dashboardPath = '/parents/dashboard';
    }

    // Special handling based on verification status
    if (redirectIfVerified && user.is_verified) {
      return <Navigate to={dashboardPath} replace />;
    }

    // Default redirect for authenticated users
    return <Navigate to={dashboardPath} replace />;
  }

  // Not authenticated, show public page
  return children;
};

/**
 * Feature-based route wrapper
 * Checks specific feature permissions
 */
export const FeatureRoute = ({
  children,
  feature,
  redirectTo = '/unauthorized',
  ...props
}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !hasPermission(user, location.pathname, [feature])) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

/**
 * Department-based route wrapper
 * Checks if user belongs to specific department
 */
export const DepartmentRoute = ({
  children,
  department,
  redirectTo = '/unauthorized',
  ...props
}) => {
  const { user } = useAuth();

  if (!user || user.department !== department) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

/**
 * Export all route components and helper functions
 */
export {
  ProtectedRoute as default,
  hasPermission,
  routeMatches,
  PERMISSIONS,
};