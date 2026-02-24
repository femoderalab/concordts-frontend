/**
 * Complete Academic API Service
 * Handles all academic-related API calls
 */

import { get, post, put, del, handleApiError } from './api';

// =====================
// ACADEMIC SESSIONS
// =====================

export const getAcademicSessions = async (params = {}) => {
  try {
    const response = await get('/academic/sessions/', { params });
    return response;
  } catch (error) {
    console.error('Error fetching academic sessions:', error);
    throw error;
  }
};

export const getAcademicSessionById = async (sessionId) => {
  try {
    const response = await get(`/academic/sessions/${sessionId}/`);
    return response;
  } catch (error) {
    console.error(`Error fetching academic session ${sessionId}:`, error);
    throw error;
  }
};

export const createAcademicSession = async (sessionData) => {
  try {
    const response = await post('/academic/sessions/create/', sessionData);
    return response;
  } catch (error) {
    console.error('Error creating academic session:', error);
    throw error;
  }
};

export const updateAcademicSession = async (sessionId, sessionData) => {
  try {
    const response = await put(`/academic/sessions/${sessionId}/`, sessionData);
    return response;
  } catch (error) {
    console.error(`Error updating academic session ${sessionId}:`, error);
    throw error;
  }
};

export const deleteAcademicSession = async (sessionId) => {
  try {
    const response = await del(`/academic/sessions/${sessionId}/`);
    return response;
  } catch (error) {
    console.error(`Error deleting academic session ${sessionId}:`, error);
    throw error;
  }
};

export const getCurrentAcademicSession = async () => {
  try {
    const response = await get('/academic/sessions/current/');
    return response.data.session || response.data;
  } catch (error) {
    console.error('Error fetching current session:', error);
    return null;
  }
};

// =====================
// ACADEMIC TERMS
// =====================

export const getAcademicTerms = async (params = {}) => {
  try {
    const response = await get('/academic/terms/', { params });
    return response;
  } catch (error) {
    console.error('Error fetching academic terms:', error);
    throw error;
  }
};

export const getAcademicTermById = async (termId) => {
  try {
    const response = await get(`/academic/terms/${termId}/`);
    return response;
  } catch (error) {
    console.error(`Error fetching academic term ${termId}:`, error);
    throw error;
  }
};

export const createAcademicTerm = async (termData) => {
  try {
    const response = await post('/academic/terms/create/', termData);
    return response;
  } catch (error) {
    console.error('Error creating academic term:', error);
    throw error;
  }
};

export const updateAcademicTerm = async (termId, termData) => {
  try {
    const response = await put(`/academic/terms/${termId}/`, termData);
    return response;
  } catch (error) {
    console.error(`Error updating academic term ${termId}:`, error);
    throw error;
  }
};

export const deleteAcademicTerm = async (termId) => {
  try {
    const response = await del(`/academic/terms/${termId}/`);
    return response;
  } catch (error) {
    console.error(`Error deleting academic term ${termId}:`, error);
    throw error;
  }
};

export const getCurrentAcademicTerm = async () => {
  try {
    const response = await get('/academic/terms/current/');
    return response.data.term || response.data;
  } catch (error) {
    console.error('Error fetching current term:', error);
    return null;
  }
};

// =====================
// PROGRAMS
// =====================

