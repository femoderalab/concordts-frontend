import { get, post, put, del } from './api';

// Get attendance records with filters
export const getAttendance = async (params = {}) => {
  try {
    const response = await get('/attendance/', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get attendance for a specific class on a specific date
export const getClassAttendance = async (classId, date, sessionId, termId) => {
  try {
    const params = { class_id: classId };
    if (date) params.date = date;
    if (sessionId) params.session_id = sessionId;
    if (termId) params.term_id = termId;
    const response = await get('/attendance/class/', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// Bulk mark attendance for a class
export const bulkMarkAttendance = async (data) => {
  try {
    const response = await post('/attendance/bulk-mark/', data);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get attendance summary for a student
export const getStudentAttendanceSummary = async (studentId) => {
  try {
    const response = await get(`/attendance/student/${studentId}/summary/`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get attendance trend for a class
export const getAttendanceTrend = async (classId, sessionId, termId, days = 30) => {
  try {
    const response = await get('/attendance/trend/', {
      params: { class_id: classId, session_id: sessionId, term_id: termId, days }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Update a single attendance record
export const updateAttendance = async (id, data) => {
  try {
    const response = await put(`/attendance/${id}/`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  getAttendance,
  getClassAttendance,
  bulkMarkAttendance,
  getStudentAttendanceSummary,
  getAttendanceTrend,
  updateAttendance,
};