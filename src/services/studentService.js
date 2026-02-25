// services/studentService.js
import api from './api';
import userService from './userService';
import { getAccessToken as getToken, getUserData } from '../utils/storage'; // ADD THIS LINE


// ... rest of your studentService.js code remains exactly the same ...

/**
 * Student Service - Comprehensive student creation and management
 * Handles user registration + student profile creation in separate steps
 */

// =====================
// USER REGISTRATION (STEP 1)
// =====================
// Alias for backward compatibility
export const createStudent = createStudentWithUser;

/**
 * Create a user account for student (Step 1)
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Created user with student role
 */
export const createStudentUser = async (userData) => {
  
  try {
    console.log('👤 Creating student user account...');
    
    // Prepare user data with student role
    const studentUserData = {
      ...userData,
      role: 'student', // Force role to student
      // These fields can be empty/optional
      email: userData.email?.trim() || null,
      phone_number: userData.phone_number?.trim() || null
    };
    
    console.log('📦 User data:', studentUserData);
    
    const response = await userService.createUser(studentUserData);
    
    // FIX: Check different response structures
    const user = response?.data?.user || response?.user || response?.data || response;
    
    if (!user) {
      throw new Error('User creation succeeded but no user data returned');
    }
    
    console.log('✅ Student user created:', user);
    return user; // Return just the user object
    
  } catch (error) {
    console.error('❌ Error creating student user:', error);
    
    // Format error message
    let errorMessage = 'Failed to create user account';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.errors) {
        errorMessage = 'Validation errors:\n';
        Object.entries(errorData.errors).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            errors.forEach(err => {
              errorMessage += `• ${field}: ${err}\n`;
            });
          } else if (typeof errors === 'string') {
            errorMessage += `• ${field}: ${errors}\n`;
          }
        });
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage.trim());
  }
};

/**
 * Create student profile for existing user (Step 2)
 * @param {number} userId - User ID to create student profile for
 * @param {Object} studentData - Student profile data
 * @returns {Promise<Object>} - Created student profile
 */
export const createStudentProfile = async (userId, studentData) => {
  try {
    console.log('🎓 Creating/Updating student profile...');
    
    // First check if student already exists
    const existingStudent = await checkExistingStudent(userId);
    
    if (existingStudent) {
      console.log('ℹ️ Student profile already exists, updating...');
      return await updateStudentProfile(existingStudent.id, studentData);
    }
    
    // If no existing student, create new one
    console.log('➕ Creating new student profile...');
    
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    
    // Extract files from studentData
    const { files, ...studentDataWithoutFiles } = studentData;
    
    // Add all student data
    Object.entries(studentDataWithoutFiles).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'class_level') {
          formData.append(key, parseInt(value) || value);
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (typeof value === 'number') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, typeof value === 'string' ? value.trim() : value);
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
    
    // Log FormData for debugging
    console.log('🔍 FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    const response = await api.post('/students/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Student profile created/updated successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Student profile creation/update error:', error);
    
    let errorMessage = 'Failed to create/update student profile';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      console.error('📋 Backend error details:', errorData);
      
      if (errorData.user_id && errorData.user_id.includes("already a student")) {
        errorMessage = 'This user already has a student profile. Please use a different user account.';
      } else if (errorData.errors) {
        errorMessage = 'Validation errors:\n';
        Object.entries(errorData.errors).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            errors.forEach(err => {
              errorMessage += `• ${field}: ${err}\n`;
            });
          } else if (typeof errors === 'string') {
            errorMessage += `• ${field}: ${errors}\n`;
          }
        });
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    }
    
    throw new Error(errorMessage.trim());
  }
};

/**
 * Create student with user in one operation (Alternative)
 * @param {Object} data - Complete student data with user info
 * @returns {Promise<Object>} - Created student with user
 */
/**
 * Create student with user (Step 1 + 2 combined)
 */
