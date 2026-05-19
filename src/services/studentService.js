// services/studentService.js
import api from './api';
import userService from './userService';
import { getAccessToken as getToken, getUserData } from '../utils/storage'; // ADD THIS LINE


// /**
//  * Create a user account for student (Step 1)
//  * @param {Object} userData - User registration data
//  * @returns {Promise<Object>} - Created user with student role
//  */
// export const createStudentUser = async (userData) => {
//   try {
//     console.log('👤 Creating student user account...');
    
//     // Prepare user data with student role - FIXED: use confirm_password, not password2
//     const studentUserData = {
//       first_name: userData.first_name,
//       last_name: userData.last_name,
//       role: 'student',
//       password: userData.password,
//       confirm_password: userData.confirm_password || userData.password2, // FIX: use confirm_password
//     };
    
//     // Only add optional fields if they have values (not empty strings)
//     if (userData.email && userData.email.trim() !== '') {
//       studentUserData.email = userData.email.trim();
//     }
//     if (userData.phone_number && userData.phone_number.trim() !== '') {
//       studentUserData.phone_number = userData.phone_number.trim();
//     }
//     if (userData.gender) {
//       studentUserData.gender = userData.gender;
//     }
//     if (userData.date_of_birth) {
//       studentUserData.date_of_birth = userData.date_of_birth;
//     }
//     if (userData.address && userData.address.trim() !== '') {
//       studentUserData.address = userData.address.trim();
//     }
//     if (userData.city && userData.city.trim() !== '') {
//       studentUserData.city = userData.city.trim();
//     }
//     if (userData.state_of_origin) {
//       studentUserData.state_of_origin = userData.state_of_origin;
//     }
//     if (userData.lga && userData.lga.trim() !== '') {
//       studentUserData.lga = userData.lga.trim();
//     }
//     if (userData.nationality) {
//       studentUserData.nationality = userData.nationality;
//     }
    
//     console.log('📦 User data to send:', studentUserData);
    
//     const response = await api.post('/auth/register/', studentUserData);
    
//     console.log('✅ User creation response:', response.data);
    
//     return response.data;
    
//   } catch (error) {
//     console.error('❌ Error creating student user:', error);
//     console.error('Error response data:', error.response?.data);
    
//     let errorMessage = 'Failed to create user account';
    
//     if (error.response?.data) {
//       const errorData = error.response.data;
      
//       if (errorData.errors) {
//         const errorList = [];
//         Object.entries(errorData.errors).forEach(([field, errors]) => {
//           if (Array.isArray(errors)) {
//             errors.forEach(err => {
//               errorList.push(`${field}: ${err}`);
//             });
//           } else if (typeof errors === 'string') {
//             errorList.push(`${field}: ${errors}`);
//           }
//         });
//         errorMessage = errorList.join('; ');
//       } else if (errorData.detail) {
//         errorMessage = errorData.detail;
//       } else if (errorData.error) {
//         errorMessage = errorData.error;
//       } else if (typeof errorData === 'string') {
//         errorMessage = errorData;
//       }
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
    
//     throw new Error(errorMessage);
//   }
// };

/**
 * STEP 1: Create user account for student
 * @param {Object} userData - Basic user data (first_name, last_name, password, etc.)
 * @returns {Promise<Object>} - Created user with student role
 */
