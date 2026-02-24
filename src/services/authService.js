/**
 * Authentication service
 * Handles all authentication-related API calls matching Django backend
 */

import { post, get } from './api';
import { setAuthData, clearAuthData, getRefreshToken } from '../utils/storage';

/**
 * Register a new user
 */
export const register = async (userData) => {
  try {
    // Call register endpoint - matches /api/auth/register/
    const response = await post('/auth/register/', userData);
    
    // Save authentication data to localStorage
    if (response.tokens && response.user) {
      setAuthData({
        tokens: response.tokens,
        user: response.user,
      });
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user with registration number and password
 */
export const login = async (credentials) => {
  try {
    // Ensure proper field names for Django backend
    const loginData = {
      registration_number: credentials.registration_number,
      password: credentials.password
    };
    
    // Call login endpoint - matches /api/auth/login/
    const response = await post('/auth/login/', loginData);
    
    // Save authentication data to localStorage
    if (response.tokens && response.user) {
      setAuthData({
        tokens: response.tokens,
        user: response.user,
      });
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      // Call logout endpoint - matches /api/auth/logout/
      await post('/auth/logout/', {
        refresh_token: refreshToken,
      });
    }
    
    clearAuthData();
    
    return { message: 'Logged out successfully' };
  } catch (error) {
    clearAuthData();
    console.error('Logout error:', error);
    return { message: 'Logged out (with errors)' };
  }
};

/**
 * Get current user profile
 */
export const getProfile = async () => {
  try {
    // Matches /api/auth/profile/
    const response = await get('/auth/profile/');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  try {
    // Matches /api/auth/profile/
    const response = await post('/auth/profile/', profileData);
    
    if (response) {
      setAuthData({ user: response });
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Change password
 */
export const changePassword = async (passwordData) => {
  try {
    // Matches /api/auth/change-password/
    const response = await post('/auth/change-password/', passwordData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Request password reset (forgot password)
 */
export const forgotPassword = async (email) => {
  try {
    // Matches /api/auth/forgot-password/
    const response = await post('/auth/forgot-password/', { email });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (resetData) => {
  try {
    // Matches /api/auth/reset-password/
    const response = await post('/auth/reset-password/', resetData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (tokenData) => {
  try {
    // Matches /api/auth/token/refresh/
    const response = await post('/auth/token/refresh/', tokenData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if user exists
 */
export const checkUserExists = async (registration_number) => {
  try {
    // Matches /api/auth/check-user-exists/
    const response = await post('/auth/check-user-exists/', { registration_number });
    return response;
  } catch (error) {
    throw error;
  }
};

export const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  checkUserExists,
};

export default authService;