export const createStudentWithUser = async (userData, studentData, files = {}) => {
  try {
    console.log('🚀 Creating complete student...');
    
    const formData = new FormData();
    
    // Add user data
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, typeof value === 'string' ? value.trim() : value);
      }
    });
    
    // Add student data
    Object.entries(studentData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'class_level') {
          formData.append(key, parseInt(value) || value);
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (typeof value === 'number') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, typeof value === 'string' ? value.trim() : value);
        }
      }
    });
    
    // Add files
    Object.entries(files).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(key, file);
      }
    });
    
    const response = await api.post('/students/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Student created successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Student creation error:', error);
    
    let errorMessage = 'Failed to create student';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.errors) {
        errorMessage = 'Validation errors:\n';
        Object.entries(errorData.errors).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            errors.forEach(err => {
              errorMessage += `• ${field}: ${err}\n`;
            });
          } else if (typeof errors === 'string') {
            errorMessage += `• ${field}: ${errors}\n`;
          }
        });
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    }
    
    throw new Error(errorMessage.trim());
  }
};

// =====================
// ACADEMIC DATA
// =====================

/**
 * Get class levels from backend
 * @returns {Promise<Array>} - Class levels
 */
export const getClassLevels = async () => {
  try {
    const response = await api.get('/academic/class-levels/');
    const data = response.data.results || response.data || [];
    console.log('📚 Class levels loaded:', data.length);
    return data;
  } catch (error) {
    console.error('⚠️ Could not fetch class levels, using fallback:', error);
    return getFallbackClassLevels();
  }
};

/**
 * Get fallback class levels
 */
const getFallbackClassLevels = () => {
  return [
    { id: 1, name: 'Creche', code: 'CR', level: 'creche' },
    { id: 2, name: 'Nursery 1', code: 'NUR1', level: 'nursery_1' },
    { id: 3, name: 'Nursery 2', code: 'NUR2', level: 'nursery_2' },
    { id: 4, name: 'Kindergarten 1', code: 'KG1', level: 'kg_1' },
    { id: 5, name: 'Kindergarten 2', code: 'KG2', level: 'kg_2' },
    { id: 6, name: 'Primary 1', code: 'PRI1', level: 'primary_1' },
    { id: 7, name: 'Primary 2', code: 'PRI2', level: 'primary_2' },
    { id: 8, name: 'Primary 3', code: 'PRI3', level: 'primary_3' },
    { id: 9, name: 'Primary 4', code: 'PRI4', level: 'primary_4' },
    { id: 10, name: 'Primary 5', code: 'PRI5', level: 'primary_5' },
    { id: 11, name: 'Primary 6', code: 'PRI6', level: 'primary_6' },
    { id: 12, name: 'JSS 1', code: 'JSS1', level: 'jss_1' },
    { id: 13, name: 'JSS 2', code: 'JSS2', level: 'jss_2' },
    { id: 14, name: 'JSS 3', code: 'JSS3', level: 'jss_3' },
    { id: 15, name: 'SSS 1', code: 'SSS1', level: 'sss_1' },
    { id: 16, name: 'SSS 2', code: 'SSS2', level: 'sss_2' },
    { id: 17, name: 'SSS 3', code: 'SSS3', level: 'sss_3' }
  ];
};

// =====================
// GET STUDENT DATA
// =====================

/**
 * Get all students
 */
