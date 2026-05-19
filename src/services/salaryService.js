import { get, post, put } from './api';

// Get salary payments for a specific month
export const getSalaryPayments = async (params = {}) => {
  try {
    const response = await get('/payments/salary-payments/', { params });
    return response;
  } catch (error) {
    console.error('Error fetching salary payments:', error);
    return { results: [] };
  }
};

// Create a salary payment
export const createSalaryPayment = async (data) => {
  try {
    const response = await post('/payments/salary-payments/', data);
    return response;
  } catch (error) {
    console.error('Error creating salary payment:', error);
    throw error;
  }
};

// Update a salary payment
export const updateSalaryPayment = async (id, data) => {
  try {
    const response = await put(`/payments/salary-payments/${id}/`, data);
    return response;
  } catch (error) {
    console.error('Error updating salary payment:', error);
    throw error;
  }
};

export default {
  getSalaryPayments,
  createSalaryPayment,
  updateSalaryPayment,
};