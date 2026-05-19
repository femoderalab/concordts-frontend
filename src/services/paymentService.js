/**
 * Payment Service - Complete payment management
 */

import { get, post, put, del } from './api';

const BASE = '/payments';

// =====================
// FEE STRUCTURES (Admin)
// =====================

export const getFeeStructures = async (params = {}) => {
  try {
    const response = await get(`${BASE}/fee-structures/`, { params });
    return response.data || response;
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    throw error;
  }
};

export const getFeeStructureById = async (id) => {
  try {
    const response = await get(`${BASE}/fee-structures/${id}/`);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching fee structure ${id}:`, error);
    throw error;
  }
};

export const createFeeStructure = async (data) => {
  try {
    const response = await post(`${BASE}/fee-structures/`, data);
    return response.data || response;
  } catch (error) {
    console.error('Error creating fee structure:', error);
    throw error;
  }
};

export const updateFeeStructure = async (id, data) => {
  try {
    const response = await put(`${BASE}/fee-structures/${id}/`, data);
    return response.data || response;
  } catch (error) {
    console.error(`Error updating fee structure ${id}:`, error);
    throw error;
  }
};

export const deleteFeeStructure = async (id) => {
  try {
    const response = await del(`${BASE}/fee-structures/${id}/`);
    return response.data || response;
  } catch (error) {
    console.error(`Error deleting fee structure ${id}:`, error);
    throw error;
  }
};

export const bulkCreateFeeStructures = async (data) => {
  try {
    const response = await post(`${BASE}/fee-structures/bulk-create/`, data);
    return response.data || response;
  } catch (error) {
    console.error('Error bulk creating fee structures:', error);
    throw error;
  }
};

// =====================
// INVOICES
// =====================

export const getInvoices = async (params = {}) => {
  try {
    const response = await get(`${BASE}/invoices/`, { params });
    return response.data || response;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

export const getMyInvoices = async () => {
  try {
    const response = await get(`${BASE}/invoices/my/`);
    return response.data || response;
  } catch (error) {
    console.error('Error fetching my invoices:', error);
    throw error;
  }
};

export const getInvoiceById = async (id) => {
  try {
    const response = await get(`${BASE}/invoices/${id}/`);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    throw error;
  }
};

export const generateInvoice = async (data) => {
  try {
    const response = await post(`${BASE}/invoices/generate/`, data);
    return response.data || response;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

export const bulkGenerateInvoices = async (data) => {
  try {
    const response = await post(`${BASE}/invoices/bulk-generate/`, data);
    return response.data || response;
  } catch (error) {
    console.error('Error bulk generating invoices:', error);
    throw error;
  }
};

// =====================
// PAYMENTS
// =====================

export const initializePayment = async (data) => {
  try {
    const response = await post(`${BASE}/payments/initialize/`, data);
    return response.data || response;
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
};

export const verifyPayment = async (reference) => {
  try {
    const response = await get(`${BASE}/payments/verify/?reference=${reference}`);
    return response.data || response;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

export const getPaymentHistory = async (params = {}) => {
  try {
    const response = await get(`${BASE}/payments/history/`, { params });
    return response.data || response;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

export const recordManualPayment = async (formData) => {
  try {
    const response = await post(`${BASE}/payments/manual/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data || response;
  } catch (error) {
    console.error('Error recording manual payment:', error);
    throw error;
  }
};

export const verifyManualPayment = async (data) => {
  try {
    const response = await post(`${BASE}/payments/manual/verify/`, data);
    return response.data || response;
  } catch (error) {
    console.error('Error verifying manual payment:', error);
    throw error;
  }
};

export const getPaymentStatistics = async (params = {}) => {
  try {
    const response = await get(`${BASE}/payments/statistics/`, { params });
    return response.data || response;
  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    throw error;
  }
};

// =====================
// UTILITIES
// =====================

export const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('paystack-script')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.body.appendChild(script);
  });
};

// Add this function to your paymentService.js
export const getAllInvoices = async (params = {}) => {
  try {
    const response = await get('/payments/invoices/', { params });
    return response;
  } catch (error) {
    console.error('Error fetching all invoices:', error);
    return { results: [] };
  }
};

const paymentService = {
  // Fee Structures
  getFeeStructures,
  getFeeStructureById,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  bulkCreateFeeStructures,
  
  // Invoices
  getInvoices,
  getMyInvoices,
  getInvoiceById,
  generateInvoice,
  bulkGenerateInvoices,
  
  // Payments
  initializePayment,
  verifyPayment,
  getPaymentHistory,
  recordManualPayment,
  verifyManualPayment,
  getPaymentStatistics,
  
  // Utilities
  loadPaystackScript,
  getAllInvoices,
};

export default paymentService;