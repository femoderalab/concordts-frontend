/**
 * Enhanced Promotion Service with all new endpoints
 */

import { get, post } from './api';

const BASE = '/students';

// ================================================================
// PREVIEW & EXECUTION
// ================================================================

export const getPromotionPreview = async () => {
  try {
    const response = await get(`${BASE}/promotion/preview/`);
    return response.data || response;
  } catch (error) {
    console.error('Promotion preview error:', error);
    throw error;
  }
};

export const executePromotion = async ({ remarks = '' } = {}) => {
  try {
    const response = await post(`${BASE}/promotion/execute/`, {
      promote: true,
      remarks,
    });
    return response.data || response;
  } catch (error) {
    console.error('Execute promotion error:', error);
    throw error;
  }
};

// ================================================================
// CLASS & BULK OPERATIONS
// ================================================================

export const promoteByClass = async (classLevelId, { remarks = '' } = {}) => {
  try {
    const response = await post(`${BASE}/promotion/class/${classLevelId}/`, {
      promote: true,
      remarks,
    });
    return response.data || response;
  } catch (error) {
    console.error('Promote by class error:', error);
    throw error;
  }
};

export const bulkPromoteStudents = async (studentIds, { remarks = '' } = {}) => {
  try {
    const response = await post(`${BASE}/promotion/bulk/`, {
      promote: true,
      student_ids: studentIds,
      remarks,
    });
    return response.data || response;
  } catch (error) {
    console.error('Bulk promotion error:', error);
    throw error;
  }
};

// ================================================================
// INDIVIDUAL STUDENT OPERATIONS
// ================================================================

export const promoteSingleStudent = async (studentId, { remarks = '' } = {}) => {
  try {
    const response = await post(`${BASE}/promotion/${studentId}/single/`, {
      promote: true,
      remarks,
    });
    return response.data || response;
  } catch (error) {
    console.error('Single promotion error:', error);
    throw error;
  }
};

export const demoteSingleStudent = async (studentId, { remarks = '' } = {}) => {
  try {
    const response = await post(`${BASE}/promotion/${studentId}/demote/`, {
      demote: true,
      remarks,
    });
    return response.data || response;
  } catch (error) {
    console.error('Demote student error:', error);
    throw error;
  }
};

// ================================================================
// HISTORY & ANALYTICS
// ================================================================

export const getPromotionHistory = async (params = {}) => {
  try {
    const response = await get(`${BASE}/promotion/history/`, { params });
    return response.data || response;
  } catch (error) {
    console.error('Promotion history error:', error);
    throw error;
  }
};

export const getCompletePromotionHistory = async (params = {}) => {
  try {
    const response = await get(`${BASE}/promotion/complete-history/`, { params });
    return response.data || response;
  } catch (error) {
    console.error('Complete promotion history error:', error);
    throw error;
  }
};

export const getRecentPromotionActivities = async (limit = 20) => {
  try {
    const response = await get(`${BASE}/promotion/recent-activities/?limit=${limit}`);
    return response.data || response;
  } catch (error) {
    console.error('Recent activities error:', error);
    throw error;
  }
};

export const getSessionPromotionAnalytics = async (sessionId = null) => {
  try {
    const params = sessionId ? { session_id: sessionId } : {};
    const response = await get(`${BASE}/promotion/session-analytics/`, { params });
    return response.data || response;
  } catch (error) {
    console.error('Session analytics error:', error);
    throw error;
  }
};

export const getSessionHistoryDetail = async (sessionId) => {
  try {
    const response = await get(`${BASE}/promotion/session-history/${sessionId}/`);
    return response.data || response;
  } catch (error) {
    console.error('Session history detail error:', error);
    throw error;
  }
};

// ================================================================
// ALUMNI
// ================================================================

export const getAlumniList = async (params = {}) => {
  try {
    const response = await get(`${BASE}/alumni/`, { params });
    return response.data || response;
  } catch (error) {
    console.error('Alumni list error:', error);
    throw error;
  }
};

export const getAlumniBySession = async (sessionId) => {
  try {
    const response = await get(`${BASE}/alumni/session/${sessionId}/`);
    return response.data || response;
  } catch (error) {
    console.error('Alumni by session error:', error);
    throw error;
  }
};

export const getAlumniDetail = async (alumniRecordId) => {
  try {
    const response = await get(`${BASE}/alumni/${alumniRecordId}/`);
    return response.data || response;
  } catch (error) {
    console.error('Alumni detail error:', error);
    throw error;
  }
};

// ================================================================
// SESSION HISTORY
// ================================================================

export const getSessionHistory = async (sessionId) => {
  try {
    const response = await get(`${BASE}/session-history/${sessionId}/`);
    return response.data || response;
  } catch (error) {
    console.error('Session history error:', error);
    throw error;
  }
};

// ================================================================
// EXPORT ALL
// ================================================================

const promotionService = {
  // Preview & Execution
  getPromotionPreview,
  executePromotion,
  
  // Class & Bulk Operations
  promoteByClass,
  bulkPromoteStudents,
  
  // Individual Student Operations
  promoteSingleStudent,
  demoteSingleStudent,
  
  // History & Analytics
  getPromotionHistory,
  getCompletePromotionHistory,
  getRecentPromotionActivities,
  getSessionPromotionAnalytics,
  getSessionHistoryDetail,
  
  // Alumni
  getAlumniList,
  getAlumniBySession,
  getAlumniDetail,
  
  // Session History
  getSessionHistory,
};

export default promotionService;