/**
 * User Service
 * Handles all user-related API calls
 * Updated to match Django URL patterns exactly
 */

import { get, post, put, del } from './api';
import { handleApiError } from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Registered user
 */
export const createUser = async (userData) => {
  try {
    const response = await post('/auth/register/', userData);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw handleApiError(error);
  }
};

// =====================
// ADMIN PASSWORD RESET - ONLY FOR HEAD/HM
// =====================

/**
 * Admin reset user password - Only for head/hm
 * @param {string} registrationNumber - User's registration number
 * @param {Object} passwordData - { new_password, confirm_password }
 * @returns {Promise<Object>} - Reset result
 */
export const adminResetPassword = async (registrationNumber, passwordData) => {
  try {
    console.log(`🔐 Admin resetting password for user: ${registrationNumber}`);
    
    // Simple validation
    if (!passwordData.new_password || !passwordData.confirm_password) {
      throw new Error('Both password fields are required');
    }
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      throw new Error('Passwords do not match');
    }
    
    if (passwordData.new_password.length < 5) {
      throw new Error('Password must be at least 5 characters');
    }
    
    const response = await api.post('/auth/admin/reset-password/', {
      registration_number: registrationNumber,
      new_password: passwordData.new_password,
      confirm_password: passwordData.confirm_password
    });
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Admin password reset error:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} - Authentication tokens and user data
 */
export const loginUser = async (credentials) => {
  try {
    const response = await post('/auth/login/', credentials);
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw handleApiError(error);
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} - User profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await get('/auth/profile/');
    return response;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw handleApiError(error);
  }
};

/**
 * Update current user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - Updated user profile
 */
export const updateCurrentUser = async (userData) => {
  try {
    const response = await put('/auth/profile/', userData);
    return response;
  } catch (error) {
    console.error('Error updating current user:', error);
    throw handleApiError(error);
  }
};

/**
 * Get user by registration number
 * @param {string} registrationNumber - User registration number
 * @returns {Promise<Object>} - User data
 */
export const getUserByRegNumber = async (registrationNumber) => {
  try {
    const response = await get(`/auth/admin/users/${registrationNumber}/`);
    return response;
  } catch (error) {
    console.error(`Error fetching user ${registrationNumber}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Update user
 * @param {string} registrationNumber - User registration number
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - Updated user
 */
export const updateUser = async (registrationNumber, userData) => {
  try {
    const response = await put(`/auth/admin/update-role/${registrationNumber}/`, userData);
    return response;
  } catch (error) {
    console.error(`Error updating user ${registrationNumber}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Delete user
 * @param {string} registrationNumber - User registration number
 * @returns {Promise<Object>} - Success message
 */
export const deleteUser = async (registrationNumber) => {
  try {
    const response = await post(`/auth/admin/deactivate/${registrationNumber}/`);
    return response;
  } catch (error) {
    console.error(`Error deleting user ${registrationNumber}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Get all users with optional filtering (admin only)
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} - List of users
 */
export const getAllUsers = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `/auth/admin/users/?${queryString}` : '/auth/admin/users/';
    
    const response = await get(url);
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw handleApiError(error);
  }
};

/**
 * Check if user exists
 * @param {Object} identifier - User identifier (email, phone, registration_number)
 * @returns {Promise<Object>} - User existence check result
 */
export const checkUserExists = async (identifier) => {
  try {
    const response = await post('/auth/check-user-exists/', identifier);
    return response;
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw handleApiError(error);
  }
};

/**
 * Change user password
 * @param {Object} passwordData - Password change data
 * @returns {Promise<Object>} - Success message
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await post('/auth/change-password/', passwordData);
    return response;
  } catch (error) {
    console.error('Error changing password:', error);
    throw handleApiError(error);
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} - Success message
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await post('/auth/forgot-password/', { email });
    return response;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw handleApiError(error);
  }
};

/**
 * Reset password with token
 * @param {Object} resetData - Reset data (email, new_password, token)
 * @returns {Promise<Object>} - Success message
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await post('/auth/reset-password/', resetData);
    return response;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw handleApiError(error);
  }
};


/**
 * Verify user (admin only)
 * @param {string} registrationNumber - User registration number
 * @returns {Promise<Object>} - Success message
 */
export const verifyUser = async (registrationNumber) => {
  try {
    const response = await post(`/auth/admin/verify/${registrationNumber}/`);
    return response;
  } catch (error) {
    console.error(`Error verifying user ${registrationNumber}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Activate user (admin only)
 * @param {string} registrationNumber - User registration number
 * @returns {Promise<Object>} - Success message
 */
export const activateUser = async (registrationNumber) => {
  try {
    const response = await post(`/auth/admin/activate/${registrationNumber}/`);
    return response;
  } catch (error) {
    console.error(`Error activating user ${registrationNumber}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Deactivate user (admin only)
 * @param {string} registrationNumber - User registration number
 * @returns {Promise<Object>} - Success message
 */
export const deactivateUser = async (registrationNumber) => {
  try {
    const response = await post(`/auth/admin/deactivate/${registrationNumber}/`);
    return response;
  } catch (error) {
    console.error(`Error deactivating user ${registrationNumber}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Update user role (admin only)
 * @param {string} registrationNumber - User registration number
 * @param {Object} roleData - Role update data
 * @returns {Promise<Object>} - Updated user
 */
export const updateUserRole = async (registrationNumber, roleData) => {
  try {
    const response = await post(`/auth/admin/update-role/${registrationNumber}/`, roleData);
    return response;
  } catch (error) {
    console.error(`Error updating user role ${registrationNumber}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Get admin dashboard statistics
 * @returns {Promise<Object>} - Dashboard statistics
 */
export const getAdminDashboard = async () => {
  try {
    const response = await get('/auth/admin/dashboard/');
    return response;
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    throw handleApiError(error);
  }
};

/**
 * Logout user
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} - Success message
 */
export const logoutUser = async (refreshToken) => {
  try {
    const response = await post('/auth/logout/', { refresh_token: refreshToken });
    return response;
  } catch (error) {
    console.error('Error logging out:', error);
    throw handleApiError(error);
  }
};

/**
 * Refresh authentication token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} - New access token
 */
export const refreshToken = async (refreshToken) => {
  try {
    const response = await post('/auth/token/refresh/', { refresh: refreshToken });
    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw handleApiError(error);
  }
};

// Export all functions
const userService = {
  createUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
  getUserByRegNumber,
  updateUser,
  deleteUser,
  getAllUsers,
  checkUserExists,
  changePassword,
  requestPasswordReset,
  resetPassword,
  adminResetPassword,
  verifyUser,
  activateUser,
  deactivateUser,
  updateUserRole,
  getAdminDashboard,
  logoutUser,
  refreshToken,
};

export default userService;