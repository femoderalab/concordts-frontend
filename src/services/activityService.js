/**
 * Activity Service
 * Tracks and retrieves recent system activities
 */

import { get, post } from './api';

/**
 * Get recent system activities
 * @param {number} limit - Number of activities to fetch
 * @param {string} activityType - Filter by activity type
 * @returns {Promise<Array>} - Recent activities
 */
export const getRecentActivities = async (limit = 10, activityType = null) => {
  try {
    let url = '/auth/activities/recent/';
    const params = new URLSearchParams();
    
    if (limit) params.append('limit', limit);
    if (activityType) params.append('activity_type', activityType);
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await get(url);
    return response.data || response || [];
  } catch (error) {
    console.warn('Could not fetch recent activities, using fallback:', error);
    
    // Fallback to local storage activities
    return getLocalActivities(limit);
  }
};

/**
 * Log a new activity
 * @param {Object} activityData - Activity data
 * @returns {Promise<Object>} - Created activity
 */
export const logActivity = async (activityData) => {
  try {
    const response = await post('/api/activities/log/', activityData);
    return response;
  } catch (error) {
    console.warn('Could not log activity:', error);
    
    // Store locally if backend fails
    storeActivityLocally(activityData);
    return { success: true, stored_locally: true };
  }
};

/**
 * Get activity statistics
 * @returns {Promise<Object>} - Activity statistics
 */
export const getActivityStatistics = async () => {
  try {
    const response = await get('/api/activities/statistics/');
    return response.data || response;
  } catch (error) {
    console.warn('Could not fetch activity statistics:', error);
    return {
      total_activities: 0,
      today_activities: 0,
      user_activities: 0,
      system_activities: 0,
      by_type: {}
    };
  }
};

/**
 * Get user's recent activities
 * @param {number} userId - User ID
 * @param {number} limit - Number of activities
 * @returns {Promise<Array>} - User activities
 */
export const getUserActivities = async (userId, limit = 10) => {
  try {
    const response = await get(`/api/activities/user/${userId}/?limit=${limit}`);
    return response.data || response || [];
  } catch (error) {
    console.warn('Could not fetch user activities:', error);
    return [];
  }
};

/**
 * Mark activity as read
 * @param {number} activityId - Activity ID
 * @returns {Promise<Object>} - Update result
 */
export const markAsRead = async (activityId) => {
  try {
    const response = await post(`/api/activities/${activityId}/mark-read/`);
    return response;
  } catch (error) {
    console.warn('Could not mark activity as read:', error);
    return { success: false };
  }
};

/**
 * Mark all activities as read
 * @returns {Promise<Object>} - Update result
 */
export const markAllAsRead = async () => {
  try {
    const response = await post('/api/activities/mark-all-read/');
    return response;
  } catch (error) {
    console.warn('Could not mark all activities as read:', error);
    return { success: false };
  }
};

/**
 * Get unread activity count
 * @returns {Promise<number>} - Unread count
 */
export const getUnreadCount = async () => {
  try {
    const response = await get('/api/activities/unread-count/');
    return response.data?.count || response?.count || 0;
  } catch (error) {
    console.warn('Could not fetch unread count:', error);
    return 0;
  }
};

// =====================
// LOCAL STORAGE FALLBACK
// =====================

const STORAGE_KEY = 'system_activities';

/**
 * Store activity locally
 * @param {Object} activity - Activity data
 */
const storeActivityLocally = (activity) => {
  try {
    const activities = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const newActivity = {
      id: Date.now(),
      type: activity.type || 'system',
      action: activity.action || 'Unknown action',
      description: activity.description || '',
      user_id: activity.user_id || null,
      user_name: activity.user_name || 'System',
      user_role: activity.user_role || 'system',
      target_type: activity.target_type || null,
      target_id: activity.target_id || null,
      target_name: activity.target_name || null,
      metadata: activity.metadata || {},
      created_at: new Date().toISOString(),
      is_read: false,
      is_system: true
    };
    
    activities.unshift(newActivity);
    
    // Keep only last 100 activities
    if (activities.length > 100) {
      activities.pop();
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error('Error storing activity locally:', error);
  }
};

/**
 * Get local activities
 * @param {number} limit - Number of activities to return
 * @returns {Array} - Local activities
 */
const getLocalActivities = (limit = 10) => {
  try {
    const activities = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return activities.slice(0, limit);
  } catch (error) {
    console.error('Error getting local activities:', error);
    return [];
  }
};

/**
 * Clear local activities
 */
export const clearLocalActivities = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing local activities:', error);
  }
};

/**
 * Get fallback activities (for development)
 * @param {number} limit - Number of activities
 * @returns {Array} - Fallback activities
 */
const getFallbackActivities = (limit = 10) => {
  const actions = [
    'registered a new student',
    'updated student information',
    'published exam results',
    'processed fee payment',
    'added new staff member',
    'sent announcement',
    'updated class schedule',
    'uploaded document',
    'approved leave request',
    'updated academic calendar'
  ];
  
  const users = [
    { name: 'Admin User', role: 'admin' },
    { name: 'John Doe', role: 'teacher' },
    { name: 'Jane Smith', role: 'accountant' },
    { name: 'System', role: 'system' }
  ];
  
  const activities = [];
  const now = new Date();
  
  for (let i = 0; i < limit; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const hoursAgo = Math.floor(Math.random() * 24);
    const activityTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
    
    activities.push({
      id: Date.now() - i,
      type: Math.random() > 0.5 ? 'user' : 'system',
      action: actions[Math.floor(Math.random() * actions.length)],
      description: `${user.name} ${actions[Math.floor(Math.random() * actions.length)]}`,
      user_name: user.name,
      user_role: user.role,
      created_at: activityTime.toISOString(),
      time_ago: `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`,
      is_read: Math.random() > 0.7,
      is_system: user.role === 'system'
    });
  }
  
  return activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

// =====================
// ACTIVITY TYPES AND ICONS
// =====================

export const ACTIVITY_TYPES = {
  USER_CREATED: { icon: 'UserPlus', color: 'text-blue-500', bg: 'bg-blue-50' },
  USER_UPDATED: { icon: 'UserCheck', color: 'text-green-500', bg: 'bg-green-50' },
  STUDENT_CREATED: { icon: 'GraduationCap', color: 'text-purple-500', bg: 'bg-purple-50' },
  STUDENT_UPDATED: { icon: 'Edit', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  RESULT_PUBLISHED: { icon: 'FileText', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  FEE_PAID: { icon: 'CreditCard', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  STAFF_ADDED: { icon: 'Briefcase', color: 'text-orange-500', bg: 'bg-orange-50' },
  ANNOUNCEMENT: { icon: 'Megaphone', color: 'text-red-500', bg: 'bg-red-50' },
  SYSTEM: { icon: 'Server', color: 'text-gray-500', bg: 'bg-gray-50' }
};

// =====================
// EXPORT SERVICE
// =====================

const activityService = {
  getRecentActivities,
  logActivity,
  getActivityStatistics,
  getUserActivities,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  clearLocalActivities,
  ACTIVITY_TYPES
};

export default activityService;