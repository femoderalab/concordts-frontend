/**
 * Authentication Context
 * Provides global authentication state, methods, and user management
 * Enhanced with advanced features and better error handling
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  getAccessToken as getToken,
  getRefreshToken,
  setAccessToken as setToken,
  setRefreshToken,
  getUserData,
  setUserData,
  clearAuthData,
  isAuthenticated as checkAuth,
  setAuthData,
} from '../utils/storage';
import { 
  login as loginService, 
  logout as logoutService, 
  register as registerService,
  refreshToken as refreshTokenService,
  getProfile,
  updateProfile as updateProfileService,  // ✅ RENAMED to avoid conflict
} from '../services/authService';
import { handleApiError } from '../services/api';

// Create the authentication context
export const AuthContext = createContext(null);

/**
 * Session management utility
 */
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before token expires

/**
 * AuthProvider component
 * Enhanced with session management, auto-refresh, and better state handling
 * @param {Object} props - Component props
 */
export const AuthProvider = ({ children }) => {
  // State for user data and authentication status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Initialize authentication state on mount
   * Checks localStorage and validates session
   */
  useEffect(() => {
    initializeAuth();
    setupAutoRefresh();
    
    // Cleanup on unmount
    return () => {
      if (sessionExpiry) {
        clearTimeout(sessionExpiry);
      }
    };
  }, []);

  /**
   * Setup automatic token refresh
   */
  const setupAutoRefresh = useCallback(() => {
    const checkAndRefreshToken = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const decodedToken = decodeJWT(token);
        if (!decodedToken) return;

        const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        // Refresh token if it's about to expire
        if (timeUntilExpiry < REFRESH_THRESHOLD) {
          await refreshToken();
        }
      } catch (error) {
        console.error('Token refresh check failed:', error);
      }
    };

    // Check token every minute
    const interval = setInterval(checkAndRefreshToken, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Initialize auth state from localStorage
   * Validates tokens and refreshes if needed
   */
  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      const userData = getUserData();

      if (!token || !userData) {
        clearAuthState();
        return;
      }

      // Validate token
      const isTokenValid = validateToken(token);
      if (!isTokenValid) {
        clearAuthState();
        return;
      }

      // Set user state
      setUser(userData);
      setIsAuthenticated(true);
      setupSessionTimeout();
      
    } catch (error) {
      console.error('Error initializing auth:', error);
      setError('Failed to initialize authentication');
      clearAuthState();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear all auth state
   */
  const clearAuthState = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearAuthData();
    if (sessionExpiry) {
      clearTimeout(sessionExpiry);
    }
  };

  /**
   * Setup session timeout
   */
  const setupSessionTimeout = () => {
    if (sessionExpiry) {
      clearTimeout(sessionExpiry);
    }

    const timeout = setTimeout(() => {
      handleSessionTimeout();
    }, SESSION_TIMEOUT);

    setSessionExpiry(timeout);
  };

  /**
   * Handle session timeout
   */
  const handleSessionTimeout = () => {
    alert('Your session has expired. Please log in again.');
    logout();
  };

  /**
   * Validate JWT token
   */
  const validateToken = (token) => {
    try {
      const decoded = decodeJWT(token);
      if (!decoded) return false;

      const currentTime = Date.now() / 1000; // Convert to seconds
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  /**
   * Decode JWT token
   */
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  /**
   * Refresh access token
   */
  const refreshToken = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const oldRefreshToken = getRefreshToken();
      if (!oldRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await refreshTokenService({ refresh: oldRefreshToken });
      
      if (response.access) {
        // Update tokens in storage
        setToken(response.access);
        if (response.refresh) {
          setRefreshToken(response.refresh);
        }
        
        // Update combined storage
        const currentAuthData = {
          tokens: {
            access: response.access,
            refresh: response.refresh || oldRefreshToken,
          },
          user: user || getUserData(),
        };
        setAuthData(currentAuthData);
        
        return response.access;
      }
      
      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Error refreshing token:', error);
      clearAuthState();
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Enhanced login function
   */
/**
 * Enhanced login function
 */
// In your AuthContext.jsx, update the login function:

// In AuthContext.jsx - Update the login function

// In your AuthContext.jsx, find the login function and update it:

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the service
      const response = await loginService(credentials);
      
      // Handle the response format from your backend
      if (response.tokens && response.user) {
        // Save tokens and user data
        const authData = {
          tokens: response.tokens,
          user: response.user,
        };
        setAuthData(authData);
        
        // Update state
        setUser(response.user);
        setIsAuthenticated(true);
        setupSessionTimeout();
        
        // CRITICAL FIX: Use window.location for hard redirect
        console.log('🔐 Login successful, user role:', response.user.role);
        
        if (response.user.role === 'student') {
          console.log('➡️ Redirecting to student dashboard');
          window.location.href = '/student-dashboard';
        } else {
          console.log('➡️ Redirecting to admin dashboard');
          window.location.href = '/dashboard';
        }
        
        return response;
      }
      
      // If response format is different, try alternative
      if (response.access && response.user) {
        const authData = {
          tokens: {
            access: response.access,
            refresh: response.refresh || '',
          },
          user: response.user,
        };
        setAuthData(authData);
        
        setUser(response.user);
        setIsAuthenticated(true);
        setupSessionTimeout();
        
        // CRITICAL FIX: Use window.location for hard redirect
        console.log('🔐 Login successful, user role:', response.user.role);
        
        if (response.user.role === 'student') {
          console.log('➡️ Redirecting to student dashboard');
          window.location.href = '/student-dashboard';
        } else {
          console.log('➡️ Redirecting to admin dashboard');
          window.location.href = '/dashboard';
        }
        
        return response;
      }
      
      throw new Error('Invalid login response format');
      
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Enhanced register function
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await registerService(userData);
      
      // Auto-login after successful registration
      if (response.tokens && response.user) {
        const authData = {
          tokens: response.tokens,
          user: response.user,
        };
        setAuthData(authData);
        
        setUser(response.user);
        setIsAuthenticated(true);
        setupSessionTimeout();
      }
      
      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Enhanced logout function
   */
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout service to blacklist refresh token
      const refreshTokenValue = getRefreshToken();
      if (refreshTokenValue) {
        await logoutService({ refresh_token: refreshTokenValue });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      clearAuthState();
      setLoading(false);
      
      // Redirect to login
      window.location.href = '/login';
    }
  };

  /**
   * Update user profile
   */
  const updateUserProfile = async (profileData) => {
    try {
      setLoading(true);
      
      const response = await updateProfileService(profileData);  // Use the renamed service
      
      if (response) {
        // Update local storage and state
        setUserData(response);
        setUser(response);
        
        return response;
      }
      
      throw new Error('Failed to update profile');
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch user profile from server
   */
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      const response = await getProfile();
      
      if (response) {
        setUserData(response);
        setUser(response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (passwordData) => {
    try {
      setLoading(true);
      
      // This would call your password reset API
      // For now, return a mock response
      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request password reset
   */
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      
      // This would call your password reset request API
      // For now, return a mock response
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  /**
   * Check if user has admin privileges
   */
  const isAdmin = () => {
    return ['head', 'hm', 'principal', 'vice_principal', 'secretary'].includes(user?.role);
  };

  /**
   * Check if user is a teacher
   */
  const isTeacher = () => {
    return ['teacher', 'form_teacher', 'subject_teacher'].includes(user?.role);
  };

  /**
   * Check if user is a student
   */
  const isStudent = () => {
    return user?.role === 'student';
  };

  /**
   * Check if user is a parent
   */
  const isParent = () => {
    return user?.role === 'parent';
  };

  /**
   * Check if user is a staff member
   */
  const isStaff = () => {
    return ['accountant', 'secretary', 'librarian', 'laboratory', 'security', 'cleaner'].includes(user?.role);
  };

  /**
   * Get user's full name
   */
  const getUserFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.registration_number || 'User';
  };

  /**
   * Get user's initials for avatar
   */
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.registration_number?.slice(0, 2).toUpperCase() || 'U';
  };

  /**
   * Get user's avatar color
   */
  const getUserAvatarColor = () => {
    const text = user?.registration_number || 'user';
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-primary-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-blue-500',
      'bg-indigo-500',
    ];
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  /**
   * Check if user can perform action
   */
  const can = (action, resource) => {
    // This would implement a more complex permission system
    // For now, return basic role-based permissions
    if (isAdmin()) return true;
    
    const userRole = user?.role;
    const permissions = {
      teacher: ['view_students', 'grade_students', 'take_attendance'],
      parent: ['view_children', 'view_grades', 'make_payments'],
      student: ['view_grades', 'view_attendance'],
      accountant: ['view_finances', 'process_payments'],
      secretary: ['view_records', 'send_notifications'],
    };
    
    return permissions[userRole]?.includes(action) || false;
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  // Context value - all state and methods available to consumers
  const value = {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    isRefreshing,
    
    // Authentication methods
    login,
    register,
    logout,
    refreshToken,
    
    // User management
    updateProfile: updateUserProfile,  // ✅ Use the renamed function
    fetchUserProfile,
    resetPassword,
    requestPasswordReset,
    
    // Role checks
    hasRole,
    hasAnyRole,
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
    isStaff,
    
    // User info
    getUserFullName,
    getUserInitials,
    getUserAvatarColor,
    
    // Permissions
    can,
    
    // Error handling
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;