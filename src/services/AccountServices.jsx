// src/services/accountService.jsx
import axios from 'axios';

const API_URL = 'http://localhost:3001/accounts';

export const getAccountLogin = async (email, password) => {
  try {
    const response = await axios.get(API_URL, {
      params: { email, password }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching account login:', error);
    throw error;
  }
};

export const getAccountById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account by ID:', error);
    throw error;
  }
};

export const addAccount = async (accountData) => {
  try {
    const response = await axios.post(API_URL, accountData);
    return response.data;
  } catch (error) {
    console.error('Error adding account:', error);
    throw error;
  }
};

export const updateAccount = async (id, accountData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, accountData);
    return response.data;
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};
