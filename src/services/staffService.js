
// /**
//  * Staff Service
//  * Handles all staff-related API calls
//  * Updated to match Django URL patterns exactly
//  */

// import api from './api';
// import { get, post, put, del } from './api';
// import { handleApiError } from './api';

// /**
//  * Get all staff with optional filtering
//  * @param {Object} filters - Filter options
//  * @returns {Promise<Array>} - List of staff
//  */
// export const getAllStaff = async (filters = {}) => {
//   try {
//     // Build query string from filters
//     const queryParams = new URLSearchParams();
    
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value !== undefined && value !== '') {
//         queryParams.append(key, value);
//       }
//     });
    
//     const queryString = queryParams.toString();
//     const url = queryString ? `/staff/api/?${queryString}` : '/staff/api/';
    
//     const response = await get(url);
//     return response;
//   } catch (error) {
//     console.error('Error fetching staff:', error);
//     throw handleApiError(error);
//   }
// };


// /**
//  * Get single staff member by ID
//  * @param {number|string} id - Staff ID or staff_id
//  * @returns {Promise<Object>} - Staff details
//  */
// export const getStaffById = async (id) => {
//   try {
//     const response = await get(`/staff/${id}/`);
//     return response;
//   } catch (error) {
//     console.error(`Error fetching staff ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// export const searchStaff = async (searchTerm, filters = {}) => {
//   try {
//     const params = {
//       search: searchTerm,
//       ...filters
//     };
    
//     const queryParams = new URLSearchParams();
    
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined && value !== '') {
//         queryParams.append(key, value);
//       }
//     });
    
//     const queryString = queryParams.toString();
//     const url = queryString ? `/staff/api/?${queryString}` : '/staff/api/';
    
//     const response = await get(url);
//     return response;
    
//   } catch (error) {
//     console.error('❌ Search error:', error);
//     return { results: [], count: 0 };
//   }
// };


// /**
//  * Create new staff member
//  * @param {Object} staffData - Staff data including user_id
//  * @returns {Promise<Object>} - Created staff
//  */
// // export const createStaff = async (staffData) => {
// //   try {
// //     // Check if we need to send files separately
// //     const hasFiles = staffData.files && Object.keys(staffData.files).some(key => staffData.files[key]);
    
// //     if (hasFiles) {
// //       // Create FormData for file upload
// //       const formData = new FormData();
      
// //       // Add all staff data fields
// //       Object.entries(staffData).forEach(([key, value]) => {
// //         if (key === 'files') {
// //           // Add files individually
// //           Object.entries(value).forEach(([fileKey, file]) => {
// //             if (file) {
// //               formData.append(fileKey, file);
// //             }
// //           });
// //         } else if (value !== null && value !== undefined) {
// //           // Convert other values to string
// //           formData.append(key, String(value));
// //         }
// //       });
      
// //       const response = await post('/staff/create/', formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //       });
// //       return response;
// //     } else {
// //       // No files, send as JSON
// //       const response = await post('/staff/create/', staffData);
// //       return response;
// //     }
// //   } catch (error) {
// //     console.error('Error creating staff:', error);
// //     throw handleApiError(error);
// //   }
// // };

// // staffService.js - Update the createStaff function

// export const createStaff = async (staffData) => {
//   try {
//     console.log('👔 Creating staff profile...');
    
//     // Extract user_id and files from staffData
//     const { user_id, files, ...staffDataWithoutFiles } = staffData;
    
//     if (!user_id) {
//       throw new Error('User ID is required to create staff profile');
//     }
    
//     // Create FormData
//     const formData = new FormData();
    
//     // CRITICAL: Add user_id as FormData field
//     formData.append('user_id', user_id.toString());
    
//     // Add all staff data
//     Object.entries(staffDataWithoutFiles).forEach(([key, value]) => {
//       if (value !== null && value !== undefined && value !== '') {
//         // Handle special cases
//         if (key === 'year_of_graduation' && value) {
//           formData.append(key, parseInt(value) || '');
//         } else if (typeof value === 'boolean') {
//           formData.append(key, value.toString());
//         } else if (typeof value === 'number') {
//           formData.append(key, value.toString());
//         } else {
//           formData.append(key, typeof value === 'string' ? value.trim() : value);
//         }
//       }
//     });
    
//     // Add files if they exist
//     if (files && typeof files === 'object') {
//       Object.entries(files).forEach(([key, file]) => {
//         if (file && file instanceof File) {
//           formData.append(key, file);
//         }
//       });
//     }
    
//     // Log FormData for debugging
//     console.log('🔍 Staff FormData contents:');
//     for (let [key, value] of formData.entries()) {
//       console.log(`  ${key}:`, value);
//     }
    
//     // FIXED: Use the imported 'post' function
//     const response = await post('/staff/create/', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     console.log('✅ Staff profile created successfully:', response);
//     return response;
    
//   } catch (error) {
//     console.error('❌ Staff profile creation error:', error);
    
//     let errorMessage = 'Failed to create staff profile';
    
//     if (error.response?.data) {
//       const errorData = error.response.data;
//       console.error('📋 Backend error details:', errorData);
      
//       if (errorData.user_id && errorData.user_id.includes("already a staff member")) {
//         errorMessage = 'This user already has a staff profile. Please use a different user account.';
//       } else if (errorData.errors) {
//         errorMessage = 'Validation errors:\n';
//         Object.entries(errorData.errors).forEach(([field, errors]) => {
//           if (Array.isArray(errors)) {
//             errors.forEach(err => {
//               errorMessage += `• ${field}: ${err}\n`;
//             });
//           } else if (typeof errors === 'string') {
//             errorMessage += `• ${field}: ${errors}\n`;
//           }
//         });
//       } else if (errorData.detail) {
//         errorMessage = errorData.detail;
//       } else if (errorData.error) {
//         errorMessage = errorData.error;
//       }
//     }
    
//     throw new Error(errorMessage.trim());
//   }
// };


// export const updateStaff = async (id, data) => {
//   try {
//     console.log(`🔄 UPDATING STAFF ${id}...`);
    
//     const formData = new FormData();
    
//     // Add all fields
//     Object.entries(data).forEach(([key, value]) => {
//       if (value !== null && value !== undefined) {
//         if (value instanceof File) {
//           formData.append(key, value);
//         } else if (typeof value === 'boolean') {
//           formData.append(key, value.toString());
//         } else if (value === '') {
//           formData.append(key, '');
//         } else if (value instanceof Date) {
//           formData.append(key, value.toISOString().split('T')[0]);
//         } else {
//           formData.append(key, typeof value === 'string' ? value.trim() : value);
//         }
//       }
//     });
    
//     console.log('📤 FormData prepared, sending to backend...');
    
//     // Try primary endpoint
//     try {
//       const response = await put(`/staff/api/${id}/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       console.log('✅ Updated via /staff/api/${id}/');
//       return response;
//     } catch (firstError) {
//       console.log('⚠️ Primary endpoint failed, trying /staff/${id}/update/');
      
//       // Try alternative endpoint
//       const response = await put(`/staff/${id}/update/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       console.log('✅ Updated via /staff/${id}/update/');
//       return response;
//     }
    
//   } catch (error) {
//     console.error(`❌ All update endpoints failed for staff ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Delete staff member
//  * @param {number} id - Staff ID
//  * @returns {Promise<Object>} - Success message
//  */

// /**
//  * Activate staff member
//  * @param {number} id - Staff ID
//  * @param {Object} activationData - Activation data (optional)
//  * @returns {Promise<Object>} - Updated staff
//  */
// export const activateStaff = async (id, activationData = {}) => {
//   try {
//     const response = await post(`/staff/${id}/activate/`, activationData);
//     return response;
//   } catch (error) {
//     console.error(`Error activating staff ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Deactivate staff member
//  * @param {number} id - Staff ID
//  * @param {Object} deactivationData - Deactivation data (optional)
//  * @returns {Promise<Object>} - Updated staff
//  */
// export const deactivateStaff = async (id, deactivationData = {}) => {
//   try {
//     const response = await post(`/staff/${id}/deactivate/`, deactivationData);
//     return response;
//   } catch (error) {
//     console.error(`Error deactivating staff ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Update staff salary
//  * @param {number} id - Staff ID
//  * @param {Object} salaryData - Salary data
//  * @returns {Promise<Object>} - Updated staff
//  */
// export const updateStaffSalary = async (id, salaryData) => {
//   try {
//     const response = await post(`/staff/${id}/update-salary/`, salaryData);
//     return response;
//   } catch (error) {
//     console.error(`Error updating salary for staff ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// export const updateStaffPassword = async (id, passwordData) => {
//   try {
//     console.log(`🔐 Updating password for staff ${id}...`);
    
//     const response = await post(`/staff/api/${id}/update-password/`, passwordData);
    
//     console.log('✅ Password updated:', response);
//     return response;
    
//   } catch (error) {
//     console.error(`❌ Password update error for staff ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// export const deleteStaff = async (id) => {
//   try {
//     console.log(`🗑️ Deleting staff ${id}...`);
    
//     const response = await del(`/staff/api/${id}/delete/`);
    
//     console.log('✅ Staff deleted:', response);
//     return response;
    
//   } catch (error) {
//     console.error(`❌ Error deleting staff ${id}:`, error);
//     throw handleApiError(error);
//   }
// };



// /**
//  * Get staff salary
//  * @param {number} id - Staff ID
//  * @returns {Promise<Object>} - Salary information
//  */
// export const getStaffSalary = async (id) => {
//   try {
//     const response = await get(`/staff/${id}/salary/`);
//     return response;
//   } catch (error) {
//     console.error(`Error fetching salary for staff ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Get staff permissions
//  * @param {number} id - Staff ID
//  * @returns {Promise<Object>} - Permissions
//  */
// export const getStaffPermissions = async (id) => {
//   try {
//     const response = await get(`/staff/${id}/permissions/`);
//     return response;
//   } catch (error) {
//     console.error(`Error fetching permissions for staff ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Update staff permissions
//  * @param {number} id - Staff ID
//  * @param {Object} permissionsData - Permissions data
//  * @returns {Promise<Object>} - Updated permissions
//  */
// export const updateStaffPermissions = async (id, permissionsData) => {
//   try {
//     const response = await put(`/staff/${id}/permissions/update/`, permissionsData);
//     return response;
//   } catch (error) {
//     console.error(`Error updating permissions for staff ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Get all teachers
//  * @param {Object} filters - Filter options
//  * @returns {Promise<Array>} - List of teachers
//  */
// export const getAllTeachers = async (filters = {}) => {
//   try {
//     // Build query string from filters
//     const queryParams = new URLSearchParams();
    
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value !== undefined && value !== '') {
//         queryParams.append(key, value);
//       }
//     });
    
//     const queryString = queryParams.toString();
//     const url = queryString ? `/staff/teachers/?${queryString}` : '/staff/teachers/';
    
//     const response = await get(url);
//     return response;
//   } catch (error) {
//     console.error('Error fetching teachers:', error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Search staff
//  * @param {Object} searchParams - Search parameters
//  * @returns {Promise<Array>} - Search results
//  */

// /**
//  * Get staff statistics
//  * @returns {Promise<Object>} - Statistics data
//  */
// export const getStaffStatistics = async () => {
//   try {
//     const response = await get('/staff/statistics/');
//     return response;
//   } catch (error) {
//     console.error('Error fetching staff statistics:', error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Create teacher profile
//  * @param {Object} teacherData - Teacher profile data
//  * @returns {Promise<Object>} - Created teacher profile
//  */
// export const createTeacherProfile = async (teacherData) => {
//   try {
//     const response = await post('/staff/teachers/create/', teacherData);
//     return response;
//   } catch (error) {
//     console.error('Error creating teacher profile:', error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Update teacher profile
//  * @param {number} id - Teacher profile ID
//  * @param {Object} teacherData - Updated teacher data
//  * @returns {Promise<Object>} - Updated teacher profile
//  */
// export const updateTeacherProfile = async (id, teacherData) => {
//   try {
//     const response = await put(`/staff/teachers/${id}/`, teacherData);
//     return response;
//   } catch (error) {
//     console.error(`Error updating teacher profile ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Get teacher profile by ID
//  * @param {number} id - Teacher profile ID
//  * @returns {Promise<Object>} - Teacher profile details
//  */
// export const getTeacherProfileById = async (id) => {
//   try {
//     const response = await get(`/staff/teachers/${id}/`);
//     return response;
//   } catch (error) {
//     console.error(`Error fetching teacher profile ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Bulk create staff
//  * @param {Array} staffList - Array of staff data
//  * @returns {Promise<Object>} - Created staff
//  */
// export const bulkCreateStaff = async (staffList) => {
//   try {
//     const response = await post('/staff/bulk-create/', { staff_list: staffList });
//     return response;
//   } catch (error) {
//     console.error('Error bulk creating staff:', error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Get staff dashboard data
//  * @param {number} id - Staff ID
//  * @returns {Promise<Object>} - Dashboard data
//  */
// export const getStaffDashboard = async (id) => {
//   try {
//     const response = await get(`/staff/${id}/dashboard/`);
//     return response;
//   } catch (error) {
//     console.error(`Error fetching staff dashboard ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Retire staff member
//  * @param {number} id - Staff ID
//  * @param {Object} retirementData - Retirement data
//  * @returns {Promise<Object>} - Updated staff
//  */
// export const retireStaff = async (id, retirementData) => {
//   try {
//     const response = await post(`/staff/${id}/retire/`, retirementData);
//     return response;
//   } catch (error) {
//     console.error(`Error retiring staff ${id}:`, error);
//     throw handleApiError(error);
//   }
// };

// /**
//  * Check if user already has a staff profile
//  * @param {number} userId - User ID
//  * @returns {Promise<boolean>} - True if staff profile exists

// /**
//  * Get staff by user ID
//  * @param {number} userId - User ID
//  * @returns {Promise<Object>} - Staff profile
//  */

// // In staffService.js, add this function:
// export const checkStaffExists = async (userId) => {
//   try {
//     const response = await get(`/staff/check/${userId}/`);
//     return response;
//   } catch (error) {
//     console.error('Error checking staff existence:', error);
//     throw handleApiError(error);
//   }
// };
 
// /**
//  * Check if user already has staff profile
//  * @param {number} userId - User ID
//  * @returns {Promise<Object|null>} - Existing staff or null
//  */

// export const checkExistingStaff = async (userId) => {
//   try {
//     const res = await api.get(`/staff/search/?user_id=${userId}`);

//     const data = Array.isArray(res.data)
//       ? res.data
//       : res.data.results || [];

//     return data.length ? data[0] : null;
//   } catch {
//     return null;
//   }
// };

// /**
//  * Create or update staff profile
//  */
// // export const createOrUpdateStaffProfile = async (userId, staffData) => {
// //   try {
// //     console.log('Creating/Updating staff profile...');
    
// //     // First check if staff already exists
// //     const existingStaff = await checkExistingStaff(userId);
    
// //     if (existingStaff) {
// //       console.log('ℹ️ Staff profile already exists, updating...');
// //       return await updateStaffProfile(existingStaff.id, staffData);
// //     }
    
// //     // If no existing staff, create new one
// //     console.log('➕ Creating new staff profile...');
// //     return await createStaff({ user_id: userId, ...staffData });
    
// //   } catch (error) {
// //     console.error('Staff profile creation/update error:', error);
// //     throw error;
// //   }
// // };

// // Add to staffService.js

// export const createOrUpdateStaffProfile = async (userId, staffData) => {
//   try {
//     console.log('👔 Creating or updating staff profile...');

//     // Attempt CREATE first (fast path)
//     try {
//       return await createStaff({
//         user_id: userId,
//         ...staffData,
//       });
//     } catch (error) {
//       const message =
//         error?.response?.data?.user_id?.[0] ||
//         error?.response?.data?.detail ||
//         '';

//       // Backend explicitly says staff already exists → UPDATE
//       if (
//         message.toLowerCase().includes('already a staff member')
//       ) {
//         console.log('♻️ Staff exists — switching to update flow');

//         const existingStaff = await checkExistingStaff(userId);
//         if (!existingStaff) {
//           throw new Error('Staff exists but could not be fetched');
//         }

//         return await updateStaffProfile(existingStaff.id, staffData);
//       }

//       throw error; // real error → bubble up
//     }
//   } catch (err) {
//     console.error('❌ Staff create/update failed:', err);
//     throw err;
//   }
// };

// export const saveStaffProfile = async (userId, staffData) => {
//   try {
//     console.log('♻️ Saving staff profile (update-only mode)');

//     const existingStaff = await checkExistingStaff(userId);

//     if (!existingStaff) {
//       throw new Error(
//         'Staff profile not found. Backend should auto-create staff.'
//       );
//     }

//     return await updateStaffProfile(existingStaff.id, staffData);
//   } catch (error) {
//     console.error('❌ Staff save failed:', error);
//     throw error;
//   }
// };


// /**
//  * Update existing staff profile
//  * @param {number} staffId - Staff ID
//  * @param {Object} staffData - Updated staff data
//  * @returns {Promise<Object>} - Updated staff
//  */
// export const updateStaffProfile = async (staffId, staffData) => {
//   try {
//     const formData = new FormData();
    
//     // Add all staff data
//     Object.entries(staffData).forEach(([key, value]) => {
//       if (value !== null && value !== undefined && value !== '') {
//         if (key === 'year_of_graduation') {
//           formData.append(key, parseInt(value) || '');
//         } else if (typeof value === 'boolean') {
//           formData.append(key, value.toString());
//         } else if (typeof value === 'number') {
//           formData.append(key, value.toString());
//         } else {
//           formData.append(key, typeof value === 'string' ? value.trim() : value);
//         }
//       }
//     });
    
//     // Add files
//     if (staffData.files) {
//       Object.entries(staffData.files).forEach(([key, file]) => {
//         if (file && file instanceof File) {
//           formData.append(key, file);
//         }
//       });
//     }
    
//     const response = await api.put(`/staff/${staffId}/update/`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error('Error updating staff:', error);
//     throw error;
//   }
// };

// /**
//  * Get staff by user ID
//  * @param {number} userId - User ID
//  * @returns {Promise<Object|null>} - Staff data or null
//  */
// export const getStaffByUserId = async (userId) => {
//   try {
//     const response = await api.get(`/staff/search/?user_id=${userId}`);
//     const staffs = response.data.results || response.data || [];
//     return staffs.length > 0 ? staffs[0] : null;
//   } catch (error) {
//     console.error(`Error fetching staff for user ${userId}:`, error);
//     return null;
//   }
// };

// export const saveStaffProfileWithFormData = async (userId, formData) => {
//   try {
//     console.log('📤 Uploading staff profile with FormData...');
    
//     // Add user_id to FormData if not already present
//     if (!formData.has('user_id')) {
//       formData.append('user_id', userId);
//     }
    
//     const response = await api.post('/staff/create-with-files/', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     console.log('✅ Staff profile with files created:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Error creating staff profile with files:', error);
//     throw error;
//   }
// };

// // Export all functions
// const staffService = {
//   getAllStaff,
//   getStaffById,
//   createStaff,
//   updateStaff,
//   deleteStaff,
//   activateStaff,
//   deactivateStaff,
//   updateStaffSalary,
//   getStaffSalary,
//   getStaffPermissions,
//   updateStaffPermissions,
//   getAllTeachers,
//   searchStaff,
//   getStaffStatistics,
//   createTeacherProfile,
//   updateTeacherProfile,
//   getTeacherProfileById,
//   bulkCreateStaff,
//   getStaffDashboard,
//   retireStaff,
//   checkStaffExists,
//   getStaffByUserId,
//   createOrUpdateStaffProfile,
//   checkExistingStaff,
//   saveStaffProfile,
//   updateStaffPassword,
// };

// export default staffService;


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
    console.log(`📤 Sending POST request to /staff/api/${staffId}/update-password/`);
    
    const response = await api.post(
      `/staff/api/${staffId}/update-password/`,
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
        // Format validation errors
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
      
      // Log the complete error object for debugging
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
  exportStaffData
};