import axios from 'axios';

const BASE_URL = 'http://localhost:5129/api/auth';

// Customer Registration
export const registerCustomer = async (userData) => {
  const response = await axios.post(`${BASE_URL}/register`, userData);
  return response.data;
};

// Distributor Registration
export const registerDistributor = async (userData) => {
  const response = await axios.post(`${BASE_URL}/register-distributor`, userData);
  return response.data;
};

// Customer Login
export const loginCustomer = async (credentials) => {
  const response = await axios.post(`${BASE_URL}/login`, credentials);
  return response.data;
};

// Distributor Login
export const loginDistributor = async (credentials) => {
  const response = await axios.post(`${BASE_URL}/login-distributor`, credentials);
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await axios.post(`${BASE_URL}/logout`);
  return response.data;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Set current user in localStorage
export const setCurrentUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove current user from localStorage
export const removeCurrentUser = () => {
  localStorage.removeItem('user');
};
