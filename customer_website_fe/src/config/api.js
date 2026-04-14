// API Configuration
// Replace these URLs with your actual backend endpoints

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002/api';

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_DETAIL: (id) => `${API_BASE_URL}/products/${id}`,

  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_DETAIL: (id) => `${API_BASE_URL}/orders/${id}`,

  // Customer/User
  REGISTER: `${API_BASE_URL}/customers/register`,
  LOGIN: `${API_BASE_URL}/customers/login`,
  UPDATE_PROFILE: `${API_BASE_URL}/customers/update`,
  PROFILE: (id) => `${API_BASE_URL}/customers/${id}`,

  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

export default API_BASE_URL;
};

// Helper function for API calls
export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

export default API_ENDPOINTS;