export const createStudentUser = async (userData) => {
  try {
    console.log('👤 STEP 1: Creating student user account...');
    
    // Prepare user data with student role
    const studentUserData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      role: 'student',
      password: userData.password,
      confirm_password: userData.confirm_password || userData.password,
    };
    
    // Add optional fields if present
    if (userData.email && userData.email.trim()) {
      studentUserData.email = userData.email.trim();
    }
    if (userData.phone_number && userData.phone_number.trim()) {
      studentUserData.phone_number = userData.phone_number.trim();
    }
    if (userData.gender) {
      studentUserData.gender = userData.gender;
    }
    if (userData.date_of_birth) {
      studentUserData.date_of_birth = userData.date_of_birth;
    }
    if (userData.address && userData.address.trim()) {
      studentUserData.address = userData.address.trim();
    }
    if (userData.city && userData.city.trim()) {
      studentUserData.city = userData.city.trim();
    }
    if (userData.state_of_origin) {
      studentUserData.state_of_origin = userData.state_of_origin;
    }
    if (userData.lga && userData.lga.trim()) {
      studentUserData.lga = userData.lga.trim();
    }
    if (userData.nationality) {
      studentUserData.nationality = userData.nationality;
    }
    
    console.log('📦 Sending user data to /auth/register/:', studentUserData);
    
    // Register the user
    const response = await api.post('/auth/register/', studentUserData);
    
    console.log('✅ Student user created:', response.data);
    
    return response.data; // Should contain user and tokens
  } catch (error) {
    console.error('❌ Error creating student user:', error);
    let errorMessage = 'Failed to create user account';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.errors) {
        const errors = [];
        Object.entries(errorData.errors).forEach(([field, msgs]) => {
          if (Array.isArray(msgs)) {
            errors.push(`${field}: ${msgs.join(', ')}`);
          } else {
            errors.push(`${field}: ${msgs}`);
          }
        });
        errorMessage = errors.join('; ');
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
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

// /**
//  * Create student with user in one operation (Alternative)
//  * @param {Object} data - Complete student data with user info
//  * @returns {Promise<Object>} - Created student with user
//  */
// /**
//  * Create student with user (Step 1 + 2 combined)
//  */
// export const createStudentWithUser = async (userData, studentData, files = {}) => {
//   try {
//     console.log('🚀 Creating complete student...');
    
//     const formData = new FormData();
    
//     // Add user data
//     Object.entries(userData).forEach(([key, value]) => {
//       if (value !== null && value !== undefined && value !== '') {
//         formData.append(key, typeof value === 'string' ? value.trim() : value);
//       }
//     });
    
//     // Add student data
//     Object.entries(studentData).forEach(([key, value]) => {
//       if (value !== null && value !== undefined && value !== '') {
//         if (key === 'class_level') {
//           formData.append(key, parseInt(value) || value);
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
//     Object.entries(files).forEach(([key, file]) => {
//       if (file instanceof File) {
//         formData.append(key, file);
//       }
//     });
    
//     const response = await api.post('/students/', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     console.log('✅ Student created successfully:', response.data);
//     return response.data;
    
//   } catch (error) {
//     console.error('❌ Student creation error:', error);
    
//     let errorMessage = 'Failed to create student';
    
//     if (error.response?.data) {
//       const errorData = error.response.data;
      
//       if (errorData.errors) {
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
//       } else if (errorData.message) {
//         errorMessage = errorData.message;
//       }
//     }
    
//     throw new Error(errorMessage.trim());
//   }
// };

/**
 * COMPLETE: Create student with full profile (One-step alternative)
 * This creates both user and student profile in ONE API call
 */
export const createStudentWithUser = async (formDataObj) => {
  try {
    console.log('🚀 Creating complete student (one-step)...');
    
    // If formDataObj is already FormData, use it directly
    let formData;
    
    if (formDataObj instanceof FormData) {
      formData = formDataObj;
    } else {
      formData = new FormData();
      
      // Add all fields from the object
      for (const [key, value] of Object.entries(formDataObj)) {
        if (value !== undefined && value !== null && value !== '') {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value);
          }
        }
      }
    }
    
    // Log what we're sending
    console.log('📦 Sending to backend:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name}`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    
    // Check if we're using the correct endpoint
    // Your backend expects /students/create-with-user/ or /students/api/
    const response = await api.post('/students/create-with-user/', formData, {
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
        const errorList = [];
        Object.entries(errorData.errors).forEach(([field, msgs]) => {
          if (Array.isArray(msgs)) {
            errorList.push(`${field}: ${msgs.join(', ')}`);
          } else {
            errorList.push(`${field}: ${msgs}`);
          }
        });
        errorMessage = errorList.join('; ');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
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

// src/services/studentService.js - ADD THIS FUNCTION

/**
 * Fetch ALL students (no pagination limit) for export
 * @returns {Promise<Array>} - All students in the system
 */
export const getAllStudentsForExport = async () => {
  try {
    console.log('📊 Fetching ALL students for export...');
    
    let allStudents = [];
    let nextPage = null;
    let page = 1;
    
    // Keep fetching until we have all pages
    do {
      const params = {
        page: page,
        limit: 100,  // Fetch 100 at a time
        ...(nextPage ? { page: page } : {})
      };
      
      const response = await getStudents(params);
      const students = response.results || [];
      allStudents = [...allStudents, ...students];
      
      // Check if there are more pages
      const totalPages = response.total_pages || Math.ceil((response.count || 0) / 100);
      
      console.log(`📥 Fetched page ${page} of ${totalPages}, total so far: ${allStudents.length}`);
      
      page++;
      
      // Stop if we've fetched all pages
      if (page > totalPages) {
        break;
      }
      
    } while (true);
    
    console.log(`✅ Fetched ${allStudents.length} total students for export`);
    return allStudents;
    
  } catch (error) {
    console.error('❌ Error fetching all students:', error);
    throw error;
  }
};

/**
 * Get student by ID with full details
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} - Complete student data
 */
export const getStudentById = async (studentId) => {
  try {
    console.log(`👤 Fetching student details for ID: ${studentId}`);
    
    // Use the correct endpoint - /students/api/{id}/
    const response = await api.get(`/students/api/${studentId}/`);
    
    console.log('✅ Student details fetched:', response.data);
    
    // Return the student data (it might be nested under 'student' or directly)
    const studentData = response.data.student || response.data;
    
    return studentData;
  } catch (error) {
    console.error(`❌ Error fetching student ${studentId}:`, error);
    throw error;
  }
};


export const updateStudent = async (studentId, data) => {
  try {
    console.log(`🔄 UPDATING STUDENT ${studentId}...`);
    
    // If data is FormData, use it directly
    let formData;
    if (data instanceof FormData) {
      formData = data;
    } else {
      formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (value !== null && value !== undefined && value !== '') {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value);
          }
        }
      }
    }
    
    // Log what we're sending
    console.log('📦 Sending update data:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name}`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    
    const response = await api.put(`/students/api/${studentId}/full-update/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Update successful:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ UPDATE ERROR for student ${studentId}:`, error);
    throw error;
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

// /**
//  * Update existing student profile
//  * @param {number} studentId - Student ID
//  * @param {Object} studentData - Updated student data
//  * @returns {Promise<Object>} - Updated student
//  */
// export const updateStudentProfile = async (studentId, studentData) => {
//   try {
//     const formData = new FormData();
    
//     // Add all student data
//     Object.entries(studentData).forEach(([key, value]) => {
//       if (value !== null && value !== undefined && value !== '') {
//         if (key === 'class_level') {
//           formData.append(key, parseInt(value) || value);
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
//     if (studentData.files) {
//       Object.entries(studentData.files).forEach(([key, file]) => {
//         if (file && file instanceof File) {
//           formData.append(key, file);
//         }
//       });
//     }
    
//     const response = await api.put(`/students/${studentId}/update/`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error('Error updating student:', error);
//     throw error;
//   }
// };

/**
 * STEP 2: Update student profile with additional information
 * @param {number} studentId - The student's ID (from the user's student profile)
 * @param {Object} studentData - Additional student data
 * @returns {Promise<Object>} - Updated student profile
 */
export const updateStudentProfile = async (studentId, studentData) => {
  try {
    console.log(`📝 STEP 2: Updating student profile for ID: ${studentId}`);
    
    const formData = new FormData();
    
    // Add all student fields
    const fieldsToSend = [
      'class_level', 'stream', 'house', 'student_category', 'admission_date',
      'previous_school', 'previous_class', 'transfer_certificate_no',
      'blood_group', 'genotype', 'has_allergies', 'allergy_details',
      'has_received_vaccinations', 'family_doctor_name', 'family_doctor_phone',
      'medical_conditions', 'has_learning_difficulties', 'learning_difficulties_details',
      'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
      'transportation_mode', 'bus_route', 'is_prefect', 'prefect_role'
    ];
    
    for (const field of fieldsToSend) {
      if (studentData[field] !== undefined && studentData[field] !== null && studentData[field] !== '') {
        if (typeof studentData[field] === 'boolean') {
          formData.append(field, studentData[field].toString());
        } else {
          formData.append(field, studentData[field]);
        }
      }
    }
    
    // Add files if present
    const fileFields = [
      'student_image', 'birth_certificate', 'immunization_record',
      'previous_school_report', 'parent_id_copy', 'fee_payment_evidence'
    ];
    
    for (const field of fileFields) {
      if (studentData[field] instanceof File) {
        formData.append(field, studentData[field]);
        console.log(`📁 Adding file: ${field} - ${studentData[field].name}`);
      }
    }
    
    console.log('📤 Sending update to API...');
    
    const response = await api.put(`/students/api/${studentId}/full-update/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Student profile updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating student profile:', error);
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

// src/services/studentService.js - KEEP ONLY THIS VERSION

/**
 * Archive a student (instead of delete)
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} - Archive result
 */
export const deleteStudent = async (studentId) => {
  try {
    console.log(`📦 Archiving student ${studentId}...`);
    // Use the archive endpoint instead of delete
    const response = await api.post(`/students/api/${studentId}/archive/`);
    console.log('✅ Student archived:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error archiving student ${studentId}:`, error);
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

// src/services/studentService.js - ADD THIS FUNCTION if not already present

/**
 * Fetch ALL students (no pagination limit) for printing/export
 * @returns {Promise<Array>} - All students in the system
 */
export const getAllStudentsForPrint = async () => {
  try {
    console.log('📊 Fetching ALL students for printing...');
    
    let allStudents = [];
    let currentPage = 1;
    let totalPages = 1;
    
    // First, get the first page to know total pages
    const firstResponse = await getStudents({ page: 1, limit: 100 });
    totalPages = firstResponse.total_pages || 1;
    allStudents = [...(firstResponse.results || [])];
    
    console.log(`📊 Total pages: ${totalPages}, Total students: ${firstResponse.count || 0}`);
    
    // Fetch remaining pages in parallel for better performance
    if (totalPages > 1) {
      const remainingPages = [];
      for (let page = 2; page <= totalPages; page++) {
        remainingPages.push(getStudents({ page: page, limit: 100 }));
      }
      
      const remainingResponses = await Promise.all(remainingPages);
      
      remainingResponses.forEach(response => {
        const students = response.results || [];
        allStudents = [...allStudents, ...students];
      });
    }
    
    console.log(`✅ Fetched ${allStudents.length} total students for printing`);
    return allStudents;
    
  } catch (error) {
    console.error('❌ Error fetching all students:', error);
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

export const getStudentDashboard = async () => {
  try {
    const response = await api.get('/students/dashboard/');
    console.log('Student dashboard raw response:', response.data);
    
    // Ensure student data has class_level properly formatted
    if (response.data && response.data.student) {
      const student = response.data.student;
      console.log('Student class_level:', student.class_level);
      console.log('Student total_fee_amount:', student.total_fee_amount);
      console.log('Student amount_paid:', student.amount_paid);
      console.log('Student balance_due:', student.balance_due);
      
      // If class_level is an ID, fetch the actual class level name
      if (student.class_level && typeof student.class_level === 'number') {
        try {
          // Import dynamically to avoid circular dependency
          const { getClassLevelById } = await import('./academicService');
          const classLevelRes = await getClassLevelById(student.class_level);
          student.class_level = classLevelRes.data || classLevelRes;
        } catch (err) {
          console.warn('Could not fetch class level details:', err);
        }
      }
      
      // Ensure fee fields are numbers
      student.total_fee_amount = parseFloat(student.total_fee_amount) || 0;
      student.amount_paid = parseFloat(student.amount_paid) || 0;
      student.balance_due = parseFloat(student.balance_due) || (student.total_fee_amount - student.amount_paid);
      
      // Add fee summary
      student.fee_summary = {
        total_fee: student.total_fee_amount,
        paid: student.amount_paid,
        balance: student.balance_due,
        status: student.fee_status
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    throw error;
  }
};

// src/services/studentService.js - ADD THIS FUNCTION

// src/services/studentService.js - UPDATE bulk upload functions

/**
 * Bulk upload students from CSV file
 * @param {File} file - CSV file containing student data
 * @returns {Promise<Object>} - Upload results
 */
export const bulkUploadStudents = async (file) => {
  try {
    console.log('📤 Starting bulk upload...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    // FIXED: Use correct endpoint that matches Django URL
    const response = await api.post('/students/bulk-upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
    });
    
    console.log('✅ Bulk upload successful:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Bulk upload error:', error);
    
    let errorMessage = 'Failed to upload students';
    
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
 * Download all students as CSV
 * @returns {Promise<Blob>} - CSV file blob
 */
export const downloadAllStudentsCSV = async () => {
  try {
    console.log('📥 Downloading all students as CSV...');
    
    const response = await api.get('/students/bulk-download/', {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'students.csv';
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
    throw new Error('Failed to download students data');
  }
};

/**
 * Download CSV template for bulk upload
 */
export const downloadBulkUploadTemplate = () => {
  const headers = [
    'registration_number', 'first_name', 'last_name', 'email', 'phone_number',
    'password', 'gender', 'date_of_birth', 'address', 'city', 'state_of_origin',
    'lga', 'nationality', 'class_level_id', 'stream', 'house', 'student_category',
    'admission_date', 'blood_group', 'genotype', 'emergency_contact_name',
    'emergency_contact_phone', 'emergency_contact_relationship', 'transportation_mode',
    'has_allergies', 'allergy_details', 'medical_conditions'
  ];
  
  // Add example row
  const exampleRow = [
    '', 'John', 'Doe', 'john.doe@example.com', '08012345678',
    'admin123', 'male', '2010-01-01', '123 Main St', 'Lagos', 'lagos',
    'Ikeja', 'Nigerian', '1', 'science', 'red', 'day',
    '2024-01-01', 'O+', 'AA', 'Jane Doe', '08087654321',
    'Mother', 'parent_drop', 'No', '', ''
  ];
  
  const csvContent = [headers, exampleRow].map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `student_upload_template.csv`);
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
  
  // Check if file exists
  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }
  
  // Check file type
  const validTypes = ['text/csv', 'application/vnd.ms-excel', '.csv'];
  const fileExtension = file.name.split('.').pop().toLowerCase();
  
  if (!validTypes.includes(file.type) && fileExtension !== 'csv') {
    errors.push('Invalid file type. Please upload a CSV file.');
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push(`File too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
  }
  
  // Check if file is empty
  if (file.size === 0) {
    errors.push('File is empty. Please upload a valid CSV file.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// src/services/studentService.js - UPDATE archive function

// src/services/studentService.js - ADD these functions

export const archiveStudent = async (studentId) => {
  try {
    const formData = new FormData();
    formData.append('is_active', 'false');
    const response = await api.put(`/students/api/${studentId}/full-update/`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const restoreStudent = async (studentId) => {
  try {
    const formData = new FormData();
    formData.append('is_active', 'true');
    const response = await api.put(`/students/api/${studentId}/full-update/`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// =====================
// USER REGISTRATION (STEP 1)
// =====================
// Alias for backward compatibility
export const createStudent = createStudentWithUser;

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

  getStudentDashboard,

  getAllStudentsForExport,
  getAllStudentsForPrint,
  validateBulkUploadFile,
  bulkUploadStudents,
  downloadBulkUploadTemplate,
  downloadAllStudentsCSV,
  restoreStudent,
  archiveStudent 
};

export default studentService;