/**
 * LocalStorage utility functions for managing user data and tokens
 * Provides safe methods to store and retrieve data from browser localStorage
 * Updated to work with the new User model and authentication flow
 */

// Storage keys - centralized to avoid typos
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  AUTH_DATA: 'authData', // Combined storage for backward compatibility
};

/**
 * Get complete auth data from localStorage
 * @returns {Object|null} Auth data object or null
 */
export const getAuthData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting auth data:', error);
    // Fallback to legacy storage for compatibility
    return {
      tokens: {
        access: getAccessToken(),
        refresh: getRefreshToken(),
      },
      user: getUserData(),
    };
  }
};

/**
 * Save complete auth data to localStorage
 * @param {Object} authData - Complete auth data object
 * Structure: { tokens: { access, refresh }, user: {...} }
 */
export const setAuthData = (authData) => {
  try {
    // If authData has tokens property (new format)
    if (authData.tokens) {
      setAccessToken(authData.tokens.access);
      setRefreshToken(authData.tokens.refresh);
    }
    
    // If authData has user property
    if (authData.user) {
      setUserData(authData.user);
    }
    
    // Also store in combined format for easy retrieval
    const existingData = getAuthData() || {};
    const newData = { 
      tokens: {
        access: authData.tokens?.access || existingData.tokens?.access,
        refresh: authData.tokens?.refresh || existingData.tokens?.refresh,
      },
      user: authData.user || existingData.user,
    };
    
    localStorage.setItem(STORAGE_KEYS.AUTH_DATA, JSON.stringify(newData));
  } catch (error) {
    console.error('Error setting auth data:', error);
  }
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.AUTH_DATA);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Save access token to localStorage
 * @param {string} token - JWT access token
 */
export const setAccessToken = (token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    // Also update combined storage
    const authData = getAuthData() || {};
    authData.tokens = { ...authData.tokens, access: token };
    localStorage.setItem(STORAGE_KEYS.AUTH_DATA, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving access token:', error);
  }
};

/**
 * Get access token from localStorage
 * @returns {string|null} - JWT access token or null if not found
 */
export const getAccessToken = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) return token;
    
    // Fallback to combined storage
    const authData = getAuthData();
    return authData?.tokens?.access || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Save refresh token to localStorage
 * @param {string} token - JWT refresh token
 */
export const setRefreshToken = (token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    // Also update combined storage
    const authData = getAuthData() || {};
    authData.tokens = { ...authData.tokens, refresh: token };
    localStorage.setItem(STORAGE_KEYS.AUTH_DATA, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving refresh token:', error);
  }
};

/**
 * Get refresh token from localStorage
 * @returns {string|null} - JWT refresh token or null if not found
 */
export const getRefreshToken = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (token) return token;
    
    // Fallback to combined storage
    const authData = getAuthData();
    return authData?.tokens?.refresh || null;
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Save user data to localStorage
 * @param {Object} userData - User profile data (matches User model)
 */
export const setUserData = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    // Also update combined storage
    const authData = getAuthData() || {};
    authData.user = userData;
    localStorage.setItem(STORAGE_KEYS.AUTH_DATA, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

/**
 * Get user data from localStorage
 * @returns {Object|null} - User profile data or null if not found
 * Returns complete User object matching Django model
 */
export const getUserData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (data) return JSON.parse(data);
    
    // Fallback to combined storage
    const authData = getAuthData();
    return authData?.user || null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if valid access token exists
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;
  
  // Simple token validation - check if it's a JWT token
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if token is not expired (basic check)
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

/**
 * Get user role from stored user data
 * @returns {string|null} - User role or null
 */
export const getUserRole = () => {
  const userData = getUserData();
  return userData ? userData.role : null;
};

/**
 * Check if user has admin privileges (matches User model admin roles)
 * @returns {boolean} - True if user is head, hm, principal, vice_principal, or secretary
 */
export const isAdmin = () => {
  const role = getUserRole();
  return ['head', 'hm', 'principal', 'vice_principal', 'secretary'].includes(role);
};

/**
 * Check if user is a teacher
 * @returns {boolean} - True if user is teacher, form_teacher, or subject_teacher
 */
export const isTeacher = () => {
  const role = getUserRole();
  return ['teacher', 'form_teacher', 'subject_teacher'].includes(role);
};

/**
 * Check if user is a student
 * @returns {boolean} - True if user role is student
 */
export const isStudent = () => {
  const role = getUserRole();
  return role === 'student';
};

/**
 * Check if user is a parent
 * @returns {boolean} - True if user role is parent
 */
export const isParent = () => {
  const role = getUserRole();
  return role === 'parent';
};

/**
 * Check if user is staff (non-teaching staff)
 * @returns {boolean} - True if user is accountant, librarian, laboratory, security, or cleaner
 */
export const isStaff = () => {
  const role = getUserRole();
  return ['accountant', 'librarian', 'laboratory', 'security', 'cleaner'].includes(role);
};

/**
 * Get user's registration number
 * @returns {string|null} - Registration number or null
 */
export const getRegistrationNumber = () => {
  const userData = getUserData();
  return userData ? userData.registration_number : null;
};

/**
 * Get user's full name
 * @returns {string} - Full name or registration number or 'User' if not found
 */
export const getUserFullName = () => {
  const userData = getUserData();
  if (!userData) return 'User';
  
  if (userData.first_name && userData.last_name) {
    return `${userData.first_name} ${userData.last_name}`;
  }
  
  return userData.registration_number || 'User';
};

/**
 * Get user's initials for avatar display
 * @returns {string} - User initials
 */
export const getUserInitials = () => {
  const userData = getUserData();
  if (!userData) return 'U';
  
  if (userData.first_name && userData.last_name) {
    return `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase();
  }
  
  return userData.registration_number?.slice(0, 2).toUpperCase() || 'U';
};

/**
 * Get user's display name (prefers full name, falls back to registration number)
 * @returns {string} - Display name
 */
export const getDisplayName = () => {
  const fullName = getUserFullName();
  const regNumber = getRegistrationNumber();
  
  if (fullName && fullName !== 'User') {
    return fullName;
  }
  
  return regNumber || 'User';
};

/**
 * Update specific fields in user data
 * @param {Object} updates - Partial user data to update
 */
export const updateUserData = (updates) => {
  const currentUser = getUserData();
  if (currentUser) {
    setUserData({ ...currentUser, ...updates });
  }
};

/**
 * Get user's avatar color based on registration number
 * @returns {string} - Tailwind CSS class for background color
 */
export const getUserAvatarColor = () => {
  const regNumber = getRegistrationNumber() || 'user';
  let hash = 0;
  for (let i = 0; i < regNumber.length; i++) {
    hash = regNumber.charCodeAt(i) + ((hash << 5) - hash);
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

// Export storage keys for use in other modules if needed
export { STORAGE_KEYS };