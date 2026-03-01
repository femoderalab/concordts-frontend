import axios from 'axios';
import { 
  getAccessToken, 
  setAccessToken, 
  getRefreshToken, 
  clearAuthData, 
  getAuthData,
  setAuthData 
} from '../utils/storage';

// Get base URL from environment variable or use default
// IMPORTANT: If your Django API is at http://localhost:8000/api/ then:
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://concordts-backend.onrender.com/api';

/**
 * Create axios instance with default configuration
 */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Flag to track if refresh is in progress
let isRefreshing = false;
let failedQueue = [];

/**
 * Process the queue of failed requests
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * Request interceptor
 * Automatically adds JWT token to all requests
 */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If it's a FormData request, remove Content-Type header
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles token refresh when access token expires
 */
api.interceptors.response.use(
  (response) => {
    // Log successful API calls in development
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}:`, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ ${originalRequest.method?.toUpperCase()} ${originalRequest.url}:`, error.response?.data || error.message);
    }
    
    // Check if it's an authentication error
    if (error.response?.status === 401 && originalRequest.url !== '/auth/login/') {
      if (originalRequest.url.includes('/auth/token/refresh/')) {
        // Refresh token failed, logout user
        clearAuthData();
        window.location.href = '/login?session=expired';
        return Promise.reject(error);
      }
      
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = getRefreshToken();
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          // Try to refresh the token
          const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const newAccessToken = response.data.access;
          
          // Update tokens in storage
          setAccessToken(newAccessToken);
          
          // Update combined storage too
          const authData = getAuthData() || {};
          authData.tokens = { 
            ...authData.tokens, 
            access: newAccessToken,
            refresh: refreshToken // Keep the same refresh token
          };
          setAuthData(authData);
          
          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          
          // Clear auth data and redirect to login
          clearAuthData();
          
          // Check if we're not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?session=expired';
          }
          
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Enhanced API error handler
 * Handles all types of API errors consistently
 */
export const handleApiError = (error) => {
  if (!error) {
    return 'An unexpected error occurred.';
  }
  
  // If error is already a string (from our get/post helpers)
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.response) {
    const { data, status } = error.response;
    
    // Handle different error formats
    if (data) {
      // Django REST Framework error format
      if (data.detail) {
        return data.detail;
      }
      
      if (data.error) {
        return data.error;
      }
      
      if (data.message) {
        return data.message;
      }
      
      // Handle field validation errors
      if (typeof data === 'object') {
        const errors = [];
        
        for (const [field, messages] of Object.entries(data)) {
          if (Array.isArray(messages)) {
            // Join multiple error messages
            errors.push(`${field}: ${messages.join(', ')}`);
          } else if (typeof messages === 'string') {
            errors.push(`${field}: ${messages}`);
          } else if (typeof messages === 'object') {
            // Handle nested errors
            for (const [subField, subMessages] of Object.entries(messages)) {
              if (Array.isArray(subMessages)) {
                errors.push(`${field}.${subField}: ${subMessages.join(', ')}`);
              } else if (typeof subMessages === 'string') {
                errors.push(`${field}.${subField}: ${subMessages}`);
              }
            }
          }
        }
        
        if (errors.length > 0) {
          return errors.join('; ');
        }
      }
    }
    
    // Default HTTP status messages
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Please login again. Your session may have expired.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'A record with this information already exists.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later or contact support.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `Error ${status}: An error occurred.`;
    }
  } else if (error.request) {
    // Network error
    return 'No response from server. Please check your internet connection.';
  } else {
    // Request setup error
    return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Helper function to convert FormData to object for debugging
 */
const formDataToObject = (formData) => {
  const obj = {};
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      obj[key] = {
        name: value.name,
        size: value.size,
        type: value.type,
      };
    } else {
      obj[key] = value;
    }
  }
  return obj;
};

/**
 * Enhanced HTTP methods with better error handling
 */
export const get = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error(`GET ${url} failed:`, errorMessage);
    throw new Error(errorMessage);
  }
};

export const post = async (url, data = {}, config = {}) => {
  try {
    // Log FormData for debugging
    if (data instanceof FormData && import.meta.env.DEV) {
      console.log('📤 Sending FormData to', url, formDataToObject(data));
    }
    
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error(`POST ${url} failed:`, errorMessage);
    throw new Error(errorMessage);
  }
};

export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error(`PUT ${url} failed:`, errorMessage);
    throw new Error(errorMessage);
  }
};

