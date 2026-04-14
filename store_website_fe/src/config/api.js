const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PRODUCTS: `${API_BASE_URL}/products`,
  PROFILE: `${API_BASE_URL}/profile`,
};

export default API_BASE_URL;
