// // services/parentService.js
// import api from './api';

// /**
//  * Parent Service - Updated with proper endpoint paths
//  */

// // =====================
// // PARENT CRUD OPERATIONS
// // =====================
// // Aliases for backward compatibility
// export const getParents = getAllParents; // replace getAllParents with whatever the real name is

// export const getAllParents = async (params = {}) => {
//   try {
//     const response = await api.get('/parents/', { params });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching parents:', error);
//     throw error;
//   }
// };

// export const getParentById = async (id) => {
//   try {
//     const response = await api.get(`/parents/${id}/`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching parent ${id}:`, error);
//     throw error;
//   }
// };


// export const deleteParent = async (id) => {
//   try {
//     console.log(`Deleting parent ${id}...`);
    
//     // IMPORTANT: Use the correct endpoint from your Django URLs
//     // Check if it's DELETE /parents/{id}/delete/ or DELETE /parents/{id}/
//     const response = await api.delete(`/parents/${id}/delete/`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error deleting parent ${id}:`, error);
//     throw error;
//   }
// };

// export const searchParents = async (searchTerm, params = {}) => {
//   try {
//     const response = await api.get('/parents/search/', {
//       params: {
//         search: searchTerm,
//         ...params
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error searching parents:', error);
//     throw error;
//   }
// };

// export const linkChildToParent = async (linkData) => {
//   try {
//     const response = await api.post('/parents/link-child/', linkData);
//     return response.data;
//   } catch (error) {
//     console.error('Error linking child to parent:', error);
//     throw error;
//   }
// };

// export const getParentChildren = async (parentId = null) => {
//   try {
//     if (parentId) {
//       const response = await api.get(`/parents/${parentId}/children/`);
//       return response.data;
//     }
//     const response = await api.get('/parents/children/');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching parent children:', error);
//     throw error;
//   }
// };

// export const getParentDashboard = async (parentId = null) => {
//   try {
//     if (parentId) {
//       const response = await api.get(`/parents/${parentId}/dashboard/`);
//       return response.data;
//     }
//     const response = await api.get('/parents/dashboard/');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching parent dashboard:', error);
//     throw error;
//   }
// };

// export const getParentStatistics = async () => {
//   try {
//     const response = await api.get('/parents/statistics/');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching parent statistics:', error);
//     throw error;
//   }
// };

// export const checkParentExists = async (userId) => {
//   try {
//     const response = await api.get(`/parents/check-exists/?user_id=${userId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error checking if parent exists:', error);
//     throw error;
//   }
// };

// export const acceptDeclaration = async (declarationData, parentId = null) => {
//   try {
//     if (parentId) {
//       const response = await api.post(`/parents/${parentId}/accept-declaration/`, declarationData);
//       return response.data;
//     }
//     const response = await api.post('/parents/accept-declaration/', declarationData);
//     return response.data;
//   } catch (error) {
//     console.error('Error accepting declaration:', error);
//     throw error;
//   }
// };

// export const managePTA = async (parentId, ptaData) => {
//   try {
//     const response = await api.post(`/parents/${parentId}/manage-pta/`, ptaData);
//     return response.data;
//   } catch (error) {
//     console.error('Error managing PTA:', error);
//     throw error;
//   }
// };

// export const createParent = async (parentData) => {
//   try {
//     console.log('Creating parent with data:', parentData);
    
//     // Make sure user_id is included
//     if (!parentData.user_id) {
//       console.error('user_id is required but not provided!');
//       throw new Error('user_id is required to create a parent profile');
//     }
    
//     const response = await api.post('/parents/create/', parentData);
//     return response.data;
    
//   } catch (error) {
//     console.error('Error creating parent:', error);
//     console.error('Error status:', error.response?.status);
//     console.error('Error data:', error.response?.data);
    
//     if (error.response?.data?.errors) {
//       console.error('Validation errors by field:');
//       Object.entries(error.response.data.errors).forEach(([field, messages]) => {
//         console.error(`${field}:`, messages);
//       });
//     }
    
//     throw error;
//   }
// };

// export const createParentUser = async (userData) => {
//   try {
//     console.log('Creating parent user:', userData);
    
//     const response = await api.post('/auth/register/', {
//       ...userData,
//       role: 'parent'
//     });
    
//     console.log('User creation response:', response.data);
//     return response.data;
    
//   } catch (error) {
//     console.error('Error creating parent user:', error);
    
//     let errorMessage = 'Failed to create user account';
//     if (error.response?.data) {
//       const errorData = error.response.data;
//       if (errorData.detail) {
//         errorMessage = errorData.detail;
//       } else if (errorData.error) {
//         errorMessage = errorData.error;
//       }
//     }
    
//     throw new Error(errorMessage);
//   }
// };

// export const createParentWithUser = async (userData, parentData) => {
//   try {
//     console.log('Creating parent with user (combined)...');
    
