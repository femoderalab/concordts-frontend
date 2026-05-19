import { get, post, put, del } from './api';

// =====================
// DAYS
// =====================
export const getDays = async () => {
  try {
    const response = await get('/timetable/days/');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateDay = async (id, data) => {
  try {
    const response = await put(`/timetable/days/${id}/`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

// =====================
// PERIODS (Time Slots)
// =====================
export const getPeriods = async () => {
  try {
    const response = await get('/timetable/periods/');
    return response;
  } catch (error) {
    throw error;
  }
};

export const createPeriod = async (data) => {
  try {
    const response = await post('/timetable/periods/', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePeriod = async (id, data) => {
  try {
    const response = await put(`/timetable/periods/${id}/`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deletePeriod = async (id) => {
  try {
    const response = await del(`/timetable/periods/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

// =====================
// TIMETABLE ENTRIES
// =====================
export const getTimetableEntries = async (params = {}) => {
  try {
    const response = await get('/timetable/entries/', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const createTimetableEntry = async (data) => {
  try {
    const response = await post('/timetable/entries/', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateTimetableEntry = async (id, data) => {
  try {
    const response = await put(`/timetable/entries/${id}/`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteTimetableEntry = async (id) => {
  try {
    const response = await del(`/timetable/entries/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

// =====================
// BULK OPERATIONS
// =====================
export const bulkCreateTimetableEntries = async (data) => {
  try {
    const response = await post('/timetable/bulk-create/', data);
    return response;
  } catch (error) {
    throw error;
  }
};

// =====================
// VIEW TIMETABLES
// =====================
export const getAllClassTimetables = async (sessionId, termId) => {
  try {
    const params = {};
    if (sessionId) params.session_id = sessionId;
    if (termId) params.term_id = termId;
    const response = await get('/timetable/all-classes/', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// Add timeout to prevent hanging requests
export const getClassTimetable = async (classId, sessionId, termId) => {
  try {
    const params = {};
    if (sessionId) params.session_id = sessionId;
    if (termId) params.term_id = termId;
    // Add timeout to prevent infinite loading
    const response = await get(`/timetable/class/${classId}/`, { params, timeout: 10000 });
    return response;
  } catch (error) {
    console.error('Error fetching class timetable:', error);
    throw error;
  }
};

export const getTeacherTimetable = async (teacherId, sessionId, termId) => {
  try {
    const params = {};
    if (sessionId) params.session_id = sessionId;
    if (termId) params.term_id = termId;
    const response = await get(`/timetable/teacher/${teacherId}/`, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getMyTimetable = async () => {
  try {
    const response = await get('/timetable/my-timetable/');
    return response;
  } catch (error) {
    throw error;
  }
};

// Default export
export default {
  getDays,
  updateDay,
  getPeriods,
  createPeriod,
  updatePeriod,
  deletePeriod,
  getTimetableEntries,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
  bulkCreateTimetableEntries,
  getAllClassTimetables,
  getClassTimetable,
  getTeacherTimetable,
  getMyTimetable,
};