export const getPrograms = async () => {
  try {
    const response = await get('/academic/programs/');
    return response;
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
};

export const getProgramById = async (programId) => {
  try {
    const response = await get(`/academic/programs/${programId}/`);
    return response;
  } catch (error) {
    console.error(`Error fetching program ${programId}:`, error);
    throw error;
  }
};

export const createProgram = async (programData) => {
  try {
    const response = await post('/academic/programs/create/', programData);
    return response;
  } catch (error) {
    console.error('Error creating program:', error);
    throw error;
  }
};

export const updateProgram = async (programId, programData) => {
  try {
    const response = await put(`/academic/programs/${programId}/`, programData);
    return response;
  } catch (error) {
    console.error(`Error updating program ${programId}:`, error);
    throw error;
  }
};

export const deleteProgram = async (programId) => {
  try {
    const response = await del(`/academic/programs/${programId}/`);
    return response;
  } catch (error) {
    console.error(`Error deleting program ${programId}:`, error);
    throw error;
  }
};

// =====================
// CLASS LEVELS
// =====================

export const getClassLevels = async (params = {}) => {
  try {
    const response = await get('/academic/class-levels/', { params });
    return response;
  } catch (error) {
    console.error('Error fetching class levels:', error);
    throw error;
  }
};

export const getClassLevelById = async (classLevelId) => {
  try {
    const response = await get(`/academic/class-levels/${classLevelId}/`);
    return response;
  } catch (error) {
    console.error(`Error fetching class level ${classLevelId}:`, error);
    throw error;
  }
};

export const createClassLevel = async (classLevelData) => {
  try {
    const response = await post('/academic/class-levels/create/', classLevelData);
    return response;
  } catch (error) {
    console.error('Error creating class level:', error);
    throw error;
  }
};

export const updateClassLevel = async (classLevelId, classLevelData) => {
  try {
    const response = await put(`/academic/class-levels/${classLevelId}/`, classLevelData);
    return response;
  } catch (error) {
    console.error(`Error updating class level ${classLevelId}:`, error);
    throw error;
  }
};

export const deleteClassLevel = async (classLevelId) => {
  try {
    const response = await del(`/academic/class-levels/${classLevelId}/`);
    return response;
  } catch (error) {
    console.error(`Error deleting class level ${classLevelId}:`, error);
    throw error;
  }
};

// export const getClassArms = async (classLevelId) => {
//   try {
//     const response = await get(`/academic/class-levels/${classLevelId}/arms/`);
//     return response;
//   } catch (error) {
//     console.error(`Error fetching class arms for level ${classLevelId}:`, error);
//     return { arms: [] };
//   }
// };

// =====================
// SUBJECTS
// =====================

export const getSubjects = async (params = {}) => {
  try {
    const response = await get('/academic/subjects/', { params });
    return response;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};

export const getSubjectById = async (subjectId) => {
  try {
    const response = await get(`/academic/subjects/${subjectId}/`);
    return response;
  } catch (error) {
    console.error(`Error fetching subject ${subjectId}:`, error);
    throw error;
  }
};

export const createSubject = async (subjectData) => {
  try {
    const response = await post('/academic/subjects/create/', subjectData);
    return response;
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

export const updateSubject = async (subjectId, subjectData) => {
  try {
    const response = await put(`/academic/subjects/${subjectId}/`, subjectData);
    return response;
  } catch (error) {
    console.error(`Error updating subject ${subjectId}:`, error);
    throw error;
  }
};

export const deleteSubject = async (subjectId) => {
  try {
    const response = await del(`/academic/subjects/${subjectId}/`);
    return response;
  } catch (error) {
    console.error(`Error deleting subject ${subjectId}:`, error);
    throw error;
  }
};

// =====================
// CLASSES
// =====================

export const getClasses = async (params = {}) => {
  try {
    const response = await get('/academic/classes/', { params });
    return response;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

export const getClassById = async (classId) => {
  try {
    const response = await get(`/academic/classes/${classId}/`);
    return response;
  } catch (error) {
    console.error(`Error fetching class ${classId}:`, error);
    throw error;
  }
};

export const getClassesWithDetails = async (params = {}) => {
  try {
    const response = await get('/academic/classes/detailed/', { params });
    return response;
  } catch (error) {
    console.error('Error fetching classes with details:', error);
    return { results: [] };
  }
};

export const createClass = async (classData) => {
  try {
    const response = await post('/academic/classes/create/', classData);
    return response;
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

export const updateClass = async (classId, classData) => {
  try {
    const response = await put(`/academic/classes/${classId}/`, classData);
    return response;
  } catch (error) {
    console.error(`Error updating class ${classId}:`, error);
    throw error;
  }
};

export const deleteClass = async (classId) => {
  try {
    const response = await del(`/academic/classes/${classId}/`);
    return response;
  } catch (error) {
    console.error(`Error deleting class ${classId}:`, error);
    throw error;
  }
};

export const getClassDashboard = async (classId) => {
  try {
    const response = await get(`/academic/classes/${classId}/dashboard/`);
    return response;
  } catch (error) {
    console.error(`Error fetching class dashboard ${classId}:`, error);
    throw error;
  }
};

// =====================
// CLASS SUBJECT ASSIGNMENTS
// =====================

export const getClassSubjects = async (params = {}) => {
  try {
    const response = await get('/academic/class-subjects/', { params });
    return response;
  } catch (error) {
    console.error('Error fetching class subjects:', error);
    throw error;
  }
};

export const getClassSubjectById = async (assignmentId) => {
  try {
    const response = await get(`/academic/class-subjects/${assignmentId}/`);
    return response;
  } catch (error) {
    console.error(`Error fetching class-subject assignment ${assignmentId}:`, error);
    throw error;
  }
};

export const createClassSubject = async (assignmentData) => {
  try {
    const response = await post('/academic/class-subjects/create/', assignmentData);
    return response;
  } catch (error) {
    console.error('Error creating class-subject assignment:', error);
    throw error;
  }
};

export const updateClassSubject = async (assignmentId, assignmentData) => {
  try {
    const response = await put(`/academic/class-subjects/${assignmentId}/`, assignmentData);
    return response;
  } catch (error) {
    console.error(`Error updating class-subject assignment ${assignmentId}:`, error);
    throw error;
  }
};

export const deleteClassSubject = async (assignmentId) => {
  try {
    const response = await del(`/academic/class-subjects/${assignmentId}/`);
    return response;
  } catch (error) {
    console.error(`Error deleting class-subject assignment ${assignmentId}:`, error);
    throw error;
  }
};

export const bulkAssignClassSubjects = async (assignments) => {
  try {
    const response = await post('/academic/class-subjects/bulk-assign/', { assignments });
    return response;
  } catch (error) {
    console.error('Error in bulk class subject assignment:', error);
    throw error;
  }
};

// =====================
// TEACHER ASSIGNMENTS
// =====================

export const getTeacherAssignments = async (teacherId = null) => {
  try {
    const url = teacherId 
      ? `/academic/teachers/${teacherId}/assignments/`
      : '/academic/teachers/assignments/';
    const response = await get(url);
    return response;
  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    throw error;
  }
};

// =====================
// DASHBOARD & STATISTICS
// =====================

export const getAcademicDashboard = async () => {
  try {
    const response = await get('/academic/dashboard/');
    return response;
  } catch (error) {
    console.error('Error fetching academic dashboard:', error);
    throw error;
  }
};

export const getAcademicOverview = async () => {
  try {
    const response = await get('/academic/dashboard/overview/');
    return response;
  } catch (error) {
    console.error('Error fetching academic overview:', error);
    throw error;
  }
};

export const getDetailedStatistics = async () => {
  try {
    const response = await get('/academic/dashboard/statistics/');
    return response;
  } catch (error) {
    console.error('Error fetching detailed statistics:', error);
    throw error;
  }
};

export const getClassStatistics = async () => {
  try {
    const response = await get('/academic/statistics/classes/');
    return response;
  } catch (error) {
    console.error('Error fetching class statistics:', error);
    throw error;
  }
};

export const getPublicAcademicStructure = async () => {
  try {
    const response = await get('/academic/public/structure/');
    return response;
  } catch (error) {
    console.error('Error fetching public academic structure:', error);
    throw error;
  }
};

export const getPublicAcademicCalendar = async () => {
  try {
    const response = await get('/academic/public/calendar/');
    return response;
  } catch (error) {
    console.error('Error fetching public academic calendar:', error);
    throw error;
  }
};

// =====================
// COMPREHENSIVE DATA
// =====================

export const getAcademicData = async () => {
  try {
    const [
      sessions,
      terms,
      programs,
      classLevels,
      subjects,
      classes,
      currentSession,
      currentTerm
    ] = await Promise.all([
      getAcademicSessions().catch(() => ({ results: [] })),
      getAcademicTerms().catch(() => ({ results: [] })),
      getPrograms().catch(() => ({ results: [] })),
      getClassLevels().catch(() => ({ results: [] })),
      getSubjects().catch(() => ({ results: [] })),
      getClasses().catch(() => ({ results: [] })),
      getCurrentAcademicSession().catch(() => null),
      getCurrentAcademicTerm().catch(() => null)
    ]);

    return {
      sessions: sessions.results || sessions || [],
      terms: terms.results || terms || [],
      programs: programs.results || programs || [],
      classLevels: classLevels.results || classLevels || [],
      subjects: subjects.results || subjects || [],
      classes: classes.results || classes || [],
      currentSession,
      currentTerm
    };
  } catch (error) {
    console.error('Error fetching comprehensive academic data:', error);
    return {
      sessions: [],
      terms: [],
      programs: [],
      classLevels: [],
      subjects: [],
      classes: [],
      currentSession: null,
      currentTerm: null
    };
  }
};

export const getAcademicStatistics = async () => {
  try {
    const [
      classLevels,
      subjects,
      sessions,
      programs,
      classes
    ] = await Promise.all([
      getClassLevels(),
      getSubjects(),
      getAcademicSessions(),
      getPrograms(),
      getClasses()
    ]);

    const classLevelsCount = classLevels.results?.length || classLevels.length || 0;
    const subjectsCount = subjects.results?.length || subjects.length || 0;
    const sessionsCount = sessions.results?.length || sessions.length || 0;
    const programsCount = programs.results?.length || programs.length || 0;
    const classesCount = classes.results?.length || classes.length || 0;

    return {
      totalClassLevels: classLevelsCount,
      totalSubjects: subjectsCount,
      totalSessions: sessionsCount,
      totalPrograms: programsCount,
      totalClasses: classesCount
    };
  } catch (error) {
    console.error('Error fetching academic statistics:', error);
    return {
      totalClassLevels: 0,
      totalSubjects: 0,
      totalSessions: 0,
      totalPrograms: 0,
      totalClasses: 0
    };
  }
};

// =====================
// OPTIONS FOR DROPDOWNS
// =====================

export const getClassLevelOptions = async () => {
  try {
    const classLevels = await getClassLevels();
    const levels = classLevels.results || classLevels || [];
    
    // Get programs for names
    const programs = await getPrograms();
    const programsData = programs.results || programs || [];
    const programsMap = {};
    programsData.forEach(program => {
      programsMap[program.id] = program.name;
    });
    
    return levels.map(level => ({
      id: level.id,
      name: level.name,
      code: level.code,
      level: level.level,
      program: {
        id: level.program,
        name: programsMap[level.program] || 'Unknown Program'
      }
    }));
  } catch (error) {
    console.error('Error fetching class level options:', error);
    return [];
  }
};

export const getSubjectOptions = async () => {
  try {
    const subjects = await getSubjects();
    const subjectsData = subjects.results || subjects || [];
    
    return subjectsData.map(subject => ({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      subject_type: subject.subject_type,
      stream: subject.stream,
      pass_mark: subject.pass_mark
    }));
  } catch (error) {
    console.error('Error fetching subject options:', error);
    return [];
  }
};

export const getTeacherOptions = async () => {
  try {
    // Try to get teachers from staff API
    const response = await get('/staff/');
    
    // Filter or map teachers based on your API response
    const teachers = response.data?.results || response.data || [];
    
    return teachers.map(staff => ({
      id: staff.id,
      name: staff.user?.get_full_name || 
            staff.user?.full_name || 
            `${staff.user?.first_name || ''} ${staff.user?.last_name || ''}`.trim() ||
            staff.name ||
            `Teacher ${staff.id}`
    }));
  } catch (error) {
    console.warn('Could not load teachers from API, using fallback data');
    return [
      { id: 1, name: 'Mr. Johnson (Math)' },
      { id: 2, name: 'Mrs. Smith (English)' },
      { id: 3, name: 'Dr. Williams (Science)' },
      { id: 4, name: 'Ms. Davis (Social Studies)' },
      { id: 5, name: 'Mr. Brown (Arts)' }
    ];
  }
};

// =====================
// BULK OPERATIONS
// =====================

export const bulkPromoteStudents = async (promotionData) => {
  try {
    const response = await post('/academic/promotions/bulk/', promotionData);
    return response;
  } catch (error) {
    console.error('Error in bulk promotion:', error);
    throw error;
  }
};

// school-management-frontend/src/services/academicService.js

// ... existing code ...

// Class Arms API
export const getClassArms = async () => {
  try {
    const response = await get('/academic/class-arms/');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createClassArm = async (data) => {
  try {
    const response = await post('/academic/class-arms/', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateClassArm = async (id, data) => {
  try {
    const response = await put(`/academic/class-arms/${id}/`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};



export const deleteClassArm = async (id) => {
  try {
    const response = await del(`/academic/class-arms/${id}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Promotions API
export const getPromotions = async () => {
  try {
    const response = await get('/academic/promotions/');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createPromotion = async (data) => {
  try {
    const response = await post('/academic/promotions/', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updatePromotion = async (id, data) => {
  try {
    const response = await put(`/academic/promotions/${id}/`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deletePromotion = async (id) => {
  try {
    const response = await del(`/academic/promotions/${id}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


// =====================
// EXPORT ALL FUNCTIONS
// =====================

const academicService = {
  // Sessions
  getAcademicSessions,
  getAcademicSessionById,
  createAcademicSession,
  updateAcademicSession,
  deleteAcademicSession,
  getCurrentAcademicSession,
  
  // Terms
  getAcademicTerms,
  getAcademicTermById,
  createAcademicTerm,
  updateAcademicTerm,
  deleteAcademicTerm,
  getCurrentAcademicTerm,
  
  // Programs
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  
  // Class Levels
  getClassLevels,
  getClassLevelById,
  createClassLevel,
  updateClassLevel,
  deleteClassLevel,
  getClassArms,
  getClassLevelOptions,
  
  // Subjects
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectOptions,
  
  // Classes
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassesWithDetails,
  getClassDashboard,
  
  // Class Subjects
  getClassSubjects,
  getClassSubjectById,
  createClassSubject,
  updateClassSubject,
  deleteClassSubject,
  bulkAssignClassSubjects,
  
  // Teacher Assignments
  getTeacherAssignments,
  
  // Teacher Options
  getTeacherOptions,
  
  // Dashboard & Statistics
  getAcademicDashboard,
  getAcademicOverview,
  getDetailedStatistics,
  getClassStatistics,
  getAcademicData,
  getAcademicStatistics,
  
  // Public Data
  getPublicAcademicStructure,
  getPublicAcademicCalendar,

  createClassArm,
  updateClassArm,
  deleteClassArm,
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  
  // Bulk Operations
  bulkPromoteStudents,
};

export default academicService;