//     // Step 1: Create user
//     const userResponse = await createParentUser(userData);
//     const userId = userResponse.user?.id || userResponse.id;
    
//     if (!userId) {
//       throw new Error('Failed to get user ID from response');
//     }
    
//     console.log('User created with ID:', userId);
    
//     // Step 2: Create parent profile
//     const parentResponse = await createParent({
//       user_id: userId,
//       ...parentData
//     });
    
//     return {
//       user: userResponse,
//       parent: parentResponse
//     };
    
//   } catch (error) {
//     console.error('Error in createParentWithUser:', error);
//     throw error;
//   }
// };

// export const updateParent = async (id, parentData) => {
//   try {
//     console.log(`Updating parent ${id} with:`, parentData);
    
//     // Check if it's FormData or regular object
//     let config = {};
//     let payload = parentData;
    
//     if (parentData instanceof FormData) {
//       config.headers = {
//         'Content-Type': 'multipart/form-data'
//       };
      
//       // Log FormData contents
//       console.log('FormData contents:');
//       for (let pair of parentData.entries()) {
//         console.log(pair[0] + ': ', pair[1]);
//       }
//     } else {
//       console.log('JSON data:', parentData);
//     }
    
//     const response = await api.put(`/parents/${id}/update/`, payload, config);
//     console.log('Update successful:', response.data);
//     return response.data;
    
//   } catch (error) {
//     console.error(`Error updating parent ${id}:`, error);
//     console.error('Error status:', error.response?.status);
//     console.error('Error data:', error.response?.data);
    
//     if (error.response?.data?.errors) {
//       console.error('Validation errors:');
//       Object.entries(error.response.data.errors).forEach(([field, messages]) => {
//         console.error(`${field}:`, messages);
//       });
//     }
    
//     throw error;
//   }
// };

// // Export as object
// const parentService = {
//   getAllParents,
//   getParentById,
//   createParent,
//   updateParent,
//   deleteParent,
//   searchParents,
//   linkChildToParent,
//   getParentChildren,
//   getParentDashboard,
//   getParentStatistics,
//   checkParentExists,
//   acceptDeclaration,
//   managePTA
// };

// export default parentService;

// services/parentService.js
import api from './api';

/**
 * Parent Service - Updated with proper endpoint paths
 */

// =====================
// HELPER FUNCTIONS (Define these first)
// =====================

/**
 * Create a parent user account
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Created user
 */
