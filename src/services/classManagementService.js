/**
 * Class Management Service - Students and Teachers per class
 */

import { get, post, del } from './api';

const BASE = '/academic';

// ─── Get all class levels with their classes and student counts ───
export const getAllClassesWithStudents = async () => {
  try {
    const response = await get(`${BASE}/classes/all-with-students/`);
    return response.data || response;
  } catch (error) {
    console.error('Error fetching all classes:', error);
    throw error;
  }
};

// ─── Get detailed class info with students and teachers ──────────
export const getClassDetailWithStudents = async (classId) => {
  try {
    const response = await get(`${BASE}/classes/${classId}/with-students/`);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching class ${classId} details:`, error);
    throw error;
  }
};

// ─── Get ALL AVAILABLE STAFF (FETCH ALL PAGES - NO PAGINATION LIMIT) ─────
export const getAvailableStaff = async (searchTerm = '') => {
  try {
    console.log('📋 Fetching ALL staff members from all pages...');
    
    let allStaff = [];
    let currentPage = 1;
    let hasMore = true;
    let totalStaff = 0;
    
    // Keep fetching until we have all pages
    while (hasMore) {
      const params = {
        is_active: 'true',
        page: currentPage,
        page_size: 100, // Fetch 100 per page
      };
      
      if (searchTerm && searchTerm.length > 0) {
        params.search = searchTerm;
      }
      
      const response = await get('/staff/api/', { params });
      
      const staffData = response.results || response.data?.results || response.data || [];
      const count = response.count || staffData.length;
      
      if (currentPage === 1) {
        totalStaff = count;
        console.log(`📊 Total staff members in system: ${totalStaff}`);
      }
      
      allStaff = [...allStaff, ...staffData];
      console.log(`📥 Fetched page ${currentPage}, got ${staffData.length} staff, total so far: ${allStaff.length}`);
      
      // Check if there are more pages
      const nextPage = response.next;
      hasMore = !!nextPage;
      currentPage++;
      
      // Safety limit - don't fetch more than 20 pages (2000 staff)
      if (currentPage > 20) {
        console.warn('Reached maximum page limit (20 pages)');
        hasMore = false;
      }
    }
    
    console.log(`✅ Total staff fetched: ${allStaff.length} out of ${totalStaff}`);
    
    // Format staff data consistently - INCLUDE ALL ROLES
    const formattedStaff = allStaff.map(s => ({
      id: s.id,
      name: `${s.user?.first_name || ''} ${s.user?.last_name || ''}`.trim() || s.name || 'Unknown',
      staff_id: s.staff_id || s.user?.registration_number || 'N/A',
      position: s.position_title || s.department || s.role || 'Staff Member',
      role: s.user?.role || s.role || 'staff',
      email: s.user?.email || s.email || '',
      phone: s.user?.phone_number || s.phone || '',
      is_active: s.is_active !== false,
      department: s.department || 'General',
    }));
    
    // Log role breakdown for debugging
    const roleCount = {};
    formattedStaff.forEach(s => {
      const role = s.role;
      roleCount[role] = (roleCount[role] || 0) + 1;
    });
    console.log('📊 Staff breakdown by role:', roleCount);
    
    return { staff: formattedStaff };
  } catch (error) {
    console.error('Error fetching available staff:', error);
    return { staff: [] };
  }
};

// ─── Get available teachers (NOW RETURNS ALL STAFF) ────────────
export const getAvailableTeachers = async () => {
  // Now returns ALL staff members, not just teachers
  return getAvailableStaff();
};

// ─── Assign class teacher (can assign ANY staff member) ─────────
export const assignClassTeacher = async (classId, staffId) => {
  try {
    const response = await post(`${BASE}/classes/${classId}/assign-class-teacher/`, {
      staff_id: staffId
    });
    return response.data || response;
  } catch (error) {
    console.error('Error assigning class teacher:', error);
    throw error;
  }
};

// ─── Remove class teacher ────────────────────────────────────────
export const removeClassTeacher = async (classId) => {
  try {
    const response = await post(`${BASE}/classes/${classId}/remove-class-teacher/`);
    return response.data || response;
  } catch (error) {
    console.error('Error removing class teacher:', error);
    throw error;
  }
};

// ─── Assign assistant teacher (can assign ANY staff member) ─────
export const assignAssistantTeacher = async (classId, staffId) => {
  const response = await post(`${BASE}/classes/${classId}/assign-assistant/`, {
    staff_id: staffId
  });
  return response.data || response;
};

export const removeAssistantTeacher = async (classId, staffId) => {
  const response = await post(`${BASE}/classes/${classId}/remove-assistant/`, {
    staff_id: staffId
  });
  return response.data || response;
};

/**
 * Get all staff members assigned to a class
 * @param {number} classId - Class ID
 * @returns {Promise} - Staff list
 */
export const getClassStaff = async (classId) => {
  try {
    const response = await get(`/staff/api/by_class/?class_id=${classId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching class staff:', error);
    throw error;
  }
};

/**
 * Get available teachers for assignment (not yet assigned to this class)
 * @param {number} classId - Class ID to exclude
 * @returns {Promise} - Available teachers
 */
export const getAvailableTeachersForClass = async (classId) => {
  try {
    // Fetch ALL staff first
    const allStaff = await getAvailableStaff();
    let availableStaff = allStaff.staff || [];
    
    // Get already assigned staff for this class
    const assignedStaff = await getClassStaff(classId);
    const assignedIds = assignedStaff.assigned_staff?.map(s => s.id) || [];
    
    // Filter out already assigned
    const available = availableStaff.filter(s => !assignedIds.includes(s.id));
    
    console.log(`Available staff for class ${classId}: ${available.length} out of ${availableStaff.length}`);
    
    return available.map(s => ({
      id: s.id,
      name: s.name,
      staff_id: s.staff_id,
      position: s.position,
      role: s.role,
    }));
  } catch (error) {
    console.error('Error fetching available teachers:', error);
    return [];
  }
};

export default {
  getAllClassesWithStudents,
  getClassDetailWithStudents,
  getAvailableStaff,
  getAvailableTeachers,
  assignClassTeacher,
  removeClassTeacher,
  assignAssistantTeacher,
  removeAssistantTeacher,
  getClassStaff,
  getAvailableTeachersForClass,
};