import api from './api';

// ==========================================
// STAFF SERVICE - CORRECTED VERSION
// All CRUD operations properly connected to backend
// ==========================================

/**
 * Get all staff with pagination and filters
 * @param {Object} params - Query parameters (page, page_size, department, etc.)
 * @returns {Promise} Staff list response
 */
export const getAllStaff = async (params = {}) => {
  try {
    const response = await api.get('/staff/api/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get staff by ID - FIXED to fetch complete staff details
 * @param {number} id - Staff ID
 * @returns {Promise} Staff details with user information
 */
export const getStaffById = async (id) => {
  try {
    const response = await api.get(`/staff/api/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new staff member
 * @param {FormData|Object} staffData - Staff data
 * @returns {Promise} Created staff response
 */
export const createStaff = async (staffData) => {
  try {
    const config = {
      headers: {
        'Content-Type': staffData instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    };
    
    const response = await api.post('/staff/api/', staffData, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update staff member - FIXED to properly send all data
 * @param {number} id - Staff ID
 * @param {FormData|Object} staffData - Updated staff data
 * @returns {Promise} Updated staff response
 */
export const updateStaff = async (id, staffData) => {
  try {
    let config = {};
    let payload = staffData;
    
    // Check if staffData is FormData or Object
    if (staffData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
    } else {
      // If it's an object, prepare it properly
      const formData = new FormData();
      
      Object.keys(staffData).forEach(key => {
        const value = staffData[key];
        
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else if (value === '') {
            // Send empty string as is
            formData.append(key, '');
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      payload = formData;
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
    }
    
    const response = await api.put(`/staff/api/${id}/`, payload, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete staff member - FIXED endpoint
 * @param {number} id - Staff ID
 * @returns {Promise} Delete response
 */
export const deleteStaff = async (id) => {
  try {
    const response = await api.delete(`/staff/api/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search staff
 * @param {string} searchTerm - Search query
 * @param {Object} params - Additional parameters
 * @returns {Promise} Search results
 */
export const searchStaff = async (searchTerm, params = {}) => {
  try {
    const response = await api.get('/staff/api/', {
      params: {
        search: searchTerm,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// =====================
// PASSWORD MANAGEMENT - UPDATED FOR SIMPLE PASSWORDS (MIN 5 CHARACTERS)
// =====================

/**
 * Update staff password - ONLY FOR ADMIN USE (head/hm)
 * Simple validation - minimum 5 characters only
 * @param {number} staffId - Staff ID
 * @param {Object} passwordData - Password data { new_password, confirm_password }
 * @returns {Promise<Object>} - Update result
 */
export const updateStaffPassword = async (staffId, passwordData) => {
  try {
    console.log(`🔐 ADMIN resetting password for staff ${staffId}...`);
    console.log('📦 Password data:', passwordData);
    
    // SIMPLE VALIDATION - only check if passwords match
    if (!passwordData.new_password || !passwordData.confirm_password) {
      throw new Error('Both password fields are required');
    }
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      throw new Error('Passwords do not match');
    }
    
    // SIMPLE: Only minimum 5 characters - no other validation
    if (passwordData.new_password.length < 5) {
      throw new Error('Password must be at least 5 characters long');
    }
    
    console.log('✓ Password validation passed (simple check)');
    // FIXED: Use update_password (with underscore) not update-password (with hyphen)
    console.log(`📤 Sending POST request to /staff/api/${staffId}/update_password/`);
    
    const response = await api.post(
      `/staff/api/${staffId}/update_password/`,  // FIXED: underscore instead of hyphen
      {
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password
      }
    );
    
    console.log('✅ PASSWORD UPDATE SUCCESSFUL');
    console.log('📊 Response:', response.data);
    
    return response.data;
    
  } catch (error) {
    console.error(`❌ Password update error for staff ${staffId}:`, error);
    
    let errorMessage = 'Failed to update password';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      console.error('🔍 BACKEND VALIDATION ERROR DETAILS:', errorData);
      
      // Show EXACT validation errors from backend
      if (errorData.errors) {
        const errorMessages = [];
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach(msg => {
              errorMessages.push(`${field}: ${msg}`);
              console.error(`   ${field}: ${msg}`);
            });
          } else if (typeof messages === 'string') {
            errorMessages.push(`${field}: ${messages}`);
            console.error(`   ${field}: ${messages}`);
          }
        });
        errorMessage = errorMessages.join('\n');
      } else if (errorData.message) {
        errorMessage = errorData.message;
        console.error(`   Message: ${errorData.message}`);
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
        console.error(`   Detail: ${errorData.detail}`);
      } else if (errorData.error) {
        errorMessage = errorData.error;
        console.error(`   Error: ${errorData.error}`);
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
        console.error(`   String: ${errorData}`);
      }
      
      console.error('📋 Complete error object:', JSON.stringify(errorData, null, 2));
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Activate staff member
 * @param {number} id - Staff ID
 * @param {Object} data - Activation data
 * @returns {Promise} Activation response
 */
export const activateStaff = async (id, data = {}) => {
  try {
    const response = await api.post(`/staff/api/${id}/activate/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deactivate staff member
 * @param {number} id - Staff ID
 * @param {Object} data - Deactivation data
 * @returns {Promise} Deactivation response
 */
export const deactivateStaff = async (id, data = {}) => {
  try {
    const response = await api.post(`/staff/api/${id}/deactivate/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get staff statistics
 * @returns {Promise} Staff statistics
 */
export const getStaffStatistics = async () => {
  try {
    const response = await api.get('/staff/api/statistics/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get staff by department
 * @param {string} department - Department name
 * @returns {Promise} Staff list
 */
export const getStaffByDepartment = async (department) => {
  try {
    const response = await api.get('/staff/api/', {
      params: { department }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Export staff data
 * @param {Object} params - Export parameters
 * @returns {Promise} Export file
 */
export const exportStaffData = async (params = {}) => {
  try {
    const response = await api.get('/staff/api/export/', {
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Assign staff to multiple classes
 * @param {number} staffId - Staff ID
 * @param {Array} classIds - Array of class IDs
 * @returns {Promise} - API response
 */
export const assignStaffToClasses = async (staffId, classIds) => {
  try {
    const response = await api.post(`/staff/api/${staffId}/assign_classes/`, {
      class_ids: classIds
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove staff from a specific class
 * @param {number} staffId - Staff ID
 * @param {number} classId - Class ID
 * @returns {Promise} - API response
 */
export const removeStaffFromClass = async (staffId, classId) => {
  try {
    const response = await api.delete(`/staff/api/${staffId}/remove_from_class/?class_id=${classId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get staff assignments (classes, subjects)
 * @param {number} staffId - Staff ID
 * @returns {Promise} - Staff assignments
 */
export const getStaffAssignments = async (staffId) => {
  try {
    const response = await api.get(`/staff/api/${staffId}/assignments/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Bulk update staff assignments
 * @param {number} staffId - Staff ID
 * @param {Object} assignments - { assigned_class_ids, assistant_class_ids, subject_ids }
 * @returns {Promise} - API response
 */
export const updateStaffAssignments = async (staffId, assignments) => {
  try {
    const response = await api.put(`/staff/api/${staffId}/update_assignments/`, assignments);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all staff members assigned to a specific class
 * @param {number} classId - Class ID
 * @returns {Promise} - List of staff in class
 */
export const getStaffByClass = async (classId) => {
  try {
    const response = await api.get(`/staff/api/by_class/?class_id=${classId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// src/services/staffService.js - ADD THESE FUNCTIONS

/**
 * Archive a staff member (set is_active=False)
 * @param {number} staffId - Staff ID
 * @returns {Promise<Object>} - Archive result
 */
export const archiveStaff = async (staffId) => {
  try {
    console.log(`📦 Archiving staff ${staffId}...`);
    const response = await api.post(`/staff/api/${staffId}/archive/`);
    console.log('✅ Staff archived:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error archiving staff ${staffId}:`, error);
    throw error;
  }
};

/**
 * Restore an archived staff member (set is_active=True)
 * @param {number} staffId - Staff ID
 * @returns {Promise<Object>} - Restore result
 */
export const restoreStaff = async (staffId) => {
  try {
    console.log(`📦 Restoring staff ${staffId}...`);
    const response = await api.post(`/staff/api/${staffId}/restore/`);
    console.log('✅ Staff restored:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error restoring staff ${staffId}:`, error);
    throw error;
  }
};

/**
 * Save staff profile after user creation
 * @param {number} userId - User ID
 * @param {Object} staffData - Staff profile data
 * @returns {Promise<Object>} - Created staff
 */
export const saveStaffProfile = async (userId, staffData) => {
  try {
    console.log(`🎓 Creating staff profile for user ${userId}...`);
    
    const formData = new FormData();
    formData.append('user_id', userId);
    
    // Add all staff data
    const { files, ...staffDataWithoutFiles } = staffData;
    
    Object.entries(staffDataWithoutFiles).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'basic_salary' || key === 'years_of_experience' || key === 'salary_step' || key === 'annual_leave_days' || key === 'sick_leave_days') {
          formData.append(key, parseFloat(value) || 0);
        } else {
          formData.append(key, value);
        }
      }
    });
    
    // Add files
    if (files && typeof files === 'object') {
      Object.entries(files).forEach(([key, file]) => {
        if (file && file instanceof File) {
          formData.append(key, file);
        }
      });
    }
    
    const response = await api.post('/staff/api/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating staff profile:', error);
    throw error;
  }
};

/**
 * Create teacher profile for teaching staff
 * @param {Object} teacherData - Teacher profile data
 * @returns {Promise<Object>} - Created teacher profile
 */
export const createTeacherProfile = async (teacherData) => {
  try {
    const response = await api.post('/staff/teachers/create/', teacherData);
    return response.data;
  } catch (error) {
    console.error('Error creating teacher profile:', error);
    throw error;
  }
};

// src/services/staffService.js - ADD/UPDATE THESE FUNCTIONS

/**
 * Fetch ALL staff (no pagination limit) for export
 * @returns {Promise<Array>} - All staff in the system
 */
export const getAllStaffForExport = async () => {
  try {
    console.log('📊 Fetching ALL staff for export...');
    
    let allStaff = [];
    let currentPage = 1;
    let totalPages = 1;
    
    // First, get the first page to know total pages
    const firstResponse = await getAllStaff({ page: 1, limit: 100 });
    totalPages = firstResponse.total_pages || 1;
    allStaff = [...(firstResponse.results || [])];
    
    console.log(`📊 Total pages: ${totalPages}, Total staff: ${firstResponse.count || 0}`);
    
    // Fetch remaining pages in parallel for better performance
    if (totalPages > 1) {
      const remainingPages = [];
      for (let page = 2; page <= totalPages; page++) {
        remainingPages.push(getAllStaff({ page: page, limit: 100 }));
      }
      
      const remainingResponses = await Promise.all(remainingPages);
      
      remainingResponses.forEach(response => {
        const staff = response.results || [];
        allStaff = [...allStaff, ...staff];
      });
    }
    
    console.log(`✅ Fetched ${allStaff.length} total staff for export`);
    return allStaff;
    
  } catch (error) {
    console.error('❌ Error fetching all staff:', error);
    throw error;
  }
};

/**
 * Download all staff as CSV with password hashes
 * @returns {Promise<Blob>} - CSV file blob
 */
export const downloadAllStaffCSV = async () => {
  try {
    console.log('📥 Downloading all staff as CSV...');
    
    const response = await api.get('/staff/bulk-download/', {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'staff.csv';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch) filename = filenameMatch[1];
    }
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    console.log('✅ Download successful');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Download error:', error);
    throw new Error('Failed to download staff data');
  }
};

/**
 * Bulk upload staff from CSV file (with password support)
 * @param {File} file - CSV file containing staff data
 * @returns {Promise<Object>} - Upload results
 */
export const bulkUploadStaff = async (file) => {
  try {
    console.log('📤 Starting bulk upload...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/staff/bulk-upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
    });
    
    console.log('✅ Bulk upload successful:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Bulk upload error:', error);
    
    let errorMessage = 'Failed to upload staff';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Download CSV template for staff bulk upload
 */
export const downloadStaffUploadTemplate = () => {
  const headers = [
    'first_name', 'last_name', 'email', 'phone_number', 'password',
    'gender', 'date_of_birth', 'address', 'city', 'state_of_origin',
    'lga', 'nationality', 'role', 'department', 'position_title',
    'employment_type', 'employment_date', 'highest_qualification',
    'qualification_institution', 'year_of_graduation', 'specialization',
    'trcn_number', 'blood_group', 'genotype', 'emergency_contact_name',
    'emergency_contact_phone', 'emergency_contact_relationship',
    'next_of_kin_name', 'next_of_kin_relationship', 'next_of_kin_phone',
    'bank_name', 'account_name', 'account_number', 'basic_salary',
    'salary_scale', 'salary_step', 'annual_leave_days', 'sick_leave_days',
    'years_of_experience', 'is_active'
  ];
  
  const exampleRow = [
    'John', 'Doe', 'john.doe@example.com', '08012345678', 'Staff@2024',
    'male', '1990-01-01', '123 Main St', 'Lagos', 'lagos',
    'Ikeja', 'Nigerian', 'teacher', 'academic', 'Mathematics Teacher',
    'full_time', '2024-01-01', 'B.Sc Education', 'University of Lagos',
    '2015', 'Mathematics', 'TRCN12345', 'O+', 'AA', 'Jane Doe',
    '08087654321', 'Spouse', 'Mike Doe', 'Brother', '08011223344',
    'First Bank', 'John Doe', '1234567890', '150000',
    'CONMESS 6', '1', '21', '10', '5', 'true'
  ];
  
  const csvContent = [headers, exampleRow].map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `staff_upload_template.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Validate CSV file before upload
 * @param {File} file - CSV file to validate
 * @returns {Object} - Validation result
 */
export const validateBulkUploadFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }
  
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (fileExtension !== 'csv') {
    errors.push('Invalid file type. Please upload a CSV file.');
  }
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push(`File too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
  }
  
  if (file.size === 0) {
    errors.push('File is empty. Please upload a valid CSV file.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};


export default {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  searchStaff,
  updateStaffPassword,
  activateStaff,
  deactivateStaff,
  getStaffStatistics,
  getStaffByDepartment,
  exportStaffData,
  assignStaffToClasses,
  removeStaffFromClass,
  getStaffAssignments,
  updateStaffAssignments,
  getStaffByClass,
  archiveStaff,
  restoreStaff,
  bulkUploadStaff,
  downloadStaffUploadTemplate,
  getAllStaffForExport,
};