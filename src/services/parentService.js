// src/services/parentService.js - FIXED COMPLETE VERSION

import api from './api';
import { getAccessToken } from '../utils/storage';  // ADD THIS IMPORT

// =====================
// CREATE PARENT USER
// =====================

export const createParentUser = async (userData) => {
  try {
    console.log('Creating parent user:', userData);
    
    const payload = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone_number,
      password: userData.password,
      confirm_password: userData.password,
      role: 'parent',
      gender: userData.gender || 'male',
    };
    
    if (userData.email && userData.email.trim()) {
      payload.email = userData.email.trim();
    }
    
    if (userData.date_of_birth && userData.date_of_birth.trim()) {
      payload.date_of_birth = userData.date_of_birth;
    }
    
    if (userData.address) payload.address = userData.address;
    if (userData.city) payload.city = userData.city;
    if (userData.state_of_origin) payload.state_of_origin = userData.state_of_origin;
    if (userData.lga) payload.lga = userData.lga;
    if (userData.nationality) payload.nationality = userData.nationality;
    
    console.log('Sending payload:', payload);
    
    const response = await api.post('/auth/register/', payload);
    console.log('User creation response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Error creating parent user:', error);
    
    let errorMessage = 'Failed to create user account';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.email) errorMessage = errorData.email[0];
      else if (errorData.confirm_password) errorMessage = errorData.confirm_password[0];
      else if (errorData.password) errorMessage = errorData.password[0];
      else if (errorData.detail) errorMessage = errorData.detail;
      else if (errorData.error) errorMessage = errorData.error;
    }
    
    throw new Error(errorMessage);
  }
};

export const createParent = async (parentData) => {
  try {
    console.log('Creating parent with data:', parentData);
    
    if (!parentData.user_id) {
      throw new Error('user_id is required to create a parent profile');
    }
    
    const response = await api.post('/parents/create/', parentData);
    return response.data;
    
  } catch (error) {
    console.error('Error creating parent:', error);
    throw error;
  }
};

export const getAllParents = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      page_size: params.limit || params.page_size || 12,
    };
    
    if (queryParams.limit) {
      queryParams.page_size = queryParams.limit;
      delete queryParams.limit;
    }
    
    if (params.search) queryParams.search = params.search;
    if (params.parent_type) queryParams.parent_type = params.parent_type;
    if (params.is_active) queryParams.is_active = params.is_active;
    if (params.is_pta_member) queryParams.is_pta_member = params.is_pta_member;
    
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === undefined || queryParams[key] === '') {
        delete queryParams[key];
      }
    });
    
    console.log('Fetching parents with params:', queryParams);
    
    const response = await api.get('/parents/', { params: queryParams });
    
    let results = response.data.results || response.data || [];
    let count = response.data.count || (Array.isArray(response.data) ? response.data.length : 0);
    
    if (!Array.isArray(results)) {
      results = [];
    }
    
    const pageSize = queryParams.page_size;
    const totalPages = Math.ceil(count / pageSize);
    
    return {
      results: results,
      count: count,
      total_pages: totalPages,
      current_page: queryParams.page,
      next: response.data.next || null,
      previous: response.data.previous || null
    };
  } catch (error) {
    console.error('Error fetching parents:', error);
    
    if (error.response?.status === 404) {
      return {
        results: [],
        count: 0,
        total_pages: 1,
        current_page: 1,
        next: null,
        previous: null
      };
    }
    
    return {
      results: [],
      count: 0,
      total_pages: 1,
      current_page: 1,
      next: null,
      previous: null
    };
  }
};

export const getParents = getAllParents;

export const getParentById = async (id) => {
  try {
    const response = await api.get(`/parents/${id}/`);
    console.log('Parent detail response:', response.data);
    
    const parentData = response.data.parent || response.data;
    
    if (!parentData.full_name && parentData.user) {
      parentData.full_name = `${parentData.user.first_name || ''} ${parentData.user.last_name || ''}`.trim();
    }
    
    return parentData;
  } catch (error) {
    console.error(`Error fetching parent ${id}:`, error);
    throw error;
  }
};