export const patch = async (url, data = {}, config = {}) => {
  try {
    const response = await api.patch(url, data, config);
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error(`PATCH ${url} failed:`, errorMessage);
    throw new Error(errorMessage);
  }
};



// Add upload method for file uploads
export const upload = async (url, formData, onProgress = null) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    if (onProgress) {
      config.onUploadProgress = onProgress;
    }
    
    const response = await api.post(url, formData, config);
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error(`UPLOAD ${url} failed:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// =====================
// STUDENT SERVICE - FIXED (NO DOUBLE /api/)
// =====================

export const studentService = {
  // Main student endpoints - REMOVED the leading /api/ since BASE_URL already has it
  getStudents: (params = {}) => get('/students/api/', { params }).then(res => ({
    results: res.results || res.data?.results || res.data || res || [],
    count: res.count || res.data?.count || 0,
    next: res.next,
    previous: res.previous,
    total_pages: res.total_pages || 1,
    current_page: res.current_page || 1
  })).catch(() => ({ 
    success: false,
    results: [], 
    count: 0,
    total_pages: 1,
    current_page: 1
  })),
  
  // Search students
  searchStudents: (term, params = {}) => {
    const searchParams = { search: term, ...params };
    return get('/students/api/', { params: searchParams }).then(res => 
      res.results || res.data?.results || res.data || res || []
    ).catch(() => []);
  },
  
  // Get single student
  getStudentById: (id) => get(`/students/api/${id}/`).catch(() => null),
  
  // Create student
  createStudent: (data) => post('/students/create/', data),
  
  // Update student
  updateStudent: (id, data) => put(`/students/api/${id}/full-update/`, data).catch(() => 
    put(`/students/api/${id}/`, data)
  ),
  
  // Delete student
  deleteStudent: (id) => del(`/students/api/${id}/delete/`).catch(() => 
    del(`/students/api/${id}/`)
  )
};

// =====================
// ACADEMIC SERVICE - FIXED (NO DOUBLE /api/)
// =====================

export const academicService = {
  // Sessions
  getAcademicSessions: (params) => get('/academic/sessions/', { params }),
  getAcademicSessionById: (id) => get(`/academic/sessions/${id}/`),
  getCurrentAcademicSession: () => get('/academic/sessions/current/'),
  
  // Terms
  getAcademicTerms: (params) => get('/academic/terms/', { params }),
  getAcademicTermById: (id) => get(`/academic/terms/${id}/`),
  getCurrentAcademicTerm: () => get('/academic/terms/current/'),
  
  // Classes
  getClasses: (params) => get('/academic/classes/', { params }),
  getClassById: (id) => get(`/academic/classes/${id}/`),
  
  // Subjects
  getSubjects: (params) => get('/academic/subjects/', { params }),
  getSubjectById: (id) => get(`/academic/subjects/${id}/`),
  
  // Class Levels
  getClassLevels: (params) => get('/academic/class-levels/', { params }),
  getClassLevelById: (id) => get(`/academic/class-levels/${id}/`),
  
  // Programs
  getPrograms: () => get('/academic/programs/'),
  getProgramById: (id) => get(`/academic/programs/${id}/`),
  
  // Teacher Options
  getTeacherOptions: () => get('/staff/api/').then(res => {
    const teachers = res.results || res.data?.results || res.data || res || [];
    return teachers.map(staff => ({
      id: staff.id,
      name: staff.user?.get_full_name || 
            `${staff.user?.first_name || ''} ${staff.user?.last_name || ''}`.trim() ||
            staff.name || `Teacher ${staff.id}`
    }));
  }).catch(() => [])
};

// =====================
// RESULT SERVICE - FIXED (NO DOUBLE /api/)
// =====================

export const resultService = {
  // Main Results CRUD
  getStudentResults: (params) => get('/results/results/', { params }),
  getStudentResult: (id) => get(`/results/results/${id}/`),
  createStudentResult: (data) => post('/results/results/', data),
  updateStudentResult: (id, data) => put(`/results/results/${id}/`, data),
  deleteStudentResult: (id) => del(`/results/results/${id}/`),
  
  // Result Actions
  publishResult: (id) => post(`/results/results/${id}/publish/`),
  approveResult: (id) => post(`/results/results/${id}/approve/`),
  bulkUploadResults: (formData) => upload('/results/results/bulk-upload/', formData),
  
  // Related Data
  getSubjectScores: () => get('/results/subject-scores/'),
  createSubjectScore: (data) => post('/results/subject-scores/', data),
  updateSubjectScore: (id, data) => put(`/results/subject-scores/${id}/`, data),
  deleteSubjectScore: (id) => del(`/results/subject-scores/${id}/`),
  
  // Psychomotor Skills
  getPsychomotorSkills: () => get('/results/psychomotor-skills/'),
  createPsychomotorSkills: (data) => post('/results/psychomotor-skills/', data),
  updatePsychomotorSkills: (id, data) => put(`/results/psychomotor-skills/${id}/`, data),
  deletePsychomotorSkills: (id) => del(`/results/psychomotor-skills/${id}/`),
  
  // Affective Domains
  getAffectiveDomains: () => get('/results/affective-domains/'),
  createAffectiveDomain: (data) => post('/results/affective-domains/', data),
  updateAffectiveDomain: (id, data) => put(`/results/affective-domains/${id}/`, data),
  deleteAffectiveDomain: (id) => del(`/results/affective-domains/${id}/`),
  
  // Result Publishing
  getResultPublishing: () => get('/results/result-publishing/'),
  createResultPublishing: (data) => post('/results/result-publishing/', data),
  updateResultPublishing: (id, data) => put(`/results/result-publishing/${id}/`, data),
  deleteResultPublishing: (id) => del(`/results/result-publishing/${id}/`),
  togglePublish: (id) => post(`/results/result-publishing/${id}/toggle-publish/`),
  
  // Statistics
  getResultStatistics: () => get('/results/statistics/').catch(() => null),
  
  // Teacher Data
  // getTeachers: () => get('/staff/api/').then(res => res.results || res.data?.results || res || []).catch(() => [])
  getTeachers: () => get('/staff/api/').then(res => {
      const staffList = res.results || res.data?.results || res.data || res || [];
      return staffList.map(staff => ({
        id: staff.id,
        name: staff.user?.get_full_name || 
              `${staff.user?.first_name || ''} ${staff.user?.last_name || ''}`.trim() ||
              staff.name || `Staff ${staff.id}`,
        role: staff.role,
        staff_id: staff.staff_id
      }));
    }).catch(() => [])
  
};

export const formatResultData = (formData) => {
  return {
    student_id: formData.student,
    session_id: formData.session,
    term_id: formData.term,
    class_id: formData.class_obj,
    frequency_of_school_opened: parseInt(formData.frequency_of_school_opened) || 0,
    no_of_times_present: parseInt(formData.no_of_times_present) || 0,
    no_of_times_absent: parseInt(formData.no_of_times_absent) || 0,
    weight_beginning_of_term: formData.weight_beginning_of_term ? parseFloat(formData.weight_beginning_of_term) : null,
    weight_end_of_term: formData.weight_end_of_term ? parseFloat(formData.weight_end_of_term) : null,
    height_beginning_of_term: formData.height_beginning_of_term ? parseFloat(formData.height_beginning_of_term) : null,
    height_end_of_term: formData.height_end_of_term ? parseFloat(formData.height_end_of_term) : null,
    subject_scores: formData.subject_scores.map(score => ({
      subject_id: score.subject,
      ca_obtainable: 40,
      exam_obtainable: 60,
      ca_score: parseFloat(score.ca_score) || 0,
      exam_score: parseFloat(score.exam_score) || 0,
      grade: score.grade,
      teacher_comment: score.teacher_comment || ''
    })),
    psychomotor_skills: formData.psychomotor_skills,
    affective_domains: formData.affective_domains,
    class_teacher_comment: formData.class_teacher_comment || '',
    headmaster_comment: formData.headmaster_comment || '',
    next_term_begins_on: formData.next_term_begins_on || null,
    next_term_fees: formData.next_term_fees ? parseFloat(formData.next_term_fees) : null,
    is_promoted: formData.is_promoted || false,
    class_teacher_id: formData.class_teacher || null,
    headmaster_id: formData.headmaster || null,
    is_published: formData.is_published || false
  };
};

export const del = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error(`DELETE ${url} failed:`, errorMessage);
    
    // Check for specific error cases
    if (error.response?.status === 500) {
      throw new Error('Cannot delete this result. It may have related records (like subject scores) that need to be deleted first.');
    }
    
    throw new Error(errorMessage);
  }
};

export default api;



