import { get, post, put, del } from './api';

const BASE = '/payments';

export const getActiveBankAccounts = async () => {
  try {
    const response = await get(`${BASE}/bank-accounts/active/`);
    return response.data || response;
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return { bank_accounts: [] };
  }
};

export const getBankAccounts = async () => {
  try {
    const response = await get(`${BASE}/bank-accounts/`);
    return response.data || response;
  } catch (error) {
    throw error;
  }
};

export const createBankAccount = async (data) => {
  try {
    const response = await post(`${BASE}/bank-accounts/`, data);
    return response.data || response;
  } catch (error) {
    throw error;
  }
};

export const updateBankAccount = async (id, data) => {
  try {
    const response = await put(`${BASE}/bank-accounts/${id}/`, data);
    return response.data || response;
  } catch (error) {
    throw error;
  }
};

export const deleteBankAccount = async (id) => {
  try {
    const response = await del(`${BASE}/bank-accounts/${id}/`);
    return response.data || response;
  } catch (error) {
    throw error;
  }
};

export default {
  getActiveBankAccounts,
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
};