export const updateParent = async (id, parentData) => {
  try {
    console.log(`Updating parent ${id} with:`, parentData);
    
    let config = {};
    let payload = parentData;
    
    if (parentData instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    
    const response = await api.put(`/parents/${id}/update/`, payload, config);
    console.log('Update successful:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(`Error updating parent ${id}:`, error);
    throw error;
  }
};

export const deleteParent = async (id, reason = '') => {
  try {
    console.log(`Archiving parent ${id}...`);
    const response = await api.delete(`/parents/${id}/delete/`, { data: { reason } });
    return response.data;
  } catch (error) {
    console.error(`Error archiving parent ${id}:`, error);
    throw error;
  }
};

// =====================
// ARCHIVE & RESTORE
// =====================

export const archiveParent = async (id, reason = '') => {
  try {
    console.log(`Archiving parent ${id}...`);
    const response = await api.post(`/parents/${id}/archive/`, { reason });
    return response.data;
  } catch (error) {
    console.error(`Error archiving parent ${id}:`, error);
    throw error;
  }
};

export const restoreParent = async (id, reason = '') => {
  try {
    console.log(`Restoring parent ${id}...`);
    const response = await api.post(`/parents/${id}/restore/`, { reason });
    return response.data;
  } catch (error) {
    console.error(`Error restoring parent ${id}:`, error);
    throw error;
  }
};

// =====================
// SEARCH & FILTERS
// =====================

export const searchParents = async (searchTerm, params = {}) => {
  try {
    const response = await api.get('/parents/search/', {
      params: { search: searchTerm, ...params }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching parents:', error);
    throw error;
  }
};

export const searchStudentsForParent = async (query, classLevel = '') => {
  try {
    const params = { q: query };
    if (classLevel) params.class_level = classLevel;
    const response = await api.get('/parents/search-students/', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching students:', error);
    throw error;
  }
};

export const searchParentsForLinking = async (query, includeArchived = false) => {
  try {
    const params = { q: query, include_archived: includeArchived };
    const response = await api.get('/parents/search-parents/', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching parents for linking:', error);
    throw error;
  }
};

// =====================
// CHILDREN MANAGEMENT
// =====================

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

export const linkChildToParent = async (linkData) => {
  try {
    const response = await api.post('/parents/link-child/', linkData);
    return response.data;
  } catch (error) {
    console.error('Error linking child to parent:', error);
    throw error;
  }
};

// =====================
// PARENT DASHBOARD & STATISTICS
// =====================

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

export const getParentStatistics = async () => {
  try {
    const response = await api.get('/parents/statistics/');
    console.log('Statistics API response:', response.data);
    
    return {
      overall: {
        total_parents: response.data?.overall?.total_parents || response.data?.total_parents || 0,
        active_parents: response.data?.overall?.active_parents || response.data?.active_parents || 0,
        pta_members: response.data?.overall?.pta_members || response.data?.pta_members || 0,
      },
      children: {
        total_children: response.data?.children?.total_children || response.data?.total_children || 0,
      }
    };
  } catch (error) {
    console.error('Error fetching parent statistics:', error);
    return {
      overall: {
        total_parents: 0,
        active_parents: 0,
        pta_members: 0,
      },
      children: {
        total_children: 0,
      }
    };
  }
};

export const checkParentExists = async (userId) => {
  try {
    const response = await api.get(`/parents/check-exists/?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking if parent exists:', error);
    throw error;
  }
};

// =====================
// DECLARATION & PTA
// =====================

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

export const managePTA = async (parentId, ptaData) => {
  try {
    const response = await api.post(`/parents/${parentId}/manage-pta/`, ptaData);
    return response.data;
  } catch (error) {
    console.error('Error managing PTA:', error);
    throw error;
  }
};

// =====================
// PARENT PORTAL
// =====================

export const getParentPortalDashboard = async () => {
  try {
    const response = await api.get('/parents/portal/dashboard/');
    const data = response.data;
    if (data.children) {
      data.children = data.children.map(child => ({
        ...child,
        class_level: typeof child.class_level === 'object' && child.class_level !== null
          ? child.class_level
          : { 
              id: child.class_level,
              name: child.class_level_name || child.class_level_info?.name || child.current_class || 'Not assigned' 
            },
        fee_summary: child.fee_summary || {
          total_fee: parseFloat(child.total_fee_amount) || 0,
          paid: parseFloat(child.amount_paid) || 0,
          balance: parseFloat(child.balance_due) || 0,
          status: child.fee_status
        }
      }));
    }
    return data;
  } catch (error) {
    console.error('Error fetching parent portal dashboard:', error);
    throw error;
  }
};

export const getParentPortalChildDetail = async (childId) => {
  try {
    const response = await api.get(`/parents/portal/children/${childId}/`);
    const data = response.data;
    const child = data.child || data;

    if (child.class_level && typeof child.class_level !== 'object') {
      child.class_level = {
        id: child.class_level,
        name: child.class_level_name || child.class_level_info?.name || child.current_class || 'Not assigned'
      };
    }

    child.fee_summary = child.fee_summary || {
      total_fee: parseFloat(child.total_fee_amount) || 0,
      paid: parseFloat(child.amount_paid) || 0,
      balance: parseFloat(child.balance_due) || 0,
      status: child.fee_status
    };

    return data.child ? { ...data, child } : child;
  } catch (error) {
    console.error(`Error fetching child ${childId} details:`, error);
    throw error;
  }
};

// =====================
// CREATE PARENT WITH USER (COMBINED)
// =====================

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

// =====================
// BULK OPERATIONS (EXPORT/IMPORT)
// =====================

/**
 * Get all parents for export (ALL PAGES - NO LIMIT)
 */
export const getAllParentsForExport = async () => {
  try {
    console.log('📊 Fetching ALL parents for export...');
    
    // Use the direct export endpoint for JSON data
    const response = await api.get('/parents/export-all-direct/');
    
    if (response.data && response.data.results) {
      console.log(`✅ Fetched ${response.data.results.length} parents`);
      return response.data.results;
    }
    
    // Fallback: Use pagination
    let allParents = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const pageResponse = await getAllParents({ page, page_size: 100 });
      const parents = pageResponse.results || [];
      allParents = [...allParents, ...parents];
      
      const totalPages = Math.ceil((pageResponse.count || 0) / 100);
      hasMore = page < totalPages;
      page++;
    }
    
    console.log(`✅ Fetched ${allParents.length} total parents via pagination`);
    return allParents;
    
  } catch (error) {
    console.error('Error fetching all parents:', error);
    throw error;
  }
};

export const getAllParentsForPrint = getAllParentsForExport;

/**
 * Download ALL parents as CSV using the bulk download endpoint
 */
export const downloadAllParentsCSV = async () => {
  try {
    console.log('📥 Downloading all parents as CSV...');
    
    // Use the API instance (which already handles authentication)
    const response = await api.get('/parents/bulk-download/', {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    const contentDisposition = response.headers['content-disposition'];
    let filename = `parents_${new Date().toISOString().split('T')[0]}.csv`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];
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
    throw new Error('Failed to download parents data');
  }
};

/**
 * Bulk upload parents from CSV
 */
export const bulkUploadParents = async (file) => {
  try {
    console.log('📤 Starting bulk upload...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/parents/bulk-upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
    });
    
    console.log('✅ Bulk upload successful:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Bulk upload error:', error);
    
    let errorMessage = 'Failed to upload parents';
    
    if (error.response?.data) {
      if (error.response.data.error) errorMessage = error.response.data.error;
      else if (error.response.data.detail) errorMessage = error.response.data.detail;
      else if (typeof error.response.data === 'string') errorMessage = error.response.data;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Download CSV template for bulk upload
 */
export const downloadParentBulkUploadTemplate = () => {
  const headers = [
    'first_name', 'last_name', 'email', 'phone_number', 'parent_type', 'gender',
    'date_of_birth', 'address', 'city', 'state_of_origin', 'lga', 'nationality',
    'occupation', 'employer', 'office_phone', 'marital_status', 'emergency_contact_name',
    'emergency_contact_phone', 'emergency_contact_relationship', 'preferred_communication',
    'is_pta_member', 'password', 'relationship_type',
    'children_admission_numbers', 'children_student_ids'
  ];
  
  const exampleRow = [
    'John', 'Doe', 'john.doe@example.com', '08012345678', 'father', 'male',
    '1980-01-01', '123 Main St', 'Lagos', 'lagos', 'Ikeja', 'Nigerian',
    'Engineer', 'Tech Corp', '08012345678', 'married', 'Jane Doe',
    '08087654321', 'Spouse', 'whatsapp', 'Yes', 'Parent@2024', 'father',
    'STU001;STU002;STU003', 'STD001;STD002;STD003'
  ];
  
  const csvContent = [headers, exampleRow].map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'parent_upload_template.csv';
  link.click();
  URL.revokeObjectURL(link.href);
};

/**
 * Validate CSV file before upload
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

/**
 * Update parent password
 */
export const updateParentPassword = async (parentId, passwordData) => {
  try {
    console.log(`🔐 ADMIN resetting password for parent ${parentId}...`);
    
    if (!passwordData.new_password || !passwordData.confirm_password) {
      throw new Error('Both password fields are required');
    }
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      throw new Error('Passwords do not match');
    }
    
    if (passwordData.new_password.length < 5) {
      throw new Error('Password must be at least 5 characters long');
    }
    
    const response = await api.post(`/parents/${parentId}/update-password/`, {
      new_password: passwordData.new_password,
      confirm_password: passwordData.confirm_password
    });
    
    console.log('✅ Password update successful');
    return response.data;
    
  } catch (error) {
    console.error(`❌ Password update error for parent ${parentId}:`, error);
    throw error;
  }
};

// =====================
// EXPORT SERVICE OBJECT
// =====================

const parentService = {
  // CRUD Operations
  getAllParents,
  getParents,
  getParentById,
  createParent,
  createParentUser,
  createParentWithUser,
  updateParent,
  deleteParent,
  
  // Archive/Restore
  archiveParent,
  restoreParent,
  
  // Search
  searchParents,
  searchStudentsForParent,
  searchParentsForLinking,
  
  // Children Management
  getParentChildren,
  linkChildToParent,
  
  // Dashboard & Statistics
  getParentDashboard,
  getParentStatistics,
  checkParentExists,
  
  // Declaration & PTA
  acceptDeclaration,
  managePTA,
  
  // Parent Portal
  getParentPortalDashboard,
  getParentPortalChildDetail,
  
  // Bulk Operations
  getAllParentsForExport,
  bulkUploadParents,
  downloadAllParentsCSV,
  downloadParentBulkUploadTemplate,
  validateBulkUploadFile,
  
  // Password Management
  updateParentPassword,
};

export default parentService;