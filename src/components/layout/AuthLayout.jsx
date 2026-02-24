/**
 * AuthLayout Component
 * Layout wrapper for authentication pages (login, register)
 * Provides consistent styling and branding
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Authentication layout wrapper
 * Centers auth forms and adds school branding
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Auth form content
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle/description
 */
const AuthLayout = ({ children, title, subtitle }) => {
  // Get school name from environment
  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'School Management System';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* School Logo and Name */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center">
            {/* Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <span className="text-white font-bold text-3xl">S</span>
            </div>
            
            {/* School Name */}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {schoolName}
            </h1>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
          {/* Page Title */}
          {title && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-600 text-sm">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Auth Form Content */}
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} {schoolName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;