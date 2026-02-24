import { get, post, put, del, upload } from './api';

// Updated resultService with correct endpoints
const resultService = {
  // Main Results CRUD - Using correct endpoints without /api prefix since baseURL has it
  getStudentResults: (params) => get('/results/results/', { params }),
  getStudentResult: (id) => get(`/results/results/${id}/`),
  createStudentResult: (data) => post('/results/results/', data),
  updateStudentResult: (id, data) => put(`/results/results/${id}/`, data),
  // deleteStudentResult: (id) => del(`/results/results/${id}/`),

// In resultService object
  deleteStudentResult: (id) => {
    // First try the specific delete endpoint
    return del(`/results/results/${id}/`).catch((error) => {
      // If that fails, try alternative endpoint
      console.log('Trying alternative delete endpoint...');
      return del(`/results/results/${id}/delete/`);
    });
  },
  
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
  getResultStatistics: () => get('/results/statistics/'),
  
  // Academic Data
  getSessions: () => get('/academic/sessions/'),
  getTerms: () => get('/academic/terms/'),
  getClasses: () => get('/academic/classes/'),
  getSubjects: () => get('/academic/subjects/'),
  
  // Student Data
  getStudents: () => get('/students/api/'),
  
  // Teacher Data - FIXED VERSION

  getTeachers: () => get('/staff/api/').then(res => {
    // Handle different response formats
    let staffList = [];
    
    if (Array.isArray(res)) {
      staffList = res;
    } else if (res?.results) {
      staffList = res.results;
    } else if (res?.data?.results) {
      staffList = res.data.results;
    } else if (res?.data) {
      staffList = Array.isArray(res.data) ? res.data : [res.data];
    }
    
    // Properly format teacher data with names
    return staffList.map(staff => {
      let fullName = 'Unknown Teacher';
      
      if (staff.user) {
        // Try different name formats
        if (staff.user.get_full_name) {
          fullName = staff.user.get_full_name;
        } else if (staff.user.first_name && staff.user.last_name) {
          fullName = `${staff.user.first_name} ${staff.user.last_name}`;
        } else if (staff.user.username) {
          fullName = staff.user.username;
        } else if (staff.user.email) {
          fullName = staff.user.email.split('@')[0];
        }
      } else if (staff.name) {
        fullName = staff.name;
      } else if (staff.first_name && staff.last_name) {
        fullName = `${staff.first_name} ${staff.last_name}`;
      }
      
      // Add role if available
      const role = staff.role || staff.position || staff.staff_type || '';
      const displayName = role ? `${fullName} (${role})` : fullName;
      
      return {
        id: staff.id,
        name: displayName,
        full_name: fullName,
        role: role,
        user: staff.user || null,
        staff_id: staff.staff_id || '',
        is_active: staff.is_active !== false
      };
    });
  }).catch(() => [])
};