export const createParentUser = async (userData) => {
  try {
    console.log('Creating parent user:', userData);
    
    const response = await api.post('/auth/register/', {
      ...userData,
      role: 'parent'
    });
    
    console.log('User creation response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Error creating parent user:', error);
    
    let errorMessage = 'Failed to create user account';
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Create a parent profile
 * @param {Object} parentData - Parent profile data
 * @returns {Promise<Object>} - Created parent
 */
export const createParent = async (parentData) => {
  try {
    console.log('Creating parent with data:', parentData);
    
    if (!parentData.user_id) {
      console.error('user_id is required but not provided!');
      throw new Error('user_id is required to create a parent profile');
    }
    
    const response = await api.post('/parents/create/', parentData);
    return response.data;
    
  } catch (error) {
    console.error('Error creating parent:', error);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    
    if (error.response?.data?.errors) {
      console.error('Validation errors by field:');
      Object.entries(error.response.data.errors).forEach(([field, messages]) => {
        console.error(`${field}:`, messages);
      });
    }
    
    throw error;
  }
};

// =====================
// PARENT CRUD OPERATIONS
// =====================

/**
 * Get all parents with optional pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Paginated parents
 */
export const getAllParents = async (params = {}) => {
  try {
    const response = await api.get('/parents/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching parents:', error);
    throw error;
  }
};

// Alias for backward compatibility - defined AFTER getAllParents
export const getParents = getAllParents;

/**
 * Get parent by ID
 * @param {number} id - Parent ID
 * @returns {Promise<Object>} - Parent data
 */
export const getParentById = async (id) => {
  try {
    const response = await api.get(`/parents/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching parent ${id}:`, error);
    throw error;
  }
};

/**
 * Delete parent by ID
 * @param {number} id - Parent ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteParent = async (id) => {
  try {
    console.log(`Deleting parent ${id}...`);
    
    const response = await api.delete(`/parents/${id}/delete/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting parent ${id}:`, error);
    throw error;
  }
};

/**
 * Search parents
 * @param {string} searchTerm - Search term
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} - Search results
 */
export const searchParents = async (searchTerm, params = {}) => {
  try {
    const response = await api.get('/parents/search/', {
      params: {
        search: searchTerm,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching parents:', error);
    throw error;
  }
};

/**
 * Link child to parent
 * @param {Object} linkData - Link data { parent_id, student_id, relationship }
 * @returns {Promise<Object>} - Link result
 */
export const linkChildToParent = async (linkData) => {
  try {
    const response = await api.post('/parents/link-child/', linkData);
    return response.data;
  } catch (error) {
    console.error('Error linking child to parent:', error);
    throw error;
  }
};

/**
 * Get parent's children
 * @param {number} parentId - Parent ID (optional)
 * @returns {Promise<Object>} - Children list
 */
export const getParentChildren = async (parentId = null) => {
  try {
    if (parentId) {
      const response = await api.get(`/parents/${parentId}/children/`);
      return response.data;
    }
    const response = await api.get('/parents/children/');
    return response.data;
  } catch (error) {
    console.error('Error fetching parent children:', error);
    throw error;
  }
};

/**
 * Get parent dashboard
 * @param {number} parentId - Parent ID (optional)
 * @returns {Promise<Object>} - Dashboard data
 */
export const getParentDashboard = async (parentId = null) => {
  try {
    if (parentId) {
      const response = await api.get(`/parents/${parentId}/dashboard/`);
      return response.data;
    }
    const response = await api.get('/parents/dashboard/');
    return response.data;
  } catch (error) {
    console.error('Error fetching parent dashboard:', error);
    throw error;
  }
};

/**
 * Get parent statistics
 * @returns {Promise<Object>} - Statistics
 */
export const getParentStatistics = async () => {
  try {
    const response = await api.get('/parents/statistics/');
    return response.data;
  } catch (error) {
    console.error('Error fetching parent statistics:', error);
    throw error;
  }
};

/**
 * Check if parent exists for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Check result
 */
export const checkParentExists = async (userId) => {
  try {
    const response = await api.get(`/parents/check-exists/?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking if parent exists:', error);
    throw error;
  }
};

/**
 * Accept parent declaration
 * @param {Object} declarationData - Declaration data
 * @param {number} parentId - Parent ID (optional)
 * @returns {Promise<Object>} - Acceptance result
 */
export const acceptDeclaration = async (declarationData, parentId = null) => {
  try {
    if (parentId) {
      const response = await api.post(`/parents/${parentId}/accept-declaration/`, declarationData);
      return response.data;
    }
    const response = await api.post('/parents/accept-declaration/', declarationData);
    return response.data;
  } catch (error) {
    console.error('Error accepting declaration:', error);
    throw error;
  }
};

/**
 * Manage PTA (Parent-Teacher Association)
 * @param {number} parentId - Parent ID
 * @param {Object} ptaData - PTA data
 * @returns {Promise<Object>} - Management result
 */
export const managePTA = async (parentId, ptaData) => {
  try {
    const response = await api.post(`/parents/${parentId}/manage-pta/`, ptaData);
    return response.data;
  } catch (error) {
    console.error('Error managing PTA:', error);
    throw error;
  }
};

/**
 * Create parent with user (combined operation)
 * @param {Object} userData - User registration data
 * @param {Object} parentData - Parent profile data
 * @returns {Promise<Object>} - Created parent and user
 */
export const createParentWithUser = async (userData, parentData) => {
  try {
    console.log('Creating parent with user (combined)...');
    
    const userResponse = await createParentUser(userData);
    const userId = userResponse.user?.id || userResponse.id;
    
    if (!userId) {
      throw new Error('Failed to get user ID from response');
    }
    
    console.log('User created with ID:', userId);
    
    const parentResponse = await createParent({
      user_id: userId,
      ...parentData
    });
    
    return {
      user: userResponse,
      parent: parentResponse
    };
    
  } catch (error) {
    console.error('Error in createParentWithUser:', error);
    throw error;
  }
};

/**
 * Update parent
 * @param {number} id - Parent ID
 * @param {Object|FormData} parentData - Updated parent data
 * @returns {Promise<Object>} - Updated parent
 */
export const updateParent = async (id, parentData) => {
  try {
    console.log(`Updating parent ${id} with:`, parentData);
    
    let config = {};
    let payload = parentData;
    
    if (parentData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
      
      console.log('FormData contents:');
      for (let pair of parentData.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }
    } else {
      console.log('JSON data:', parentData);
    }
    
    const response = await api.put(`/parents/${id}/update/`, payload, config);
    console.log('Update successful:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(`Error updating parent ${id}:`, error);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    
    if (error.response?.data?.errors) {
      console.error('Validation errors:');
      Object.entries(error.response.data.errors).forEach(([field, messages]) => {
        console.error(`${field}:`, messages);
      });
    }
    
    throw error;
  }
};

// =====================
// EXPORT SERVICE
// =====================

const parentService = {
  getAllParents,
  getParents,
  getParentById,
  createParent,
  createParentUser,
  createParentWithUser,
  updateParent,
  deleteParent,
  searchParents,
  linkChildToParent,
  getParentChildren,
  getParentDashboard,
  getParentStatistics,
  checkParentExists,
  acceptDeclaration,
  managePTA
};

export default parentService;