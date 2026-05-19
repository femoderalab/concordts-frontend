/**
 * Library Service - Handles all library API calls
 */

import { get, post, put, del } from './api';

const BASE = '/library';

// ================================================================
// BOOK CRUD
// ================================================================

export const getBooks = async (params = {}) => {
  try {
    const response = await get(`${BASE}/books/`, { params });
    return response.data || response;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookById = async (bookId) => {
  try {
    const response = await get(`${BASE}/books/${bookId}/`);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching book ${bookId}:`, error);
    throw error;
  }
};

export const createBook = async (formData) => {
  try {
    const response = await post(`${BASE}/books/create/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data || response;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

export const updateBook = async (bookId, formData) => {
  try {
    const response = await put(`${BASE}/books/${bookId}/update/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data || response;
  } catch (error) {
    console.error(`Error updating book ${bookId}:`, error);
    throw error;
  }
};

export const deleteBook = async (bookId) => {
  try {
    const response = await del(`${BASE}/books/${bookId}/delete/`);
    return response.data || response;
  } catch (error) {
    console.error(`Error deleting book ${bookId}:`, error);
    throw error;
  }
};

export const downloadBook = async (bookId) => {
  try {
    const response = await post(`${BASE}/books/${bookId}/download/`);
    return response.data || response;
  } catch (error) {
    console.error(`Error downloading book ${bookId}:`, error);
    throw error;
  }
};

// ================================================================
// STATISTICS & ACTIVITIES
// ================================================================

export const getLibraryStatistics = async () => {
  try {
    const response = await get(`${BASE}/statistics/`);
    return response.data || response;
  } catch (error) {
    console.error('Error fetching library statistics:', error);
    throw error;
  }
};

export const getLibraryRecentActivities = async (limit = 20) => {
  try {
    const response = await get(`${BASE}/recent-activities/`, { params: { limit } });
    return response.data || response;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

// ================================================================
// EXPORT
// ================================================================

const libraryService = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  downloadBook,
  getLibraryStatistics,
  getLibraryRecentActivities,
};

export default libraryService;