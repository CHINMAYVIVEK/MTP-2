const API_BASE_URL = process.env.REACT_APP_STORE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/stores/users/login`,
  REGISTER: `${API_BASE_URL}/stores/users`,
  PRODUCTS: `${API_BASE_URL}/stores/products`,
  PROFILE: `${API_BASE_URL}/stores/users`,
};

export default API_BASE_URL;