export const getAllStudents = async () => {
  try {
    const response = await api.get('/students/');
    return response.data.results || response.data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

/**
 * Get student by ID
 */
export const getStudentById = async (studentId) => {
  try {
    console.log(`👤 Fetching student ${studentId}...`);
    
    // CHANGE FROM: const response = await api.get(`/students/${studentId}/`);
    // TO THIS:
    const response = await api.get(`/students/api/${studentId}/`);
    
    console.log('✅ Student fetched:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(`❌ Error fetching student ${studentId}:`, error);
    throw error;
  }
};

/**
 * Update student profile with full data (including files)
 */
// In studentService.js - update the updateStudent function
// export const updateStudent = async (studentId, data) => {
//   try {
//     console.log(`🔄 UPDATING STUDENT ${studentId}...`);
    
//     const formData = new FormData();
    
//     // Add all fields - FIXED: Proper field mapping
//     Object.entries(data).forEach(([key, value]) => {
//       if (value !== null && value !== undefined) {
//         if (value instanceof File) {
//           formData.append(key, value);
//           console.log(`  ${key}: [File] ${value.name}`);
//         } else if (typeof value === 'boolean') {
//           formData.append(key, value.toString());
//           console.log(`  ${key}: ${value} (boolean)`);
//         } else if (value === '') {
//           // Send empty string for clearing fields
//           formData.append(key, '');
//           console.log(`  ${key}: "" (empty string)`);
//         } else if (key === 'class_level') {
//           formData.append(key, value.toString());
//           console.log(`  ${key}: ${value} (class level)`);
//         } else {
//           formData.append(key, typeof value === 'string' ? value.trim() : value);
//           console.log(`  ${key}: "${value}" (${typeof value})`);
//         }
//       }
//     });
    
//     // Debug log
//     console.log(`📤 Sending PUT request to /students/api/${studentId}/full-update/`);
    
//     // Use the correct endpoint
//     const response = await api.put(`/students/api/${studentId}/full-update/`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     console.log('✅ Student updated:', response.data);
//     return response.data;
    
//   } catch (error) {
//     console.error(`❌ Update error for student ${studentId}:`, error);
//     console.error('❌ Error response:', error.response?.data);
    
//     let errorMessage = 'Failed to update student';
    
//     if (error.response?.data) {
//       const errorData = error.response.data;
//       console.error('📋 Error details:', errorData);
      
//       if (errorData.message) {
//         errorMessage = errorData.message;
//       } else if (errorData.detail) {
//         errorMessage = errorData.detail;
//       } else if (errorData.errors) {
//         // Handle validation errors
//         const errors = [];
//         Object.entries(errorData.errors).forEach(([field, messages]) => {
//           if (Array.isArray(messages)) {
//             errors.push(`${field}: ${messages.join(', ')}`);
//           } else {
//             errors.push(`${field}: ${messages}`);
//           }
//         });
//         errorMessage = errors.join('\n');
//       }
//     }
    
//     throw new Error(errorMessage);
//   }
// };

/**
 * Update student profile with full data (including files) - FIXED VERSION
 */
export const updateStudent = async (studentId, data) => {
  try {
    console.log(`🔄 UPDATING STUDENT ${studentId}...`);
    
    const formData = new FormData();
    
    // =====================
    // ADD ALL FIELDS - CRITICAL
    // =====================
    const allFields = [
      // User fields
      'first_name', 'last_name', 'email', 'phone_number',
      'gender', 'date_of_birth', 'address', 'city',
      'state_of_origin', 'lga', 'nationality',
      
      // Student fields
      'class_level', 'stream', 'admission_date', 'student_category',
      'house', 'place_of_birth', 'home_language', 'previous_class',
      'previous_school', 'transfer_certificate_no', 'is_prefect',
      'prefect_role', 'emergency_contact_name', 'emergency_contact_phone',
      'emergency_contact_relationship', 'fee_status', 'total_fee_amount',
      'amount_paid', 'blood_group', 'genotype', 'has_allergies',
      'allergy_details', 'has_received_vaccinations', 'family_doctor_name',
      'family_doctor_phone', 'medical_conditions', 'has_learning_difficulties',
      'learning_difficulties_details', 'transportation_mode', 'bus_route',
      'is_active', 'is_graduated', 'graduation_date'
    ];
    
    // Fields that have NOT NULL constraint and need default value
    const notNullFields = {
      'address': '',
      'city': '',
      'lga': '',
      'home_language': '',
      'previous_class': '',
      'previous_school': '',
      'transfer_certificate_no': '',
      'prefect_role': '',
      'emergency_contact_name': '',
      'emergency_contact_phone': '',
      'emergency_contact_relationship': '',
      'allergy_details': '',
      'family_doctor_name': '',
      'family_doctor_phone': '',
      'medical_conditions': '',
      'learning_difficulties_details': '',
      'bus_route': '',
      'blood_group': '',
      'genotype': '',
      'place_of_birth': ''
    };
    
    // =====================
    // PROCESS REGULAR FIELDS
    // =====================
    console.log('📝 Processing regular fields...');
    allFields.forEach(field => {
      if (field in data) {
        let value = data[field];
        
        // Skip file fields here
        if (value instanceof File) {
          return;
        }
        
        // Handle null/undefined values
        if (value === null || value === undefined) {
          // For NOT NULL fields, use empty string as default
          if (field in notNullFields) {
            value = notNullFields[field];
            console.log(`  ✓ ${field}: "${value}" (default for NOT NULL field)`);
          } else {
            // For nullable fields, send empty string
            value = '';
            console.log(`  ✓ ${field}: "" (empty - nullable field)`);
          }
        } else if (value === '') {
          // Already empty string - keep it for NOT NULL fields
          if (field in notNullFields) {
            console.log(`  ✓ ${field}: "" (empty - NOT NULL field, will be stored as empty)`);
          } else {
            console.log(`  ✓ ${field}: "" (empty - nullable field)`);
          }
        } else {
          // Has value
          console.log(`  ✓ ${field}: "${value}" (type: ${typeof data[field]})`);
        }
        
        // Handle boolean fields
        if (typeof value === 'boolean') {
          value = value.toString();
        }
        
        // Handle numeric fields
        if (field === 'total_fee_amount' || field === 'amount_paid') {
          value = value ? parseFloat(value).toString() : '0';
        }
        
        // Handle class_level
        if (field === 'class_level' && value && typeof value === 'object' && value.id) {
          value = value.id.toString();
        } else if (field === 'class_level' && value) {
          value = value.toString();
        }
        
        formData.append(field, value);
      }
    });
    
    // =====================
    // PROCESS FILE FIELDS
    // =====================
    const fileFields = [
      'student_image', 'birth_certificate', 'immunization_record',
      'previous_school_report', 'parent_id_copy', 'fee_payment_evidence'
    ];
    
    console.log('📁 Processing file fields...');
    fileFields.forEach(field => {
      if (field in data) {
        const file = data[field];
        
        if (file instanceof File) {
          formData.append(field, file);
          console.log(`  ✓ ${field}: [File] ${file.name} (${file.size} bytes)`);
        } else if (file === null || file === 'null') {
          // Don't send null files
          console.log(`  ✓ ${field}: [Skipped - null/empty]`);
        }
      }
    });
    
    // =====================
    // LOG FINAL FORMDATA
    // =====================
    console.log('📋 FINAL FORMDATA:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name}`);
      } else {
        console.log(`  ${key}: "${value}"`);
      }
    }
    
    // =====================
    // SEND REQUEST
    // =====================
    console.log(`🚀 Sending PUT request to /students/api/${studentId}/full-update/`);
    
    const response = await api.put(`/students/api/${studentId}/full-update/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ UPDATE SUCCESSFUL');
    console.log('📊 Response:', response.data);
    
    return response.data;
    
  } catch (error) {
    console.error(`❌ UPDATE ERROR for student ${studentId}:`, error);
    console.error('❌ Error details:', error.response?.data || error.message);
    
    let errorMessage = 'Failed to update student';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      console.error('🔍 Backend error details:', errorData);
      
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.errors) {
        const errors = [];
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            errors.push(`${field}: ${messages.join(', ')}`);
          } else {
            errors.push(`${field}: ${messages}`);
          }
        });
        errorMessage = errors.join('\n');
      }
    }
    
    throw new Error(errorMessage);
  }
};


// =====================
// PASSWORD MANAGEMENT - WITH DETAILED ERROR HANDLING
// =====================

/**
 * Update student password - WITH DETAILED BACKEND ERROR HANDLING
 * @param {number} studentId - Student ID
 * @param {Object} passwordData - Password data { new_password, confirm_password }
 * @returns {Promise<Object>} - Update result
 */
export const updateStudentPassword = async (studentId, passwordData) => {
  try {
    console.log(`🔐 ADMIN resetting password for student ${studentId}...`);
    console.log('📦 Password data:', passwordData);
    
    // SIMPLE VALIDATION - only check if passwords match
    if (!passwordData.new_password || !passwordData.confirm_password) {
      throw new Error('Both password fields are required');
    }
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      throw new Error('Passwords do not match');
    }
    
    console.log('✓ Password validation passed (simple check)');
    console.log(`📤 Sending POST request to /students/api/${studentId}/update-password/`);
    
    const response = await api.post(
      `/students/api/${studentId}/update-password/`,
      {
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password
      }
    );
    
    console.log('✅ PASSWORD UPDATE SUCCESSFUL');
    console.log('📊 Response:', response.data);
    
    return response.data;
    
  } catch (error) {
    console.error(`❌ Password update error for student ${studentId}:`, error);
    
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
 * Check if user already has student profile
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} - Existing student or null
 */
export const checkExistingStudent = async (userId) => {
  try {
    const response = await api.get(`/students/?user=${userId}`);
    const students = response.data.results || response.data || [];
    return students.length > 0 ? students[0] : null;
  } catch (error) {
    console.log(`No existing student found for user ${userId}`);
    return null;
  }
};

/**
 * Update existing student profile
 * @param {number} studentId - Student ID
 * @param {Object} studentData - Updated student data
 * @returns {Promise<Object>} - Updated student
 */
export const updateStudentProfile = async (studentId, studentData) => {
  try {
    const formData = new FormData();
    
    // Add all student data
    Object.entries(studentData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'class_level') {
          formData.append(key, parseInt(value) || value);
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (typeof value === 'number') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, typeof value === 'string' ? value.trim() : value);
        }
      }
    });
    
    // Add files
    if (studentData.files) {
      Object.entries(studentData.files).forEach(([key, file]) => {
        if (file && file instanceof File) {
          formData.append(key, file);
        }
      });
    }
    
    const response = await api.put(`/students/${studentId}/update/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

/**
 * Delete student by ID
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteStudentFile = async (studentId, fileType) => {
  try {
    console.log(`🗑️ Deleting ${fileType} for student ${studentId}...`);
    
    // CHANGE FROM: const response = await api.delete(`/students/${studentId}/delete-file/${fileType}/`);
    // TO THIS:
    const response = await api.delete(`/students/api/${studentId}/delete-file/${fileType}/`);
    
    console.log('✅ File deleted:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(`❌ Error deleting file for student ${studentId}:`, error);
    throw error;
  }
};

/**
 * Get students with pagination and filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Paginated students
 */
export const getStudents = async (params = {}) => {
  try {
    console.log('📋 Fetching students with params:', params);
    
    // CHANGE THIS LINE:
    // const response = await api.get('/students/', { params });
    
    // TO THIS (add /api/ to the endpoint):
    const response = await api.get('/students/api/', { params });
    
    console.log('✅ Students fetched:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Error fetching students:', error);
    
    // Return fallback structure for frontend
    return {
      success: false,
      count: 0,
      total_pages: 1,
      current_page: 1,
      results: []
    };
  }
};

/**
 * Search students
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Additional filters
 * @returns {Promise<Object>} - Search results
 */
export const searchStudents = async (searchTerm, filters = {}) => {
  try {
    const params = {
      search: searchTerm,
      ...filters
    };
    
    // CHANGE FROM: const response = await api.get('/students/', { params });
    // TO THIS:
    const response = await api.get('/students/api/', { params });
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Search error:', error);
    return { results: [], count: 0 };
  }
};

// =====================
// PASSWORD MANAGEMENT
// =====================

/**
 * Update student password
 * @param {number} studentId - Student ID
 * @param {Object} passwordData - Password data
 * @returns {Promise<Object>} - Update result
 */

/**
 * Update student fee payment
 * @param {number} studentId - Student ID
 * @param {Object} feeData - Fee payment data
 * @returns {Promise<Object>} - Update result
 */
export const updateStudentFee = async (studentId, feeData) => {
  try {
    console.log(`💰 Updating fee for student ${studentId}...`);
    
    const response = await api.post(`/students/${studentId}/update-fee/`, feeData);
    
    console.log('✅ Fee updated successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(`❌ Error updating fee for student ${studentId}:`, error);
    
    let errorMessage = 'Failed to update fee';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    }
    
    throw new Error(errorMessage.trim());
  }
};

/**
 * Promote student to next class
 * @param {number} studentId - Student ID
 * @param {Object} promotionData - Promotion data
 * @returns {Promise<Object>} - Promotion result
 */
export const promoteStudent = async (studentId, promotionData) => {
  try {
    console.log(`📈 Promoting student ${studentId}...`);
    
    const response = await api.post(`/students/${studentId}/promote/`, promotionData);
    
    console.log('✅ Student promoted successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(`❌ Error promoting student ${studentId}:`, error);
    
    let errorMessage = 'Failed to promote student';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    }
    
    throw new Error(errorMessage.trim());
  }
};

/**
 * Update student attendance
 * @param {number} studentId - Student ID
 * @param {Object} attendanceData - Attendance data
 * @returns {Promise<Object>} - Attendance update result
 */
export const updateStudentAttendance = async (studentId, attendanceData) => {
  try {
    console.log(`📅 Updating attendance for student ${studentId}...`);
    
    const response = await api.post(`/students/${studentId}/attendance/`, attendanceData);
    
    console.log('✅ Attendance updated successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(`❌ Error updating attendance for student ${studentId}:`, error);
    
    let errorMessage = 'Failed to update attendance';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    }
    
    throw new Error(errorMessage.trim());
  }
};

/**
 * Upload student document
 * @param {number} studentId - Student ID
 * @param {Object} documentData - Document data
 * @returns {Promise<Object>} - Upload result
 */
export const uploadStudentDocument = async (studentId, documentData) => {
  try {
    console.log(`📄 Uploading document for student ${studentId}...`);
    
    const formData = new FormData();
    formData.append('document_type', documentData.document_type);
    formData.append('document', documentData.document);
    
    const response = await api.post(`/students/${studentId}/upload-document/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Document uploaded successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(`❌ Error uploading document for student ${studentId}:`, error);
    
    let errorMessage = 'Failed to upload document';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    }
    
    throw new Error(errorMessage.trim());
  }
};

export const deleteStudent = async (studentId) => {
  try {
    console.log(`🗑️ Deleting student ${studentId}...`);
    
    // FIXED: Add /delete/ suffix to match your URL configuration
    const response = await api.delete(`/students/api/${studentId}/delete/`);
    
    console.log('✅ Student deleted:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(`❌ Error deleting student ${studentId}:`, error);
    throw error;
  }
};

// Add this to your studentService.js (around line 500-520)

/**
 * Get student profile for current logged-in user
 * @returns {Promise<Object>} - Student profile for current user
 */
export const getCurrentStudentProfile = async () => {
  try {
    console.log('👤 Fetching current student profile...');
    
    // Get current user's registration number from auth
    const userData = getUserData();
    if (!userData || !userData.registration_number) {
      throw new Error('No authenticated user found');
    }
    
    console.log('🔍 Searching for student with registration:', userData.registration_number);
    
    // Find student by user's registration number
    const response = await api.get('/students/api/', {
      params: {
        user__registration_number: userData.registration_number,
        limit: 1
      }
    });
    
    console.log('✅ Current student profile response:', response.data);
    
    // Extract student from response
    if (response.data && response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    } else if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    } else if (response.data && response.data.student) {
      return response.data.student;
    }
    
    throw new Error('No student profile found for current user');
    
  } catch (error) {
    console.error('❌ Error fetching current student profile:', error);
    throw error;
  }
};

// Add this to your studentService.js (around line 500)

/**
 * Get student profile by user registration number
 * @param {string} registrationNumber - User registration number
 * @returns {Promise<Object>} - Student profile
 */
export const getStudentByRegistrationNumber = async (registrationNumber) => {
  try {
    console.log(`👤 Fetching student with registration: ${registrationNumber}`);
    
    const response = await api.get('/students/api/', {
      params: {
        user__registration_number: registrationNumber,
        limit: 1
      }
    });
    
    console.log('✅ Student fetch response:', response.data);
    
    // Extract student from response
    if (response.data && response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    } else if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    } else if (response.data && response.data.student) {
      return response.data.student;
    }
    
    throw new Error('No student profile found for this user');
    
  } catch (error) {
    console.error(`❌ Error fetching student by registration ${registrationNumber}:`, error);
    throw error;
  }
};

/**
 * Create student enrollment
 * @param {number} studentId - Student ID
 * @param {Object} enrollmentData - Enrollment data
 * @returns {Promise<Object>} - Enrollment result
 */
export const createStudentEnrollment = async (studentId, enrollmentData) => {
  try {
    console.log(`📝 Creating enrollment for student ${studentId}...`);
    
    const response = await api.post(`/students/api/${studentId}/enroll/`, enrollmentData);
    
    console.log('✅ Enrollment created:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(`❌ Error creating enrollment for student ${studentId}:`, error);
    
    let errorMessage = 'Failed to create enrollment';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) errorMessage = errorData.detail;
      else if (errorData.error) errorMessage = errorData.error;
      else if (errorData.message) errorMessage = errorData.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Get student enrollments
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} - Enrollments list
 */
export const getStudentEnrollments = async (studentId) => {
  try {
    console.log(`📋 Fetching enrollments for student ${studentId}...`);
    
    const response = await api.get(`/students/api/${studentId}/enrollments/`);
    
    console.log('✅ Enrollments fetched:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(`❌ Error fetching enrollments for student ${studentId}:`, error);
    return { results: [], count: 0 };
  }
};


// studentService.js

export const getStudentDashboard = async () => {
  try {
    const response = await api.get('/students/dashboard/');
    return response.data;  // { student, results, statistics }
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    throw error;
  }
};


// =====================
// EXPORT SERVICE
// =====================

const studentService = {
  // Step 1: User Creation
  createStudent,
  createStudentUser,
  
  // Step 2: Student Profile Creation
  createStudentProfile,
  
  // Combined (Alternative)
  createStudentWithUser,
  
  // Academic Data
  getClassLevels,
  
  // Student Management
  getAllStudents,
  getStudentById,
  updateStudent,
  updateStudentProfile,
  checkExistingStudent,
  searchStudents,
  getStudents,
  deleteStudent,
  createStudentEnrollment,   
  getStudentEnrollments,
  
  // Password Management
  updateStudentPassword,
  
  // Fee Management
  updateStudentFee,
  
  // Academic Operations
  promoteStudent,
  
  // Attendance
  updateStudentAttendance,
  
  // Document Management
  uploadStudentDocument,
  
  // Helper functions
  getFallbackClassLevels,

  getCurrentStudentProfile,

  getStudentByRegistrationNumber,

  getStudentDashboard
};

export default studentService;