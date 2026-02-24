/**
 * NotFound Page Component
 * 404 error page for invalid routes
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

/**
 * 404 Not Found page
 * Displayed when user navigates to non-existent route
 */
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="text-center">
        {/* 404 Icon */}
        <div className="mb-8 animate-fade-in">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-16 h-16 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-bold text-primary-600 mb-4 animate-slide-down">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-slide-down">
          Page Not Found
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto animate-fade-in">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Link to="/dashboard">
            <Button size="lg">
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 text-sm text-gray-500">
          <p className="mb-2">Need help? Try these links:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-700 transition-colors">
              Login
            </Link>
            <span>•</span>
            <Link to="/register" className="text-primary-600 hover:text-primary-700 transition-colors">
              Register
            </Link>
            <span>•</span>
            <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;